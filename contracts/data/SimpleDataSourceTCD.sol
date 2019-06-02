pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./TCDBase.sol";


contract SimpleDataSourceTCDBase is TCDBase {
  using SafeMath for uint256;

  function queryPrice(bytes memory) public view returns (uint256) {
    return params.get(prefix, "query_price");
  }

  function queryImpl(bytes memory input) internal returns (bytes memory output, QueryStatus status) {
    bytes32 key;
    if (input.length != 32) return ("", QueryStatus.INVALID);
    assembly { key := mload(add(input, 0x20)) }
    uint256[] memory data = new uint256[](dataSources.length);
    uint256 size = 0;
    uint256 dsCount = getActiveDataSourceCount();
    for (uint256 index = 0; index < dsCount; ++index) {
      (bool ok, bytes memory ret) = dataSources[index].call(abi.encodeWithSignature("get(bytes32)", key));
      if (!ok || ret.length != 32) continue;
      uint256 value;
      assembly { value := mload(add(ret, 0x20)) }
      data[size++] = value;
    }
    if (size == 0 || size.mul(3) < dsCount.mul(2)) return ("", QueryStatus.NOT_AVAILABLE);
    (uint256 result, bool ok) = _aggregate(data, size);
    if (!ok) return ("", QueryStatus.DISAGREEMENT);
    output = new bytes(32);
    assembly { mstore(add(output, 0x20), result) }
  }

  function _aggregate(uint256[] memory data, uint256 size)
    internal pure returns (uint256 result, bool ok);
}

contract MedianSimpleDataSourceTCDBase is SimpleDataSourceTCDBase {
  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function _aggregate(uint256[] memory data, uint256 size) internal pure returns (uint256 result, bool ok) {
    if (size == 0) return (0, false);
    for (uint256 i = 0; i < size; ++i) {
      for (uint256 j = i; j > 0; --j) {
        if (data[j - 1] > data[j]) (data[j - 1], data[j]) = (data[j], data[j - 1]);
        else break;
      }
    }
    uint256 middle = size / 2;
    if (size % 2 == 0) {
      return (data[middle].add(data[middle - 1]) / 2, true);
    } else {
      return (data[middle], true);
    }
  }
}

contract MajoritySimpleDataSourceTCDBase is SimpleDataSourceTCDBase {
  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function _aggregate(uint256[] memory data, uint256 size) internal pure returns (uint256 result, bool ok) {
    for (uint256 i = 0; i < size; ++i) {
      uint256 count = 1;
      for (uint256 j = i + 1; j < size; ++j) {
        if (data[i] == data[j]) ++count;
      }
      if (count > size / 2) return (data[i], true);
    }
    return (0, false);
  }
}
