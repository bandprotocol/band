pragma solidity 0.5.8;

import "../BandRegistry.sol";


contract QueryInterface {
  enum QueryStatus { BAD_REQUEST, OK, NOT_AVAILABLE, DISAGREEMENT }
  BandRegistry public registry;

  constructor(BandRegistry _registry) public {
    registry = _registry;
  }

  function query(bytes calldata input)
    external payable returns (bytes memory output, QueryStatus status)
  {
    require(registry.verify(msg.sender));
    uint256 price = queryPrice(input);
    require(msg.value >= price);
    if (msg.value > price) msg.sender.transfer(msg.value - price);
    return queryImpl(input);
  }

  function queryPrice(bytes memory input)
    public view returns (uint256);

  function queryImpl(bytes memory input)
    internal returns (bytes memory output, QueryStatus status);
}
