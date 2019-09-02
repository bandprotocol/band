pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ProviderEndpoint is Ownable {
  mapping(address => string) public endpoints;

  function setEndpoint(string calldata endpoint) external {
    endpoints[msg.sender] = endpoint;
  }

  function addEndpointByOwner(address provider, string calldata endpoint) external onlyOwner {
    endpoints[provider] = endpoint;
  }
}
