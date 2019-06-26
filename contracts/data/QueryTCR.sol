pragma solidity 0.5.9;

import "./TCRBase.sol";
import "./QueryInterface.sol";


/// "QueryTCR" extends `TCRBase` by making it compliant with `QueryInterface`. Users can ask if an entry exists
/// in the TCR. Note that due to TCR's unique economics, the costing of querying data here is zero.
contract QueryTCR is TCRBase, QueryInterface {

  constructor(bytes8 _prefix, Parameters _params, BandRegistry _registry)
    public TCRBase(_prefix, _params) QueryInterface(_registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return 0;
  }

  function queryImpl(bytes memory input) internal returns (bytes32 output, uint256 updatedAt, QueryStatus status) {
    if (input.length != 32) return ("", 0, QueryStatus.INVALID);
    bytes32 key = abi.decode(input, (bytes32));
    return (isEntryActive(bytes32(key)) ? bytes32(uint256(1)) : bytes32(uint256(0)), now, QueryStatus.OK);
  }
}
