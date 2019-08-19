pragma solidity 0.5.10;

import "band-solidity/contracts/data/BandLib.sol";

contract GasStation is usingBand {
    using BandLib for Oracle;

    mapping (string => uint256) public prices;

    function updatePrice(string calldata key) external payable {
        prices[key] = API.queryUint256(abi.encodePacked(hex"1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd", key , byte(0)));
    }
}
