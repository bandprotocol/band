pragma solidity 0.5.8;

import "../BandRegistry.sol";

contract QueryInterface {

  BandRegistry public registry;

  constructor(BandRegistry _registry) public {
    registry = _registry;
  }

  modifier onlyWhiteList() {
    require(registry.verify(msg.sender));
    _;
  }

  function getQueryPrice() public view returns (uint256);
  function getAsNumber(bytes32) public payable returns (uint256) { revert(); }
  function getAsBytes32(bytes32) public payable returns (bytes32) { revert(); }
  function getAsBool(bytes32) public payable returns (bool) { revert(); }
}
