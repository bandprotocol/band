pragma solidity 0.5.0;

import "../utils/ArrayUtils.sol";


contract ArrayUtilsMock {

  function getMedian(uint256[] memory data) 
    public pure 
    returns (uint256) 
  {
    return ArrayUtils.getMedian(data);
  }

  function getMajority(uint256[] memory data) 
    public pure 
    returns (uint256) 
  {
    return ArrayUtils.getMajority(data);
  }
}