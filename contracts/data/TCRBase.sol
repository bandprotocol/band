pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../token/ERC20Acceptor.sol";
import "../utils/Expression.sol";
import "../utils/Fractional.sol";
import "../Parameters.sol";

contract TCRBase is ERC20Acceptor {
  using Fractional for uint256;
  using SafeMath for uint256;

  event ApplicationSubmitted(bytes32 data, address indexed proposer, uint256 listAt, uint256 deposit);
  event EntryDeposited(bytes32 indexed data, uint256 value);
  event EntryWithdrawn(bytes32 indexed data,uint256 value);
  event EntryExited(bytes32 indexed data);
  event ChallengeInitiated(bytes32 indexed data, uint256 indexed challengeId, address indexed challenger, uint256 stake, bytes32 reasonData, uint256 proposerVote, uint256 challengerVote);
  event ChallengeVoteCommitted(uint256 indexed challengeId,address indexed voter, bytes32 commitValue, uint256 weight);
  event ChallengeVoteRevealed(uint256 indexed challengeId,address indexed voter, bool voteKeep);
  event ChallengeSuccess(bytes32 indexed data,uint256 indexed challengeId, uint256 voterRewardPool, uint256 challengerReward);
  event ChallengeFailed(bytes32 indexed data,uint256 indexed challengeId, uint256 voterRewardPool, uint256 proposerReward);
  event ChallengeInconclusive(bytes32 indexed data,uint256 indexed challengeId);
  event ChallengeRewardClaimed(uint256 indexed challengeId,address indexed voter, uint256 reward);

  Expression public depositDecayFunction;
  Parameters public params;
  SnapshotToken public token;
  bytes8 public prefix;

  /// A TCR entry is considered to exist in 'entries' map iff its 'listedAt' is nonzero.
  struct Entry {
    address proposer;        /// The entry proposer
    uint256 deposit;         /// Amount token that is not on challenge stake
    uint256 listedAt;        /// Expiration time of entry's 'pending' status
    uint256 challengeId;     /// Id of challenge, applicable if not zero
  }
  enum ChallengeState { Invalid, Open, Kept, Removed, Inconclusive }
  enum VoteStatus { Nothing, Committed, VoteKeep, VoteRemove, Claimed }

  /// A challenge represent a challenge for a TCR entry.
  struct Challenge {
    bytes32 entryData;            /// The hash of data that is in question
    bytes32 reasonData;           /// The hash of reason for this challenge
    address challenger;           /// The challenger
    uint256 rewardPool;           /// Remaining reward pool. Relevant after resolved.
    uint256 remainingRewardVotes; /// Remaining voting power to claim rewards.
    uint256 commitEndTime;
    uint256 revealEndTime;
    uint256 snapshotNonce;
    uint256 voteRemoveRequiredPct;
    uint256 voteMinParticipation;
    uint256 keepCount;
    uint256 removeCount;
    uint256 totalCommitCount;
    mapping (address => bytes32) voteCommits;
    mapping (address => VoteStatus) voteStatuses;
    ChallengeState state;
  }

  mapping (bytes32 => Entry) public entries;
  mapping (uint256 => Challenge) public challenges;
  uint256 nextChallengeNonce = 1;

  constructor(
    bytes8 _prefix,
    Expression decayFunction,
    Parameters _params
  ) public {
    depositDecayFunction = decayFunction;
    params = _params;
    prefix = _prefix;
    token = _params.token();
  }

  modifier entryMustExist(bytes32 data) {
    require(entries[data].listedAt > 0);
    _;
  }

  modifier entryMustNotExist(bytes32 data) {
    require(entries[data].listedAt == 0);
    _;
  }

  function isEntryActive(bytes32 data) public view returns (bool) {
    uint256 listedAt = entries[data].listedAt;
    return listedAt != 0 && now >= listedAt;
  }

  function getVoteStatus(uint256 challengeId, address voter) public view returns (VoteStatus) {
    return challenges[challengeId].voteStatuses[voter];
  }

  function currentMinDeposit(bytes32 entryData) public view entryMustExist(entryData) returns (uint256) {
    Entry storage entry = entries[entryData];
    uint256 minDeposit = params.get(prefix, "min_deposit");
    if (now < entry.listedAt) {
      return minDeposit;
    } else {
      return depositDecayFunction.evaluate(now.sub(entry.listedAt)).mulFrac(minDeposit);
    }
  }

  /// Apply a new entry to the TCR. The applicant must stake token at least `min_deposit`.
  /// Application will get auto-approved if no challenge happens in `apply_stage_length` seconds.
  function applyEntry(address proposer, uint256 stake, bytes32 data)
    public
    requireToken(token, proposer, stake)
    entryMustNotExist(data)
  {
    require(stake >= params.get(prefix, "min_deposit"));
    Entry storage entry = entries[data];
    entry.proposer = proposer;
    entry.deposit = stake;
    entry.listedAt = now.add(params.get(prefix, "apply_stage_length"));
    emit ApplicationSubmitted(data, proposer, entry.listedAt, stake);
  }

  function deposit(address depositor, uint256 amount, bytes32 data)
    public
    requireToken(token, depositor, amount)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == depositor);
    entry.deposit = entry.deposit.add(amount);
    emit EntryDeposited(data, amount);
  }

  function withdraw(bytes32 data, uint256 amount)
    public
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    if (entry.challengeId == 0) {
      require(entry.deposit >= amount.add(currentMinDeposit(data)));
    } else {
      require(entry.deposit >= amount);
    }
    entry.deposit = entry.deposit.sub(amount);
    require(token.transfer(msg.sender, amount));
    emit EntryWithdrawn(data, amount);
  }

  function exit(bytes32 data) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.challengeId == 0);
    _deleteEntry(data);
    emit EntryExited(data);
  }

  function initiateChallenge(address challenger, uint256 challengeDeposit, bytes32 data, bytes32 reasonData)
    public
    requireToken(token, challenger, challengeDeposit)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.challengeId == 0 && entry.proposer != challenger);
    uint256 stake = Math.min(entry.deposit, currentMinDeposit(data));
    require(challengeDeposit >= stake);
    if (challengeDeposit != stake) {
      require(token.transfer(challenger, challengeDeposit.sub(stake)));
    }
    entry.deposit = entry.deposit.sub(stake);
    uint256 challengeId = nextChallengeNonce;
    uint256 proposerVote = token.historicalVotingPowerAtNonce(entry.proposer, token.votingPowerChangeNonce());
    uint256 challengerVote = token.historicalVotingPowerAtNonce(challenger, token.votingPowerChangeNonce());
    nextChallengeNonce = challengeId.add(1);
    challenges[challengeId] = Challenge({
      entryData: data,
      reasonData: reasonData,
      challenger: challenger,
      rewardPool: stake,
      remainingRewardVotes: 0,
      commitEndTime: now.add(params.get(prefix, "commit_time")),
      revealEndTime: now.add(params.get(prefix, "commit_time")).add(params.get(prefix, "reveal_time")),
      snapshotNonce: token.votingPowerChangeNonce(),
      voteRemoveRequiredPct: params.get(prefix, "support_required_pct"),
      voteMinParticipation: params.get(prefix, "min_participation_pct").mulFrac(token.totalSupply()),
      keepCount: proposerVote,
      removeCount: challengerVote,
      totalCommitCount: proposerVote.add(challengerVote),
      state: ChallengeState.Open
    });
    entry.challengeId = challengeId;
    challenges[challengeId].voteStatuses[entry.proposer] = VoteStatus.VoteKeep;
    challenges[challengeId].voteStatuses[challenger] = VoteStatus.VoteRemove;
    emit ChallengeInitiated(data, challengeId, challenger, stake, reasonData, proposerVote, challengerVote);
  }

  function commitVote(uint256 challengeId, bytes32 commitValue) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.state == ChallengeState.Open && now < challenge.commitEndTime);
    require(challenge.voteStatuses[msg.sender] == VoteStatus.Nothing);
    challenge.voteCommits[msg.sender] = commitValue;
    challenge.voteStatuses[msg.sender] = VoteStatus.Committed;
    uint256 weight = token.historicalVotingPowerAtNonce(msg.sender, challenge.snapshotNonce);
    challenge.totalCommitCount = challenge.totalCommitCount.add(weight);
    emit ChallengeVoteCommitted(challengeId, msg.sender, commitValue, weight);
  }

  function revealVote(address voter, uint256 challengeId, bool voteKeep, uint256 salt) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.state == ChallengeState.Open);
    require(now >= challenge.commitEndTime && now < challenge.revealEndTime);
    require(challenge.voteStatuses[voter] == VoteStatus.Committed);
    require(challenge.voteCommits[voter] == keccak256(abi.encodePacked(voteKeep, salt)));
    uint256 weight = token.historicalVotingPowerAtNonce(voter, challenge.snapshotNonce);
    if (voteKeep) {
      challenge.keepCount = challenge.keepCount.add(weight);
      challenge.voteStatuses[voter] = VoteStatus.VoteKeep;
    } else {
      challenge.removeCount = challenge.removeCount.add(weight);
      challenge.voteStatuses[voter] = VoteStatus.VoteRemove;
    }
    emit ChallengeVoteRevealed(challengeId, voter, voteKeep);
  }

  /// Resolve TCR challenge. If the challenge succeeds, the entry will be removed and the challenger
  /// gets the reward. Otherwise, the entry's `deposit` gets bumped by the reward.
  function resolveChallenge(uint256 challengeId) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.state == ChallengeState.Open);
    ChallengeState result = _getChallengeResult(challenge);
    challenge.state = result;
    bytes32 data = challenge.entryData;
    Entry storage entry = entries[data];
    assert(entry.challengeId == challengeId);
    entry.challengeId = 0;
    uint256 challengerStake = challenge.rewardPool;
    uint256 winnerExtraReward = params.get(prefix, "dispensation_percentage").mulFrac(challengerStake);
    uint256 winnerTotalReward = challengerStake.add(winnerExtraReward);
    uint256 rewardPool = challengerStake.sub(winnerExtraReward);
    if (result == ChallengeState.Kept) {
      uint256 proposerVote = token.historicalVotingPowerAtNonce(entry.proposer, challenge.snapshotNonce);
      uint256 proposerVoteReward = rewardPool.mul(proposerVote).div(challenge.keepCount);
      winnerTotalReward = winnerTotalReward.add(proposerVoteReward);
      entry.deposit = entry.deposit.add(winnerTotalReward);
      challenge.rewardPool = rewardPool.sub(proposerVoteReward);
      challenge.remainingRewardVotes = challenge.keepCount.sub(proposerVote);
      challenge.voteStatuses[entry.proposer] = VoteStatus.Claimed;
      emit ChallengeFailed(data, challengeId, challenge.rewardPool, winnerTotalReward);
    } else if (result == ChallengeState.Removed) {
      uint256 challengerVote = token.historicalVotingPowerAtNonce(challenge.challenger, challenge.snapshotNonce);
      uint256 challengerVoteReward = rewardPool.mul(challengerVote).div(challenge.removeCount);
      winnerTotalReward = winnerTotalReward.add(challengerVoteReward);
      require(token.transfer(challenge.challenger, winnerTotalReward));
      challenge.rewardPool = rewardPool.sub(challengerVoteReward);
      challenge.remainingRewardVotes = challenge.removeCount.sub(challengerVote);
      _deleteEntry(data);
      challenge.voteStatuses[challenge.challenger] = VoteStatus.Claimed;
      emit ChallengeSuccess(data, challengeId, challenge.rewardPool, winnerTotalReward);
    } else if (result == ChallengeState.Inconclusive) {
      entry.deposit = entry.deposit.add(challengerStake);
      require(token.transfer(challenge.challenger, challengerStake));
      challenge.rewardPool = 0;
      emit ChallengeInconclusive(data, challengeId);
    } else {
      assert(false);
    }
  }

  function claimReward(address voter, uint256 challengeId) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.remainingRewardVotes > 0);
    if (challenge.state == ChallengeState.Kept) {
      require(challenge.voteStatuses[voter] == VoteStatus.VoteKeep);
    } else if (challenge.state == ChallengeState.Removed) {
      require(challenge.voteStatuses[voter] == VoteStatus.VoteRemove);
    } else {
      revert();
    }
    challenge.voteStatuses[voter] = VoteStatus.Claimed;
    uint256 weight = token.historicalVotingPowerAtNonce(voter, challenge.snapshotNonce);
    if (weight > 0) {
      uint256 remainingRewardPool = challenge.rewardPool;
      uint256 remainingRewardVotes = challenge.remainingRewardVotes;
      uint256 reward = remainingRewardPool.mul(weight).div(remainingRewardVotes);
      challenge.remainingRewardVotes = remainingRewardVotes.sub(weight);
      challenge.rewardPool = remainingRewardPool.sub(reward);
      require(token.transfer(voter, reward));
      emit ChallengeRewardClaimed(challengeId, voter, reward);
    }
  }

  function _getChallengeResult(Challenge storage challenge) internal view returns (ChallengeState)
  {
    assert(challenge.state == ChallengeState.Open);
    require(now >= challenge.commitEndTime);
    if (challenge.totalCommitCount < challenge.voteMinParticipation) {
      return ChallengeState.Inconclusive;
    }
    uint256 keepCount = challenge.keepCount;
    uint256 removeCount = challenge.removeCount;
    if (keepCount == 0 && removeCount == 0) {
      return ChallengeState.Inconclusive;
    }
    if (removeCount.mul(Fractional.getDenominator()) >= challenge.voteRemoveRequiredPct.mul(keepCount.add(removeCount))) {
      return ChallengeState.Removed;
    } else {
      return ChallengeState.Kept;
    }
  }

  function _deleteEntry(bytes32 data) internal {
    uint256 entryDeposit = entries[data].deposit;
    address proposer = entries[data].proposer;
    if (entryDeposit > 0) {
      require(token.transfer(proposer, entryDeposit));
    }
    delete entries[data];
  }
}
