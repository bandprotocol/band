pragma solidity 0.5.8;

import "./token/SnapshotToken.sol";

contract BandToken is ERC20Base("BandToken", "BAND"), SnapshotToken {}