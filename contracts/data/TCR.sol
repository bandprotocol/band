pragma solidity 0.5.8;

import "./TCRBase.sol";
import "./QueryInterface.sol";

contract TCR is TCRBase, QueryInterface {

  constructor(bytes8 _prefix, Parameters _params, BandRegistry _registry)
    public TCRBase(_prefix, _params) QueryInterface(_registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return 0;
  }

  function queryImpl(bytes memory input) internal returns (bytes memory output, QueryStatus status) {
    bytes32 key = abi.decode(input, (bytes32));
    return (abi.encode(isEntryActive(bytes32(key))), QueryStatus.OK);
  }
}
