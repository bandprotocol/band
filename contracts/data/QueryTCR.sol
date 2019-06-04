pragma solidity 0.5.8;

import "./TCRBase.sol";
import "./QueryInterface.sol";

contract QueryTCR is TCRBase, QueryInterface {

  constructor(bytes8 _prefix, Parameters _params, BandRegistry _registry)
    public TCRBase(_prefix, _params) QueryInterface(_registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return 0;
  }

  function queryImpl(bytes memory input) internal returns (bytes32 output, QueryStatus status) {
    if (input.length != 32) return ("", QueryStatus.INVALID);
    bytes32 key = abi.decode(input, (bytes32));
    return (isEntryActive(bytes32(key)) ? bytes32(uint256(1)) : bytes32(uint256(0)), QueryStatus.OK);
  }
}
