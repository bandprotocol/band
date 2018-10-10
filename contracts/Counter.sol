pragma solidity ^0.4.23;

contract Counter {
  uint256 public count;

  constructor() public {
    count = 1;
  }

  function increase() public returns (bool) {
    count += 1;
    return true;
  }
}
