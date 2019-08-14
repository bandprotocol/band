pragma solidity 0.5.9;

import "../BandRegistry.sol";


/// "QueryInterface" provides the standard `query` method for querying Band Protocol's curated data. The function
/// makes sure that query callers are not blacklisted and pay appropriate fee, as specified by `queryPrice` prior
/// to calling the meat `queryImpl` function.
contract QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }
  event Query(address indexed caller, bytes input, QueryStatus status);
  BandRegistry public registry;

  constructor(BandRegistry _registry) public {
    registry = _registry;
  }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status)
  {
    require(registry.verify(msg.sender));
    uint256 price = queryPrice();
    require(msg.value >= price);
    if (msg.value > price) msg.sender.transfer(msg.value - price);
    (output, updatedAt, status) = queryImpl(input);
    emit Query(msg.sender, input, status);
  }

  function queryPrice() public view returns (uint256);
  function queryImpl(bytes memory input)
    internal returns (bytes32 output, uint256 updatedAt, QueryStatus status);
}
