pragma solidity 0.5.9;

import "./token/SnapshotToken.sol";

contract BandToken is ERC20Base("BandToken", "BAND"), SnapshotToken {}