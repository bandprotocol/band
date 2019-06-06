pragma solidity 0.5.9;

import "../token/SnapshotToken.sol";
import "../Parameters.sol";

library ParametersFactory {
  function create(SnapshotToken token) external returns (Parameters) {
    return new Parameters(token);
  }
}
