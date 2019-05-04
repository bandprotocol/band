pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./VotingInterface.sol";
import "../feeless/Feeless.sol";
import "../utils/Fractional.sol";
import "../utils/KeyUtils.sol";

/// @title title CommitRevealVoting
contract CommitRevealVoting is VotingInterface, Feeless {
  using SafeMath for uint256;
  using Fractional for uint256;
  using KeyUtils for bytes8;

  event PollCreated(  // A poll is created.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed tokenContract,
    uint256 commitEndTime,
    uint256 revealEndTime,
    uint256 voteMinParticipation,
    uint256 voteSupportRequired,
    uint256 snapshotNonce
  );

  event VoteCommitted(  // A vote is committed by a user.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed voter,
    bytes32 voteHash,
    uint256 totalWeight
  );

  event VoteRevealed(  // A vote is revealed by a user.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed voter,
    uint256 yesWeight,
    uint256 noWeight,
    uint256 salt
  );

  enum VoteState {
    Invalid,      // Invalid, default value
    Committed,    // The vote has been committed, but not yet revealed.
    Revealed      // The vote has been revealed.
  }

  struct Poll {
    SnapshotToken token; // The address of community token contract for voting power reference

    uint256 snapshotNonce;          // The votingPowerNonce to count voting power
    uint256 commitEndTime;          // Expiration timestamp of commit period
    uint256 revealEndTime;          // Expiration timestamp of reveal period
    uint256 voteSupportRequiredPct; // Threshold % for detemining poll result

    uint256 voteMinParticipation; // The minimum # of votes required
    uint256 yesCount;             // The current total number of YES votes
    uint256 noCount;              // The current total number of NO votes
    uint256 totalCount;           // The current total number of Yes+No votes

    mapping (address => bytes32) commits;       // Each user's committed vote
    mapping (address => uint256) yesWeights;    // Each user's yes vote weight
    mapping (address => uint256) noWeights;     // Each user's no vote weight

    ResolveListener.PollState pollState;  // The state of this poll.
  }

  // Mapping of all polls ever existed, for each of the poll creators.
  mapping (address => mapping (uint256 => Poll)) public polls;

  modifier pollMustNotExist(address pollContract, uint256 pollID) {
    require(polls[pollContract][pollID].pollState == ResolveListener.PollState.Invalid);
    _;
  }

  modifier pollMustBeActive(address pollContract, uint256 pollID) {
    require(polls[pollContract][pollID].pollState == ResolveListener.PollState.Active);
    _;
  }

  function getPollState(address pollContract, uint256 pollID)
    public
    view
    returns (ResolveListener.PollState)
  {
    return polls[pollContract][pollID].pollState;
  }

  function getPollTotalVote(address pollContract, uint256 pollID)
    public
    view
    returns (uint256 yesCount, uint256 noCount)
  {
    Poll storage poll = polls[pollContract][pollID];
    return (poll.yesCount, poll.noCount);
  }

  function getPollUserVote(address pollContract, uint256 pollID, address voter)
    public
    view
    returns (uint256 yesWeight, uint256 noWeight)
  {
    Poll storage poll = polls[pollContract][pollID];
    return (poll.yesWeights[voter], poll.noWeights[voter]);
  }

  function getPollUserState(address pollContract, uint256 pollID, address voter)
    public
    view
    returns (VoteState)
  {
    Poll storage poll = polls[pollContract][pollID];
    if (poll.commits[voter] == 0) {
      return VoteState.Invalid;
    } else if (poll.yesWeights[voter] == 0 && poll.noWeights[voter] == 0) {
      return VoteState.Committed;
    }
    return VoteState.Revealed;
  }

  function getPollUserCommit(address pollContract, uint256 pollID, address voter)
    public
    view
    returns (bytes32)
  {
    Poll storage poll = polls[pollContract][pollID];
    return poll.commits[voter];
  }

  function startPoll(
    SnapshotToken token,
    uint256 pollID,
    bytes8 prefix,
    VotingParameters params
  )
    public
    pollMustNotExist(msg.sender, pollID)
    returns (bool)
  {
    uint256 commitEndTime = now.add(params.get(prefix.append("commit_time")));
    uint256 revealEndTime = commitEndTime.add(params.get(prefix.append("reveal_time")));
    uint256 voteMinParticipationPct = params.get(prefix.append("min_participation_pct"));
    uint256 voteSupportRequiredPct = params.get(prefix.append("support_required_pct"));

    require(revealEndTime < 2 ** 64);
    require(commitEndTime < revealEndTime);
    require(voteMinParticipationPct > 0 && voteMinParticipationPct <= Fractional.getDenominator());
    require(voteSupportRequiredPct > 0 && voteSupportRequiredPct <= Fractional.getDenominator());
    uint256 voteMinParticipation = voteMinParticipationPct.multipliedBy(token.totalSupply());

    Poll storage poll = polls[msg.sender][pollID];
    poll.snapshotNonce = token.votingPowerChangeNonce();
    poll.commitEndTime = commitEndTime;
    poll.revealEndTime = revealEndTime;
    poll.voteSupportRequiredPct = voteSupportRequiredPct;
    poll.voteMinParticipation = voteMinParticipation;
    poll.pollState = ResolveListener.PollState.Active;
    poll.token = token;

    emit PollCreated(
      msg.sender,
      pollID,
      address(token),
      commitEndTime,
      revealEndTime,
      voteMinParticipation,
      voteSupportRequiredPct,
      poll.snapshotNonce
    );
    return true;
  }

  function commitVote(
    address sender,
    address pollContract,
    uint256 pollID,
    bytes32 commitValue,
    bytes32 prevCommitValue,
    uint256 totalWeight,
    uint256 prevTotalWeight
  )
    public
    feeless(sender)
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];

    // Must be in commit period.
    require(now < poll.commitEndTime);
    // commitValue should look like hash
    require(commitValue != 0);
    // totalWeight = 0 is pointless
    require(totalWeight > 0);
    // totalWeight will not exceed voting power of sender
    require(
      totalWeight <=
      poll.token.historicalVotingPowerAtNonce(
        sender,
        poll.snapshotNonce
      )
    );

    // caculate current commit by hashing prev totalWeight and commitValue
    bytes32 prevCommitValWithTotalWeight = getHash(prevTotalWeight, prevCommitValue);
    require(poll.commits[sender] == prevCommitValWithTotalWeight);

    // calculate new commit by hashing totalWeight and commitValue
    bytes32 commitValWithTotalWeight = getHash(totalWeight, commitValue);
    poll.commits[sender] = commitValWithTotalWeight;

    // remove prevTotalWeight from poll.totalCount before adding new totalWeight
    poll.totalCount = poll.totalCount.sub(prevTotalWeight).add(totalWeight);

    emit VoteCommitted(pollContract, pollID, sender, commitValue, totalWeight);
  }

  function revealVote(
    address voteOwner,
    address pollContract,
    uint256 pollID,
    uint256 yesWeight,
    uint256 noWeight,
    uint256 salt
  )
    public
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];
    // Must be in reveal period.
    require(now >= poll.commitEndTime && now < poll.revealEndTime);
    // pointless if yesWeight and noWeight are 0
    require(yesWeight > 0 || noWeight > 0);
    // Must not already be revealed.
    require(getPollUserState(pollContract, pollID, voteOwner) == VoteState.Committed);
    // Must be consistent with the prior commit value.
    require(
      getHash(yesWeight.add(noWeight),
        keccak256(abi.encodePacked(yesWeight, noWeight, salt))
      ) ==
      poll.commits[voteOwner]
    );

    poll.yesWeights[voteOwner] = yesWeight;
    poll.yesCount = poll.yesCount.add(yesWeight);
    poll.noWeights[voteOwner] = noWeight;
    poll.noCount = poll.noCount.add(noWeight);

    emit VoteRevealed(pollContract, pollID, voteOwner, yesWeight, noWeight, salt);
  }

  function resolvePoll(address pollContract, uint256 pollID)
    public
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];
    require(now >= poll.commitEndTime);
    ResolveListener.PollState pollState;

    if (poll.totalCount < poll.voteMinParticipation) {
      pollState = ResolveListener.PollState.Inconclusive;
    } else {
      require(now >= poll.revealEndTime);
      uint256 yesCount = poll.yesCount;
      uint256 noCount = poll.noCount;
      uint256 totalCount = yesCount.add(noCount);
      if (yesCount == 0 && noCount == 0) {
        pollState = ResolveListener.PollState.Inconclusive;
      } else if (yesCount.mul(Fractional.getDenominator()) >= poll.voteSupportRequiredPct.mul(totalCount)) {
        pollState = ResolveListener.PollState.Yes;
      } else {
        pollState = ResolveListener.PollState.No;
      }
    }

    poll.pollState = pollState;
    emit PollResolved(pollContract, pollID, pollState);
    require(ResolveListener(pollContract).onResolved(pollID, pollState));
  }

  function getHash(uint256 weight, bytes32 commit) public pure returns (bytes32) {
    if (commit == 0 && weight == 0) {
      return 0;
    }
    return keccak256(abi.encodePacked(weight, commit));
  }
}
