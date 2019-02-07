pragma solidity 0.5.0;

import "./CommunityToken.sol";
import "./ParametersBase.sol";
import "./ResolveListener.sol";

/**
 * @title VotingInterface
 */
contract VotingInterface {

  event PollResolved(  // A poll is resolved.
    address indexed pollContract,
    uint256 indexed pollID,
    ResolveListener.PollState pollState
  );

  /**
   * Mimic the parameters in Parameters.sol and make it private.
   * So no one can write this params.
   */
  mapping (bytes32 => uint256) private params;

  /**
   * Make these params readable via internal call.
   */
  function getParam(bytes32 key) internal view returns(uint256) {
    return params[key];
  }

  /**
   * Verify voting parameters
   */
  function verifyVotingParams()
    public 
    returns (bool);

  /**
   * Start a new poll for the function caller.
   */
  function startPoll(
    CommunityToken token,
    uint256 pollID,
    bytes8 prefix,
    ParametersBase params
  )
    public
    returns (bool);

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
