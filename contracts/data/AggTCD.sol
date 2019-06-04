pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../utils/Aggregator.sol";
import "./TCDBase.sol";


contract AggTCD is TCDBase {
  using SafeMath for uint256;

  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return params.get(prefix, "query_price");
  }

  function queryImpl(bytes memory input) internal returns (bytes memory output, QueryStatus status) {
    if (input.length != 32) return ("", QueryStatus.BAD_REQUEST);
    bytes32 key = abi.decode(input, (bytes32));
    uint256 dsCount = getActiveDataSourceCount();
    uint256[] memory data = new uint256[](dsCount);
    uint256 size = 0;
    for (uint256 index = 0; index < dsCount; ++index) {
      (bool ok, bytes memory ret) = dataSources[index].call(abi.encodeWithSignature("get(bytes32)", key));
      if (!ok || ret.length != 32) continue;
      uint256 value = abi.decode(ret, (uint256));
      data[size++] = value;
    }
    if (size == 0 || size.mul(3) < dsCount.mul(2)) return ("", QueryStatus.NOT_AVAILABLE);
    Aggregator agg = Aggregator(address(params.get(prefix, "data_aggregator")));
    (uint256 result, bool ok) = agg.aggregate(data, size);
    if (!ok) return ("", QueryStatus.DISAGREEMENT);
    else return (abi.encode(result), QueryStatus.OK);
  }
}
