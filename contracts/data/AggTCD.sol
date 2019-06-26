pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../utils/Aggregator.sol";
import "./TCDBase.sol";


/// "AggTCD" is a TCD that curates a list of smart contract addresses. Each smart contract must implement `get(bytes)`
/// function that returns a value given a key. Data points are aggregated using the aggregator smart contract as
/// specified using key `{prefix}:data_aggregator`.
contract AggTCD is TCDBase {
  using SafeMath for uint256;

  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return params.get(prefix, "query_price");
  }

  function queryImpl(bytes memory input) internal returns (bytes32 output, uint256 updatedAt, QueryStatus status) {
    uint256[] memory data = new uint256[](activeCount);
    uint256 size = 0;
    address dataSourceAddress = activeList[ACTIVE_GUARD];
    while (dataSourceAddress != ACTIVE_GUARD) {
      (bool ok, bytes memory ret) = dataSourceAddress.call(abi.encodeWithSignature("get(bytes)", input));
      if (ok && ret.length == 32) {
        uint256 value = abi.decode(ret, (uint256));
        data[size++] = value;
      }
      dataSourceAddress = activeList[dataSourceAddress];
    }
    if (size == 0 || size.mul(3) < activeCount.mul(2)) return ("", 0, QueryStatus.NOT_AVAILABLE);
    Aggregator agg = Aggregator(address(params.get(prefix, "data_aggregator")));
    (uint256 result, bool ok) = agg.aggregate(data, size);
    if (!ok) return ("", now, QueryStatus.DISAGREEMENT);
    else return (bytes32(result), now, QueryStatus.OK);
  }
}
