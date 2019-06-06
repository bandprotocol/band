pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../utils/Aggregator.sol";
import "./TCDBase.sol";


contract MultiSigTCD is TCDBase {
  using SafeMath for uint256;

  struct ReportedData {
    uint256 value;
    uint64 timeStamp;
    QueryStatus status;
  }

  mapping (bytes => ReportedData) private aggData;

  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function queryPrice(bytes memory) public view returns (uint256) {
    return params.get(prefix, "query_price");
  }

  function report(
    bytes calldata key,
    uint256[] calldata values,
    uint256[] calldata timeStamps,
    uint8[] calldata v,
    bytes32[] calldata r,
    bytes32[] calldata s
  ) external {
    require(values.length <= activeProviderLength);
    require(values.length > activeProviderLength.mul(2).div(3));
    require(values.length == timeStamps.length);
    address lastSigner = address(0);
    for (uint256 i = 0; i < values.length; ++i) {
      require(timeStamps[i] > aggData[key].timeStamp);
      address recovered = ecrecover(
          keccak256(
            abi.encodePacked(
              "\x19Ethereum Signed Message:\n32",
              keccak256(abi.encodePacked(key, values[i], timeStamps[i], address(this)))
            )
          ),
          v[i], r[i], s[i]
      );
      require(recovered > lastSigner);
      lastSigner = recovered;
      require (activeProviders[recovered] != NOT_FOUND);
    }
    _save(key, values);
  }

  function _save(bytes memory key, uint256[] memory values) private {
    Aggregator agg = Aggregator(address(params.get(prefix, "data_aggregator")));
    (uint256 result, bool ok) = agg.aggregate(values, values.length);
    aggData[key] = ReportedData({
      value: result,
      timeStamp: uint64(now),
      status: ok ? QueryStatus.OK : QueryStatus.DISAGREEMENT
    });
  }

  function queryImpl(bytes memory input) internal returns (bytes32 output, QueryStatus status) {
    ReportedData storage rd = aggData[input];
    if (rd.timeStamp == 0) return ("", QueryStatus.NOT_AVAILABLE);
    if (rd.status != QueryStatus.OK) return ("", rd.status);
    return (bytes32(rd.value), QueryStatus.OK);
  }

}
