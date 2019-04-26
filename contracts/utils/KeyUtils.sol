pragma solidity 0.5.0;

library KeyUtils {
  function append(bytes8 namespace, bytes24 value) internal pure returns (bytes32) {
    uint8 namespaceSize = 0;
    while (namespaceSize < 8 && namespace[namespaceSize] != byte(0)) {
      ++namespaceSize;
    }
    return bytes32(namespace) | (bytes32(value) >> (8 * namespaceSize));
  }
}