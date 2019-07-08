pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./TCDBase.sol";


/// "OffchainAggTCD" is a TCD that curates a list of trusted addresses. Data points from all reporters are aggregated
/// off-chain and reported using `report` function with ECDSA signatures. Data providers are responsible for combining
/// data points into one aggregated value together with timestamp and status, which will be reported to this contract.
contract OffchainAggTCD is TCDBase {
  using SafeMath for uint256;

  event DataUpdated(bytes key, uint256 value, uint64 timestamp, QueryStatus status);

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
    bytes calldata key, uint256 value, uint64 timestamp, QueryStatus status,
    uint8[] calldata v, bytes32[] calldata r, bytes32[] calldata s
  ) external {
    require(v.length == r.length && v.length == s.length);
    require(v.length.mul(3) > activeCount.mul(2));
    bytes32 message = keccak256(abi.encodePacked(
      "\x19Ethereum Signed Message:\n32",
      keccak256(abi.encodePacked(key, value, timestamp, status, address(this))))
    );
    address lastSigner = address(0);
    for (uint256 i = 0; i < v.length; ++i) {
      address recovered = ecrecover(message, v[i], r[i], s[i]);
      require(activeList[recovered] != NOT_FOUND);
      require(recovered > lastSigner);
      lastSigner = recovered;
    }
    require(timestamp > aggData[key].timestamp && uint256(timestamp) <= now);
    aggData[key] = DataPoint({
      value: value,
      timestamp: timestamp,
      status: status
    });
    emit DataUpdated(key, value, timestamp, status);
  }

  function queryImpl(bytes memory input) internal returns (bytes32 output, uint256 updatedAt, QueryStatus status) {
    DataPoint storage data = aggData[input];
    if (data.timestamp == 0) return ("", 0, QueryStatus.NOT_AVAILABLE);
    if (data.status != QueryStatus.OK) return ("", data.timestamp, data.status);
    return (bytes32(data.value), data.timestamp, QueryStatus.OK);
  }
}

