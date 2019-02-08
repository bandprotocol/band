pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./VotingInterface.sol";
import "./Feeless.sol";

/**
 * @title CommitRevealVoting
 */
contract CommitRevealVoting is VotingInterface, Feeless {
  using SafeMath for uint256;

  event PollCreated(  // A poll is created.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed tokenContract,
    uint256 commitEndTime,
    uint256 revealEndTime,
    uint256 voteMinParticipation,
    uint256 voteSupportRequired
  );

  event PollResolved(  // A poll is resolved.
    address indexed pollContract,
    uint256 indexed pollID,
    ResolveListener.PollState pollState
  );

  event VoteCommitted(  // A vote is committed by a user.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed voter,
    bytes32 voteHash
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
    CommunityToken token; // The address of community token contract for voting power reference

    uint256 snapshotBlockNo;        // The block number to count voting power
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

  function verifyVotingParams() public returns(bool) {
    uint256 commitEndTime = getParam("params:commit_time");
    uint256 revealEndTime = getParam("params:reveal_time");
    uint256 voteMinParticipationPct = getParam("params:min_participation_pct");
    uint256 voteSupportRequiredPct = getParam("params:support_required_pct");

    require(commitEndTime > 0);
    require(revealEndTime > 0);
    require(voteMinParticipationPct > 0 && voteMinParticipationPct <= 100);
    require(voteSupportRequiredPct > 0 && voteSupportRequiredPct <= 100);

    return true;
  }

  function startPoll(
    CommunityToken token,
    uint256 pollID,
    bytes8 prefix,
    ParametersBase params
  )
    public
    pollMustNotExist(msg.sender, pollID)
    returns (bool)
  {

    uint256 commitEndTime = now.add(get(params, prefix, "commit_time"));
    uint256 revealEndTime = commitEndTime.add(get(params, prefix, "reveal_time"));
    uint256 voteMinParticipationPct = get(params, prefix, "min_participation_pct");
    uint256 voteSupportRequiredPct = get(params, prefix, "support_required_pct");

    require(revealEndTime < 2 ** 64);
    require(commitEndTime < revealEndTime);
    require(voteMinParticipationPct <= 100);
    require(voteSupportRequiredPct <= 100);

    // NOTE: This could possibliy be slightly mismatched with `snapshotBlockNo`
    // if there are mint/burn transactions in this block prior to
    // this transaction. The effect, however, should be minimal as
    // `minimum_quorum` is primarily used to ensure minimum number of vote
    // participants. The primary decision factor should be `support_required`.
    uint256 voteMinParticipation
      = voteMinParticipationPct.mul(token.totalSupply()).div(100);

    Poll storage poll = polls[msg.sender][pollID];
    poll.snapshotBlockNo = block.number.sub(1);
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
      voteSupportRequiredPct
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
      poll.token.historicalVotingPowerAtBlock(
        sender,
        poll.snapshotBlockNo
      )
    );

    // caculate current commit by hashing prev totalWeight and commitValue
    bytes32 prevCommitValWithTW = getHash(prevTotalWeight, prevCommitValue);
    require(poll.commits[sender] == prevCommitValWithTW);

    // calculate new commit by hashing totalWeight and commitValue
    bytes32 commitValWithTW = getHash(totalWeight, commitValue);
    poll.commits[sender] = commitValWithTW;

    // remove prevTotalWeight from poll.totalCount before adding new totalWeight
    poll.totalCount = poll.totalCount.sub(prevTotalWeight).add(totalWeight);

    emit VoteCommitted(pollContract, pollID, sender, commitValWithTW);
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

      if (yesCount.mul(100) >= poll.voteSupportRequiredPct.mul(yesCount.add(noCount))) {
        pollState = ResolveListener.PollState.Yes;
      } else {
        pollState = ResolveListener.PollState.No;
      }
    }

    poll.pollState = pollState;
    emit PollResolved(pollContract, pollID, pollState);
    require(ResolveListener(pollContract).onResolved(pollID, pollState));
  }

  function getHash(uint256 weight, bytes32 commit)
    private
    pure
    returns (bytes32)
  {
    if (commit == 0 && weight == 0) {
      return 0;
    }
    return keccak256(abi.encodePacked(weight, commit));
  }

  function get(ParametersBase params, bytes8 prefix, bytes24 key)
    internal
    view
    returns (uint256)
  {
    uint8 prefixSize = 0;
    while (prefixSize < 8 && prefix[prefixSize] != byte(0)) {
      ++prefixSize;
    }
    return params.get(bytes32(prefix) | (bytes32(key) >> (8 * prefixSize)));
  }
}