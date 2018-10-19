pragma solidity ^0.4.24;

import "../Proof.sol";


contract ProofMock {
  using Proof for bytes32;

  function verify(
    bytes32 rootHash,
    address key,
    bytes32 value,
    bytes32[] proof
  )
    public
    pure
    returns (bool)
  {
    return rootHash.verify(key, value, proof);
  }

  function update(
    bytes32 rootHash,
    address key,
    bytes32 oldValue,
    bytes32 newValue,
    bytes32[] proof
  )
    public
    pure
    returns (bytes32)
  {
    return rootHash.update(key, oldValue, newValue, proof);
  }
}
