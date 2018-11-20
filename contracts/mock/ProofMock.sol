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
}
