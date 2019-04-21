pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


library ArrayUtils {
  using SafeMath for uint256;

  /**
   * @dev Return the median value of the given array. Revert if array is empty.
   */
  function getMedian(uint256[] memory data) 
    internal pure 
    returns (uint256 median) 
  {
    require(data.length > 0);
    // Sort the given inputs with Insertion Sort.
    for (uint256 i = 0; i < data.length; ++i) {
      for (uint256 j = i; j > 0; --j) {
        if (data[j - 1] > data[j]) (data[j - 1], data[j]) = (data[j], data[j - 1]);
        else break;
      }
    }
    // Return the middle element, or the average of the middle two elements.
    uint256 middle = data.length.div(2);
    if (data.length % 2 == 0) {
      return data[middle].add(data[middle.sub(1)]).div(2);
    } else {
      return data[middle];
    }
  } 

  /**
   * @dev Return the "majority" value in the given array. A value is considered majority iff
   * more than half of the array elements are that value. Revert if none exists.
   */
  function getMajority(uint256[] memory data) 
    internal pure
    returns (uint256 mode)
  {
    for (uint256 i = 0; i < data.length; ++i) {
      uint256 count = 1;
      for (uint256 j = i + 1; j < data.length; ++j) {
        if (data[i] == data[j]) ++count;
      }
      if (count > data.length.div(2)) {
        return data[i];
      }
    }
    revert();
  }
}