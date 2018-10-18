pragma solidity ^0.4.24;

import "../VerifyProof.sol";

contract VerifyMock {

  function verify(bytes32 rootHash, address key, bytes32 value, bytes32[] proof) public pure returns(bool){
    return SMTProofVerifier.verifyProof(rootHash, key, value, proof);
  }
}
