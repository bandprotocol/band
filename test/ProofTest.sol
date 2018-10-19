pragma solidity ^0.4.24;

import "truffle/Assert.sol";

import "../contracts/Proof.sol";


contract ProofTest {
  using Proof for bytes32;

  function testThreeItemsVerifier() public {
    bytes32 rootHash = hex"0ac83193a113ebedc560e19442c55ef5afc7f22d0447df5d524f713fa19854fe";
    address key = 0x0000000000000000000000000000000000000002;
    bytes32 value = hex"00000000000000000000000000000000000000000000000000000000000001f4";
    bytes32[] memory proof = new bytes32[](2);
    proof[0] = hex"000000000000000000000000fffffffffffffffffffffffffffffffffffffffd";
    proof[1] = hex"a2c523bfff3a3b38cbbf7b09282b1d4363a481878af2d26e6e2bf29fe7b38311";
    Assert.isTrue(rootHash.verify(key, value, proof), "Proof of 3 items");
  }

  function test10kItemsVerifier() public {
    bytes32 rootHash = hex"177af3eea5434eff0056a742f6a968fc928eebe368569a4cbdf8ab6438bb54aa";
    address key = 0x0367100453A0e46792466C1CE9A0eb84fc04904E;
    bytes32 value = hex"bb0f12ed099c0606987849682f36f70731543a5ad15cdfd3d47159e1755c640c";
    bytes32[] memory proof = new bytes32[](16);
    proof[0] = hex"0000000000000000000000000003bfffffffffffffffffffffffffffffffffff";
    proof[1] = hex"6b9c4179ae8d162cdfc71c03982516aae9c7029d47a68dcf397b839bd0c064cb";
    proof[2] = hex"8e70110bfc970738a02265b8b4559b76e9a374f9fa89a6a1854429dc193f3a8b";
    proof[3] = hex"15ff933a76f0508a2d09d36945db177a07410fae948e1aeeb6602e2ad44c3de0";
    proof[4] = hex"0e73e11c8b6a3fc15248108ce1adf65559e190cc8553d7f103bbcceb52c3e180";
    proof[5] = hex"f26c40d00bd38e6b3a11f47b439f49ba565e485ef38aae64d6cba896e6dc482b";
    proof[6] = hex"4ef7e1335cb56eb97c6a45a1e35b8bc0e541cf948c57b57e39b311bb1a96ef13";
    proof[7] = hex"fbbeb1505ae9fa5d36e3cfaf7f1fdaccb4387fd867b8254fb27361e43eb5f4f3";
    proof[8] = hex"96ba7837f94419d2da7f31eb3000e1a664bd0a976ddaecb3472f164565035d02";
    proof[9] = hex"932a5a20b9d7441ea81cb3df15d9155433b7231891764714f977b5a0f1f96400";
    proof[10] = hex"a3e412bab6d0a6fded598bd5bff625da7c55270dab08bc1df70a5f10cd555486";
    proof[11] = hex"442d3f3e4ab0c8814c5dd665c2828bb451c226c9f3b720fbb74db143dc0d5276";
    proof[12] = hex"34c776357cb2c1fa347724abea4ae48c838486a948c4ebadb318f20a8f2c183b";
    proof[13] = hex"ff51fa4781d2fdda34f01e43c75f55e638af35be04e83bbf952ae6090b18904e";
    proof[14] = hex"d8bd275715d836fcd58ab0b33380b1ea3f3423bd806773c224b2c9798b8d892a";
    proof[15] = hex"0a813fcf0468a8e617bfd031dea08b3c630afdd087bb57885918f1728d0f718a";
    Assert.isTrue(rootHash.verify(key, value, proof), "Proof of 10k items");
  }

  function testKeccak() public {
    bytes32 key = hex"0000000000000000000000000000000000000000000000000000000000000002";
    bytes32 value = hex"00000000000000000000000000000000000000000000000000000000000001f4";
    Assert.equal(hex"ec9b1045d94e98fcea079ea2e283b505a3a5db6bb89ef61d3392606eac0c1f35", keccak256(abi.encodePacked(key, value)), "Hash must match.");
  }
}
