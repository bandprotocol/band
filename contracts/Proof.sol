pragma solidity ^0.4.24;

library Proof {

  function verify(
    bytes32 rootHash,
    address key,
    bytes32 value,
    bytes32[] proof
  )
    internal
    pure
    returns (bool)
  {
    bytes32 currentLeaf = value;
    bytes32 anotherLeaf;

    uint256 proofIndex = 1;
    uint256 mask = uint256(proof[0]);

    for (uint256 i = 1; i < (1 << 160); i <<= 1) {
      if ((mask & i) > 0) {
        anotherLeaf = bytes32(0);
      } else {
        anotherLeaf = proof[proofIndex];
        proofIndex++;
      }

      if ((uint(key) & i) == 0) {
        currentLeaf = zeroHash(currentLeaf, anotherLeaf);
      } else {
        currentLeaf = zeroHash(anotherLeaf, currentLeaf);
      }
    }

    require(currentLeaf == rootHash, "Invalid proof");
    return true;
  }

  function update(
    bytes32 rootHash,
    address key,
    bytes32 oldValue,
    bytes32 newValue,
    bytes32[] proof
  )
    internal
    pure
    returns (bytes32)
  {
    bytes32 currentLeaf = oldValue;
    bytes32 newRootHash = newValue;
    bytes32 anotherLeaf;

    uint256 proofIndex = 1;
    uint256 mask = uint256(proof[0]);

    for (uint256 i = 1; i < (1 << 160); i <<= 1) {
      if ((mask & i) > 0) {
        anotherLeaf = bytes32(0);
      } else {
        anotherLeaf = proof[proofIndex];
        proofIndex++;
      }

      if ((uint(key) & i) == 0) {
        currentLeaf = zeroHash(currentLeaf, anotherLeaf);
        newRootHash = zeroHash(newRootHash, anotherLeaf);
      } else {
        currentLeaf = zeroHash(anotherLeaf, currentLeaf);
        newRootHash = zeroHash(anotherLeaf, newRootHash);
      }
    }

    require(currentLeaf == rootHash, "Invalid proof");
    return newRootHash;
  }

  function zeroHash(bytes32 left, bytes32 right) private pure returns(bytes32){
    if (left == bytes32(0) && right == bytes32(0)) {
      return bytes32(0);
    }

    return keccak256(abi.encodePacked(left, right));
  }
}
