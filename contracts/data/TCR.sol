pragma solidity 0.5.8;

import "./TCRBase.sol";
import "./QueryInterface.sol";

contract TCR is TCRBase, QueryInterface {

  constructor(bytes8 _prefix, Expression decayFunction, Parameters _params, BandRegistry _registry)
    public TCRBase(_prefix, decayFunction, _params) QueryInterface(_registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return 0;
  }

  function queryImpl(bytes memory input) internal returns (bytes memory output, QueryStatus status) {
    bytes32 key;
    if (input.length != 32) return ("", QueryStatus.INVALID);
    assembly { key := mload(add(input, 0x20)) }
    if (isEntryActive(bytes32(key))) return (hex"01", QueryStatus.OK);
    else return (hex"00", QueryStatus.OK);
  }
}
