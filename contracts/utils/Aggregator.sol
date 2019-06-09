pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/Math.sol";


/// "Aggregator" interface contains one function, which describe how an array of unsigned integers should be processed
/// into a single unsigned integer result. The function will return ok = false if the aggregation fails.
interface Aggregator {
  function aggregate(uint256[] calldata data, uint256 size) external pure returns (uint256 result, bool ok);
}

/// "MedianAggregator" uses unweighted median as the aggregation method.
contract MedianAggregator is Aggregator {
  function aggregate(uint256[] calldata data, uint256 size) external pure returns (uint256 result, bool ok) {
    if (size == 0) return (0, false);
    uint256 middle = size / 2;
    uint256[] memory sData = new uint256[](middle + 2);  // Only the first middle + 2 are needed
    for (uint256 i = 0; i < size; ++i) {
      uint256 loc = Math.min(i, middle + 1);
      sData[loc] = data[i];
      for (; loc > 0; --loc) {
        if (sData[loc - 1] > sData[loc]) (sData[loc - 1], sData[loc]) = (sData[loc], sData[loc - 1]);
        else break;
      }
    }
    if (size % 2 == 0) {
      return (Math.average(sData[middle], sData[middle - 1]), true);
    } else {
      return (sData[middle], true);
    }
  }
}


/// "MajorityAggregator" uses majority (more than half of the same numbre) as the aggregation method.
contract MajorityAggregator is Aggregator {
  function aggregate(uint256[] calldata data, uint256 size) external pure returns (uint256 result, bool ok) {
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
