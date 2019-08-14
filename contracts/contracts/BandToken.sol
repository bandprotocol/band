pragma solidity 0.5.9;

import "./token/ERC20Base.sol";
import "./token/SnapshotToken.sol";


/// "BandToken" is the native ERC-20 token of Band Protocol.
contract BandToken is ERC20Base("BandToken", "BAND"), SnapshotToken {}