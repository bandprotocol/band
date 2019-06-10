pragma solidity 0.5.9;

import "../BandRegistry.sol";


contract QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }
  event Query(address indexed caller, bytes input, QueryStatus status);
  BandRegistry public registry;

  constructor(BandRegistry _registry) public {
    registry = _registry;
  }

  function query(bytes calldata input)
    external payable returns (bytes32 output, QueryStatus status)
  {
    require(registry.verify(msg.sender));
    uint256 price = queryPrice(input);
    require(msg.value >= price);
    if (msg.value > price) msg.sender.transfer(msg.value - price);
    (output, status) = queryImpl(input);
    emit Query(msg.sender, input, status);
  }

  function queryPrice(bytes memory input)
    public view returns (uint256);

  function queryImpl(bytes memory input)
    internal returns (bytes32 output, QueryStatus status);
}
