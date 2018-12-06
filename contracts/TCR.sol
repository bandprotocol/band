pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./CommunityToken.sol";
import "./Parameters.sol";


/**
 * @title TCR
 *
 * @dev TCR contract implements Token Curated Registry logic.
 */
contract TCR {
  using SafeMath for uint256;

  event ApplicationSubmitted(  // A new entry is submitted to the TCR.
    bytes32 indexed data,
    address indexed proposer
  );

  event EntryDeleted(  // An entry is removed from the TCR
    bytes32 indexed data,
    address indexed proposer
  );

  event EntryDeposited(  // Someone deposits token to an entry
    bytes32 indexed data,
    address indexed proposer,
    uint256 value
  );

  event EntryWithdrawn(  // Someone withdraws token from an entry
    bytes32 indexed data,
    address indexed proposer,
    uint256 value
  );

  event EntryExited(  // An entry is exited
    bytes32 indexed data,
    address indexed proposer
  );

  event ChallengeInitiated(  // An new challenge is initiated.
    bytes32 indexed data,
    uint256 indexed challengeID,
    address indexed challenger
  );

  event ChallengeResolved(  // A challenge is resolved.
    bytes32 indexed data,
    uint256 indexed challengeID,
    Vote indexed result,
    uint256 rewardPool
  );

  event ChallengeRewardClaimed(  // A reward is claimed by a user.
    uint256 indexed challengeID,
    address indexed voter,
    uint256 reward
  );

  event ChallengeVoteCommitted(  // A vote is committed by a user.
    uint256 indexed challengeID,
    address indexed voter,
    bytes32 voteHash
  );

  event ChallengeVoteRevealed(  // A vote is revealed by a user.
    uint256 indexed challengeID,
    address indexed voter,
    uint256 yesWieght,
    uint256 noWeight,
    uint256 salt
  );

  CommunityToken public token;
  Parameters public params;

  // Namespace prefix for all parameters (See Parameters.sol) for usage inside
  // this TCR.
  bytes8 public prefix;

  // A TCR entry is considered to exist in 'entries' map iff its
  // 'pendingExpiration' is nonzero.
  struct Entry {
    address proposer;             // The entry proposer
    uint256 withdrawableDeposit;  // Amount token that is not on challenge stake
    uint256 pendingExpiration;    // Expiration time of entry's 'pending' status
    uint256 challengeID;          // ID of challenge, applicable if not zero
  }

  enum Vote {
    Invalid,      // Invalid, default value
    Yes,          // Vote Yes (agree on the side of challenger)
    No,           // Vote No (agree on the side of entry proposer)
    Inconclusive  // Vote result to be Inconclusive
  }

  enum VoteState {
    Invalid,      // Invalid, default value
    Committed,    // The vote has been committed, but not yet revealed.
    Revealed,     // The vote has been revealed, but not yet claimed.
    Claimed       // The reward has been collected.
  }

  // A challenge represent a challenge for a TCR entry. All challenges ever
  // existed are stored in 'challenges' map below.
  struct Challenge {
    bytes32 entryData;      // The data that is in question
    address challenger;     // The challenger
    uint256 rewardPool;     // Remaining reward pool. Relevant after resolved.
    uint256 remainingVotes; // Remaining voting power that not yet claims reward

    uint256 snapshotBlockno;  // The block number to count voting power
    uint256 commitEndTime;    // Expiration timestamp of commit period
    uint256 revealEndTime;    // Expiration timestamp of reveal period

    uint256 yesCount;       // The current total number of YES votes
    uint256 noCount;        // The current total number of NO votes

    mapping (address => bytes32) commits;       // Each user's committed vote
    mapping (address => uint256) yesWeights;    // Each user's yes vote weight
    mapping (address => uint256) noWeights;     // Each user's no vote weight
    mapping (address => VoteState) voteStates;  // Each user's vote state

    // Vote result. Relevant after this challenge is resolved.
    // Can be Yes, No, or Inconclusive.
    Vote result;
  }

  // Mapping of entry to its metadata. An entry is considered exist if its
  // 'pendingExpiration' is nonzero.
  mapping (bytes32 => Entry) public entries;

  // Mapping of all changes ever exist in this contract.
  mapping (uint256 => Challenge) public challenges;

  // The ID of the next challenge.
  uint256 nextChallengeNonce = 1;


  constructor(bytes8 _prefix, Parameters _params) public {
    prefix = _prefix;
    token = _params.token();
    params = _params;
  }

  modifier entryMustExist(bytes32 data) {
    require(entries[data].pendingExpiration > 0);
    _;
  }

  modifier entryMustNotExist(bytes32 data) {
    require(entries[data].pendingExpiration == 0);
    _;
  }

  modifier challengeMustExist(uint256 challengeID) {
    require(challengeID > 0 && challengeID < nextChallengeNonce);
    _;
  }

  /**
   * @dev Return true iff the given entry is considered active in TCR at the
   * moment.
   */
  function isEntryActive(bytes32 data) public view returns (bool) {
    uint256 pendingExpiration = entries[data].pendingExpiration;
    return pendingExpiration > 0 && now >= pendingExpiration;
  }

  /**
   * @dev Get parameter config on the given key. Note that it prepend the key
   * with this contract's prefix to get the absolute key.
   */
  function get(bytes24 key) public view returns (uint256) {
    uint8 prefixSize = 0;
    while (prefixSize < 8 && prefix[prefixSize] != byte(0)) {
      ++prefixSize;
    }
    return params.get(bytes32(prefix) | (bytes32(key) >> (8 * prefixSize)));
  }

  /**
   * @dev Return the summary of user vote status on a particular challenge.
   * See function signature for the values this function returns.
   */
  function voteSummary(uint256 challengeID, address voter)
    public
    view
    challengeMustExist(challengeID)
    returns (VoteState state, bytes32 commit, uint256 yesWeight, uint256 noWeight)
  {
    commit = challenges[challengeID].commits[voter];
    yesWeight = challenges[challengeID].yesWeights[voter];
    noWeight = challenges[challengeID].noWeights[voter];
    state = challenges[challengeID].voteStates[voter];
  }

  /**
   * @dev Apply a new entry to the TCR. The applicant must stake token at least
   * 'min_deposit'. Application will get auto-approved if no challenge happens
   * during the first 'apply_stage_length' seconds.
   */
  function apply(bytes32 data, uint256 stake) public entryMustNotExist(data) {
    require(token.transferFrom(msg.sender, this, stake));
    require(stake >= get("min_deposit"));
    Entry storage entry = entries[data];
    entry.proposer = msg.sender;
    entry.withdrawableDeposit = stake;
    entry.pendingExpiration = now.add(get("apply_stage_length"));
    emit ApplicationSubmitted(data, msg.sender);
  }

  /**
   * @dev Deposit more token to the given existing entry. The depositor must
   * be the entry applicant.
   */
  function deposit(bytes32 data, uint256 amount) public entryMustExist(data) {
    require(token.transferFrom(msg.sender, this, amount));
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    entry.withdrawableDeposit = entry.withdrawableDeposit.add(amount);
    emit EntryDeposited(data, msg.sender, amount);
  }

  /**
   * @dev Withdraw token from the given existing entry to the applicant.
   */
  function withdraw(bytes32 data, uint256 amount) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.withdrawableDeposit >= amount);
    entry.withdrawableDeposit -= amount;
    require(token.transfer(msg.sender, amount));
    emit EntryWithdrawn(data, msg.sender, amount);
  }

  /**
   * @dev Delete the entry and refund everything to entry applicant. The entry
   * must not have an ongoing challenge.
   */
  function exit(bytes32 data) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.challengeID == 0);
    deleteEntry(data);
    emit EntryExited(data, msg.sender);
  }

  /**
   * @dev Initiate a new challenge to the given existing entry. The entry must
   * not already have ongoing challenge. If entry's deposit is less than
   * 'min_deposit', it is automatically deleted.
   */
  function initiateChallenge(bytes32 data) public entryMustExist(data) {
    uint256 stake = get("min_deposit");
    Entry storage entry = entries[data];

    // There must not already be an ongoing challenge.
    require(entry.challengeID == 0);

    if (entry.withdrawableDeposit < stake) {
      // If the deposit is too low, the entry is auto-removed.
      deleteEntry(data);
      return;
    }

    // Take 'stake' tokens from both entry owner and challenger.
    require(token.transferFrom(msg.sender, this, stake));
    entry.withdrawableDeposit -= stake;

    uint256 challengeID = nextChallengeNonce;
    uint256 commitTime = get("commit_time");
    uint256 revealTime = get("reveal_time");

    entry.challengeID = challengeID;
    challenges[challengeID].entryData = data;
    challenges[challengeID].challenger = msg.sender;
    challenges[challengeID].rewardPool = stake.mul(2);
    challenges[challengeID].snapshotBlockno = block.number.sub(1);
    challenges[challengeID].commitEndTime = now.add(commitTime);
    challenges[challengeID].revealEndTime = now.add(commitTime).add(revealTime);

    // Increment the nonce for the next challenge.
    nextChallengeNonce = challengeID.add(1);
    emit ChallengeInitiated(data, challengeID, msg.sender);
  }

  /**
   * @dev Commit vote to a particular challenge, with commitValue. commitVote
   * can be called repeatedly until the commit period ends.
   */
  function commitVote(uint256 challengeID, bytes32 commitValue)
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];
    require(now < challenge.commitEndTime);
    challenge.commits[msg.sender] = commitValue;
    challenge.voteStates[msg.sender] = VoteState.Committed;
    emit ChallengeVoteCommitted(challengeID, msg.sender, commitValue);
  }

  /**
   * @dev Reveal vote with choice and secret salt used in generating commit
   * earlier during the commit period.
   */
  function revealVote(
    uint256 challengeID,
    uint256 yesWeight,
    uint256 noWeight,
    uint256 salt
  )
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];
    // Must in reveal period.
    require(now >= challenge.commitEndTime && now < challenge.revealEndTime);
    // Must not already be revealed.
    require(challenge.voteStates[msg.sender] == VoteState.Committed);
    challenge.voteStates[msg.sender] = VoteState.Revealed;
    // Must be consistent with prior commit value.
    require(
      keccak256(abi.encodePacked(yesWeight, noWeight, salt)) ==
      challenge.commits[msg.sender]
    );

    // Get the weight, which is the voting power at the block before the TCR
    // challenge is initiated.
    uint256 totalWeight = token.historicalVotingPowerAtBlock(
      msg.sender,
      challenge.snapshotBlockno
    );

    require(yesWeight.add(noWeight) <= totalWeight);

    challenge.yesWeights[msg.sender] = yesWeight;
    challenge.yesCount = challenge.yesCount.add(yesWeight);

    challenge.noWeights[msg.sender] = noWeight;
    challenge.noCount = challenge.noCount.add(noWeight);

    emit ChallengeVoteRevealed(challengeID, msg.sender, yesWeight, noWeight, salt);
  }

  /**
   * @dev Resolve TCR challenge. If the challenge succeeds, the entry will be
   * removed and the challenger gets the reward. Otherwise, the entry's
   * 'withdrawableDeposit' gets bumped by the reward.
   */
  function resolveChallenge(uint256 challengeID)
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];
    require(challenge.result == Vote.Invalid);
    require(now >= challenge.revealEndTime);

    bytes32 data = challenge.entryData;
    Entry storage entry = entries[data];
    assert(entry.challengeID == challengeID);
    // After the challenge is resolved, this entry won't have ongoing challenge.
    entry.challengeID = 0;

    uint256 yesCount = challenge.yesCount;
    uint256 noCount = challenge.noCount;
    uint256 totalCount = yesCount.add(noCount);

    bool isYes = yesCount.mul(100) >= totalCount.mul(get("yes_threshold"));
    bool isNo = noCount.mul(100) >= totalCount.mul(get("no_threshold"));

    uint256 rewardPool = challenge.rewardPool;
    uint256 rewardPercentage = get("reward_percentage");
    require(rewardPercentage <= 100);
    require(rewardPercentage >= 50);

    // The reward for winning side leader (challenger/entry owner) is the
    // specified percentage of total reward pool.
    uint256 leaderReward = rewardPool.mul(rewardPercentage).div(100);

    if (isYes && !isNo) {
      challenge.result = Vote.Yes;
      // Challenge succeeds. Challenger gets reward. Entry gets removed.
      require(token.transfer(challenge.challenger, leaderReward));
      deleteEntry(data);
      // The remaining reward is distributed among Yes voters.
      challenge.rewardPool = rewardPool.sub(leaderReward);
      challenge.remainingVotes = yesCount;
    } else if (!isYes && isNo) {
      challenge.result = Vote.No;
      // Challenge fails. Entry deposit is added by reward.
      entry.withdrawableDeposit = entry.withdrawableDeposit.add(leaderReward);
      // The remaining reward is distributed among No voters.
      challenge.rewardPool = rewardPool.sub(leaderReward);
      challenge.remainingVotes = noCount;
    } else {
      challenge.result = Vote.Inconclusive;
      // Inconclusive. Both challenger and entry owner get half of the pool
      // back. The reward pool then becomes zero. Too bad for voters.
      uint256 halfRewardPool = rewardPool.div(2);
      require(token.transfer(challenge.challenger, halfRewardPool));
      entry.withdrawableDeposit = entry.withdrawableDeposit.add(halfRewardPool);
      challenge.rewardPool = 0;
    }

    emit ChallengeResolved(data, challengeID, challenge.result, rewardPool);
  }

  /**
   * @dev Claim reward for the given challenge. The claimer must already reveal
   * the vote that is consistent with vote result.
   */
  function claimReward(uint256 challengeID)
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];

    // User must already revealed their vote
    require(challenge.voteStates[msg.sender] == VoteState.Revealed);
    challenge.voteStates[msg.sender] = VoteState.Claimed;

    Vote result = challenge.result;
    uint256 claimerVotes = 0;

    if (result == Vote.Yes) {
      claimerVotes = challenge.yesWeights[msg.sender];
    } else if (result == Vote.No) {
      claimerVotes = challenge.noWeights[msg.sender];
    } else {
      // If this hits, either the challenge is not finalized yet, or the result
      // is inconclusive. In either case, there's no reward to claim.
      revert();
    }

    // User must have nonzero vote on the side that wins the challenge.
    require(claimerVotes != 0);

    uint256 rewardPool = challenge.rewardPool;
    uint256 remainingVotes = challenge.remainingVotes;

    // User reward is the portion of remaining reward based on the vote count
    // of this user.
    uint256 reward = rewardPool.mul(claimerVotes).div(remainingVotes);

    challenge.remainingVotes = remainingVotes.sub(claimerVotes);
    challenge.rewardPool = rewardPool.sub(reward);

    // Send reward to the claimer.
    require(token.transfer(msg.sender, reward));
    emit ChallengeRewardClaimed(challengeID, msg.sender, reward);
  }

  /**
   * @dev Delete the given TCR entry and refund the token to entry owner
   */
  function deleteEntry(bytes32 data) internal {
    uint256 withdrawableDeposit = entries[data].withdrawableDeposit;
    address proposer = entries[data].proposer;

    if (withdrawableDeposit > 0) {
      require(token.transfer(proposer, withdrawableDeposit));
    }

    emit EntryDeleted(data, proposer);
    delete entries[data];
  }
}
