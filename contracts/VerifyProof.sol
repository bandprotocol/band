pragma solidity ^0.4.24;

library SMTProofVerifier{

  function verifyProof(bytes32 rootHash, address key, bytes32 value, uint mask, bytes32[] proof) internal pure returns (bool){
    bytes32 currentLeaf = value;
    bytes32 anotherLeaf;

    uint256 proofIndex = 0;

    for (uint256 i = 1; i < (1 << 160); i <<= 1)
    {
      if((mask & i) > 0) {
        anotherLeaf = bytes32(0);
      }
      else {
        anotherLeaf = proof[proofIndex];
        proofIndex++;
      }

      if ((uint(key) & i) == 0) {
        currentLeaf = keccak256(currentLeaf, anotherLeaf);
      }
      else {
        currentLeaf = keccak256(anotherLeaf, currentLeaf);
      }
    }
    require(currentLeaf == rootHash, "Invalid proof");
    return true;
  }
}
