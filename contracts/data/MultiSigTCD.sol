pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../utils/Aggregator.sol";
import "./TCDBase.sol";


contract MultiSigTCD is TCDBase {
  using SafeMath for uint256;

  struct DataPoint {
    uint256 value;
    uint64 timestamp;
    QueryStatus status;
  }

  mapping (bytes => DataPoint) private aggData;

  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return params.get(prefix, "query_price");
  }

  function report(
    bytes calldata key,
    uint256[] calldata values,
    uint256[] calldata timestamps,
    uint8[] calldata v,
    bytes32[] calldata r,
    bytes32[] calldata s
  ) external {
    require(values.length > activeCount.mul(2).div(3));
    require(values.length == timestamps.length);
    address lastSigner = address(0);
    for (uint256 i = 0; i < values.length; ++i) {
      require(timestamps[i] > aggData[key].timestamp);
      address recovered = ecrecover(
          keccak256(
            abi.encodePacked(
              "\x19Ethereum Signed Message:\n32",
              keccak256(abi.encodePacked(key, values[i], timestamps[i], address(this)))
            )
          ),
          v[i], r[i], s[i]
      );
      require(activeList[recovered] != NOT_FOUND);
      require(recovered > lastSigner);
      lastSigner = recovered;
    }
    _save(key, values);
  }

  function _save(bytes memory key, uint256[] memory values) private {
    Aggregator agg = Aggregator(address(params.get(prefix, "data_aggregator")));
    (uint256 result, bool ok) = agg.aggregate(values, values.length);
    aggData[key] = DataPoint({
      value: result,
      timestamp: uint64(now),
      status: ok ? QueryStatus.OK : QueryStatus.DISAGREEMENT
    });
  }

  function queryImpl(bytes memory input) internal returns (bytes32 output, QueryStatus status) {
    DataPoint storage data = aggData[input];
    if (data.timestamp == 0) return ("", QueryStatus.NOT_AVAILABLE);
    if (data.status != QueryStatus.OK) return ("", data.status);
    return (bytes32(data.value), QueryStatus.OK);
  }
}
