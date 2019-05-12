pragma solidity 0.5.0;

import "./token/ERC20Base.sol";


/**
 * @title BandToken
 *
 * @dev BandToken ERC-20 follows the ERC-20 standard. However, it adds token
 * locking functionality. Some addresses will have their tokens locked, which
 * means not all of their tokens are transferable. Locked tokens will reduce
 * monthly proportionally until they are fully unlocked.
 */
contract BandToken is ERC20Base("BandToken", "BAND", 18) {

  /**
   * @dev BandToken constructor. All of the available tokens are minted to the
   * token creator.
   */
  // constructor() public {
  //   setExecDelegator(msg.sender);
  // }
}
