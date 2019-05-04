pragma solidity 0.5.0;

import "../token/SnapshotToken.sol";


/// @title VotingParameters
interface VotingParameters {
  function get(bytes32 key) external view returns (uint256);
}


/// @title ResolveListener
interface ResolveListener {
  enum PollState { Invalid, Active, Yes, No, Inconclusive }
  /// Called by Voting contract after a poll is resolved.
  function onResolved(uint256 pollID, PollState pollState) external returns (bool);
}


/// @title VotingInterface
interface VotingInterface {
  event PollResolved(
    address indexed pollContract,
    uint256 indexed pollID,
    ResolveListener.PollState pollState
  );

  /// Start a new poll for the function caller
  function startPoll(SnapshotToken token, uint256 pollID, bytes8 prefix, VotingParameters params)
    external returns (bool);

  /// Get the current poll state
  function getPollState(address pollContract, uint256 pollID)
    external view returns (ResolveListener.PollState);

  /// Get the total votes on the YES and NO sides of the given poll
  function getPollTotalVote(address pollContract, uint256 pollID)
    external view returns (uint256 yesCount, uint256 noCount);

  /// Get the votes on the YES and NO sides of the given poll and voter
  function getPollUserVote(address pollContract, uint256 pollID, address voter)
    external view returns (uint256 yesCount, uint256 noCount);
}
