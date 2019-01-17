pragma solidity 0.5.0;

import "./CommunityToken.sol";
import "./ParametersInterface.sol";
import "./ResolveListener.sol";

/**
 * @title VotingInterface
 */
interface VotingInterface {

  event PollResolved(  // A poll is resolved.
    address indexed pollContract,
    uint256 indexed pollID,
    ResolveListener.PollState pollState
  );

  /**
   * Start a new poll for the function caller.
   */
  function startPoll(
    CommunityToken token,
    uint256 pollID,
    bytes8 prefix,
    ParametersInterface params
  )
    external
    returns (bool);

  /**
   * Return the current vote score for a specific poll.
   */
  function getPollTotalVote(address pollContract, uint256 pollID)
    external
    view
    returns (uint256 yesCount, uint256 noCount);

  /**
   * Return the vote allocation for the given voter.
   */
  function getPollUserVote(address pollContract, uint256 pollID, address voter)
    external
    view
    returns (uint256 yesCount, uint256 noCount);
}
