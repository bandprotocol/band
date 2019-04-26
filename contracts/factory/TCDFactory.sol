pragma solidity 0.5.0;

import "../CommunityCore.sol";
import "../data/TCD.sol";

contract TCDFactory {
  function create(CommunityCore core) external returns (TCD) {
    return new TCD(core);
  }
}