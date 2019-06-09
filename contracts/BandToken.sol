pragma solidity 0.5.9;

import { ERC20Base } from "./token/ERC20Base.sol";
import { SnapshotToken } from "./token/SnapshotToken.sol";


/// "BandToken" is the native ERC-20 token of Band Protocol.
contract BandToken is ERC20Base("BandToken", "BAND"), SnapshotToken {}