pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./CommunityToken.sol";
import "./ResolveListener.sol";


/**
 * @title Voting
 */
contract Voting {
  using SafeMath for uint256;

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

  event PollResolved(  // A poll is resolved.
    address indexed pollContract,
    uint256 indexed pollID
  );

  enum VoteState {
    Invalid,      // Invalid, default value
    Committed,    // The vote has been committed, but not yet revealed.
    Revealed      // The vote has been revealed.
  }

  enum PollState {
    Invalid,      // Invalid, no poll at this address/ID.
    Active,       // The poll is accepting commit/reveal.
    Resolved      // The poll is archived.
  }

  struct Poll {
    uint256 snapshotBlockNo;  // The block number to count voting power
    uint256 commitEndTime;    // Expiration timestamp of commit period
    uint256 revealEndTime;    // Expiration timestamp of reveal period

    uint256 yesCount;       // The current total number of YES votes
    uint256 noCount;        // The current total number of NO votes

    mapping (address => bytes32) commits;       // Each user's committed vote
    mapping (address => uint256) yesWeights;    // Each user's yes vote weight
    mapping (address => uint256) noWeights;     // Each user's no vote weight
    mapping (address => VoteState) voteStates;  // Each user's vote state

    PollState pollState;    // The state of this poll.
  }

  // The address of community token contract for voting power reference.
  CommunityToken public token;

  // Mapping of all polls ever existed, for each of the poll creators.
  mapping (address => mapping (uint256 => Poll)) public polls;

  modifier pollMustNotExist(address pollContract, uint256 pollID) {
    require(polls[pollContract][pollID].pollState == PollState.Invalid);
    _;
  }

  modifier pollMustBeActive(address pollContract, uint256 pollID) {
    require(polls[pollContract][pollID].pollState == PollState.Active);
    _;
  }

  constructor(CommunityToken _token) public {
    token = _token;
  }

  function startPoll(
    uint256 pollID,
    uint256 commitEndTime,
    uint256 revealEndTime
  )
    public
    pollMustNotExist(msg.sender, pollID)
    returns (bool)
  {
    Poll storage poll = polls[msg.sender][pollID];
    poll.snapshotBlockNo = block.number.sub(1);
    poll.commitEndTime = commitEndTime;
    poll.revealEndTime = revealEndTime;
    return true;
  }

  function commitvote(
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
    uint256 totalWeight = token.historicalVotingPowerAtBlock(
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
    poll.pollState = PollState.Resolved;
    emit PollResolved(pollContract, pollID);
    require(ResolveListener(pollContract).onResolved(pollID));
  }
}
