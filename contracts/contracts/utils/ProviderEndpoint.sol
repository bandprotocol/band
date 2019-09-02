pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ProviderEndpoint is ownable {
    mapping(address => string) public endpoints;

    function setEndpoint(string endpoint) public {
        endpoints[msg.sender] = endpoint;
    }

    function addEndpointByOwner(address provider, string endpoint) public onlyOwner {
        endpoints[provider] = endpoint;
    }
}
