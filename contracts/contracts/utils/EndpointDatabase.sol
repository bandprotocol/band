pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract EndpointDatabase is Ownable {
  mapping(address => string) public endpoints;

  function setEndpoint(string calldata endpoint) external {
    endpoints[msg.sender] = endpoint;
  }

  function setEndpointByOwner(address provider, string calldata endpoint) external onlyOwner {
    endpoints[provider] = endpoint;
  }
}
