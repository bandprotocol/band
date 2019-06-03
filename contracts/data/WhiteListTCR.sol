pragma solidity 0.5.8;

import "./TCRBase.sol";
import "./WhiteListInterface.sol";

contract WhiteListTCR is TCRBase, WhiteListInterface {
  constructor(bytes8 _prefix, Parameters _params) public TCRBase(_prefix, _params) {}

  function verify(address reader) public view returns (bool) {
    return isEntryActive(bytes32(uint256(reader)));
  }
}