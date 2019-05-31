pragma solidity 0.5.8;

import "./TCRBase.sol";
import "./QueryInterface.sol";

contract TCR is TCRBase, QueryInterface {

  constructor(
    bytes8 _prefix,
    Expression decayFunction,
    Parameters _params,
    BandRegistry _registry
  ) public TCRBase(_prefix, decayFunction, _params) QueryInterface(_registry) {}

  function getQueryPrice() public view returns (uint256) {
    return 0;
  }

  function getAsBool(bytes32 key) public payable onlyWhiteList returns (bool) {
    require(msg.value == getQueryPrice());
    return entries[key].listedAt > now;
  }
}
