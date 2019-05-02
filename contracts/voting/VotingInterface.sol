pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "./ResolveListener.sol";


interface VotingParameters {
  function get(bytes32 key) external view returns (uint256);
}


contract VotingInterface {
  event PollResolved(  // A poll is resolved.
    address indexed pollContract,
    uint256 indexed pollID,
    ResolveListener.PollState pollState
  );

  /**
   * Start a new poll for the function caller.
   */
  function startPoll(CommunityToken token, uint256 pollID, bytes8 prefix, VotingParameters params)
    public returns (bool);

  /**
   * Return the current state for a specific poll.
   */
  function getPollState(address pollContract, uint256 pollID) public view returns (ResolveListener.PollState);

  /**
   * Return the current vote score for a specific poll.
   */
  function getPollTotalVote(address pollContract, uint256 pollID)
    public
    view
    returns (uint256 yesCount, uint256 noCount);

  /**
   * Return the vote allocation for the given voter.
   */
  function getPollUserVote(address pollContract, uint256 pollID, address voter)
    public
    view
    returns (uint256 yesCount, uint256 noCount);
}
