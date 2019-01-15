pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./CommunityToken.sol";
import "./ParametersInterface.sol";
import "./ResolveListener.sol";


/**
 * @title Voting
 */
contract Voting {
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

    uint256 snapshotBlockNo;  // The block number to count voting power

    uint256 commitEndTime;          // Expiration timestamp of commit period
    uint256 revealEndTime;          // Expiration timestamp of reveal period
    uint256 voteSupportRequiredPct; // Threshold % for detemining poll result

    uint256 voteMinParticipation; // The minimum # of votes required
    uint256 yesCount;             // The current total number of YES votes
    uint256 noCount;              // The current total number of NO votes

    mapping (address => bytes32) commits;       // Each user's committed vote
    mapping (address => uint256) yesWeights;    // Each user's yes vote weight
    mapping (address => uint256) noWeights;     // Each user's no vote weight
    mapping (address => VoteState) voteStates;  // Each user's vote state

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

  function getPollUserVoteOnWinningSide(
    address pollContract,
    uint256 pollID,
    address voter
  )
    public
    view
    returns (uint256)
  {
    Poll storage poll = polls[pollContract][pollID];
    if (poll.pollState == ResolveListener.PollState.Yes) {
      return poll.yesWeights[voter];
    } else if (poll.pollState == ResolveListener.PollState.No) {
      return poll.noWeights[voter];
    } else {
      return 0;
    }
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
    return poll.voteStates[voter];
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
    CommunityToken token,
    uint256 pollID,
    bytes8 prefix,
    ParametersInterface params
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
    address pollContract,
    uint256 pollID,
    bytes32 commitValue
  )
    public
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];
    // Must be in commit period.
    require(now < poll.commitEndTime);
    poll.commits[msg.sender] = commitValue;
    poll.voteStates[msg.sender] = VoteState.Committed;
    emit VoteCommitted(pollContract, pollID, msg.sender, commitValue);
  }

  function revealVote(
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
    // Must not already be revealed.
    require(poll.voteStates[msg.sender] == VoteState.Committed);
    poll.voteStates[msg.sender] = VoteState.Revealed;
    // Must be consistent with the prior commit value.
    require(
      keccak256(abi.encodePacked(yesWeight, noWeight, salt)) ==
      poll.commits[msg.sender]
    );

    // Get the weight, which is the voting power at the block before the
    // poll is initiated.
    uint256 totalWeight = poll.token.historicalVotingPowerAtBlock(
      msg.sender,
      poll.snapshotBlockNo
    );

    require(yesWeight.add(noWeight) <= totalWeight);
    poll.yesWeights[msg.sender] = yesWeight;
    poll.yesCount = poll.yesCount.add(yesWeight);
    poll.noWeights[msg.sender] = noWeight;
    poll.noCount = poll.noCount.add(noWeight);
    emit VoteRevealed(pollContract, pollID, msg.sender, yesWeight, noWeight, salt);
  }

  function resolvePoll(address pollContract, uint256 pollID)
    public
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];
    require(now >= poll.revealEndTime);

    uint256 yesCount = poll.yesCount;
    uint256 noCount = poll.noCount;
    uint256 totalCount = yesCount.add(noCount);

    ResolveListener.PollState pollState;
    if (totalCount < poll.voteMinParticipation) {
      pollState = ResolveListener.PollState.Inconclusive;
    } else if (yesCount.mul(100) >= poll.voteSupportRequiredPct.mul(totalCount)) {
      pollState = ResolveListener.PollState.Yes;
    } else {
      pollState = ResolveListener.PollState.No;
    }

    poll.pollState = pollState;
    emit PollResolved(pollContract, pollID, pollState);
    require(ResolveListener(pollContract).onResolved(pollID, pollState));
  }

  function get(ParametersInterface params, bytes8 prefix, bytes24 key)
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
