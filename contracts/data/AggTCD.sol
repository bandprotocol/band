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

  function queryImpl(bytes memory input) internal returns (bytes32 output, QueryStatus status) {
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
    if (size == 0 || size.mul(3) < activeCount.mul(2)) return ("", QueryStatus.NOT_AVAILABLE);
    Aggregator agg = Aggregator(address(params.get(prefix, "data_aggregator")));
    (uint256 result, bool ok) = agg.aggregate(data, size);
    if (!ok) return ("", QueryStatus.DISAGREEMENT);
    else return (bytes32(result), QueryStatus.OK);
  }
}
