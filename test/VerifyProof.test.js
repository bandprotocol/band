const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow');

const VerifyMock = artifacts.require('VerifyMock');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('VerifyMock', ([_, owner]) => {
  context('Check gas consumption', () => {
    beforeEach(async () => {
      this.contract = await VerifyMock.new({ from: owner});
    });

    it('should proof correctly', async () =>{
      const rootHash = '0x177af3eea5434eff0056a742f6a968fc928eebe368569a4cbdf8ab6438bb54aa';
      const key = '0x0367100453a0e46792466c1ce9a0eb84fc04904e';
      const value = '0xbb0f12ed099c0606987849682f36f70731543a5ad15cdfd3d47159e1755c640c';
      const mask = new BigNumber("83627794494489836780758943522431355647426559");
      const proofs = [
        "0x6b9c4179ae8d162cdfc71c03982516aae9c7029d47a68dcf397b839bd0c064cb",
        "0x8e70110bfc970738a02265b8b4559b76e9a374f9fa89a6a1854429dc193f3a8b",
        "0x15ff933a76f0508a2d09d36945db177a07410fae948e1aeeb6602e2ad44c3de0",
        "0x0e73e11c8b6a3fc15248108ce1adf65559e190cc8553d7f103bbcceb52c3e180",
        "0xf26c40d00bd38e6b3a11f47b439f49ba565e485ef38aae64d6cba896e6dc482b",
        "0x4ef7e1335cb56eb97c6a45a1e35b8bc0e541cf948c57b57e39b311bb1a96ef13",
        "0xfbbeb1505ae9fa5d36e3cfaf7f1fdaccb4387fd867b8254fb27361e43eb5f4f3",
        "0x96ba7837f94419d2da7f31eb3000e1a664bd0a976ddaecb3472f164565035d02",
        "0x932a5a20b9d7441ea81cb3df15d9155433b7231891764714f977b5a0f1f96400",
        "0xa3e412bab6d0a6fded598bd5bff625da7c55270dab08bc1df70a5f10cd555486",
        "0x442d3f3e4ab0c8814c5dd665c2828bb451c226c9f3b720fbb74db143dc0d5276",
        "0x34c776357cb2c1fa347724abea4ae48c838486a948c4ebadb318f20a8f2c183b",
        "0xff51fa4781d2fdda34f01e43c75f55e638af35be04e83bbf952ae6090b18904e",
        "0xd8bd275715d836fcd58ab0b33380b1ea3f3423bd806773c224b2c9798b8d892a",
        "0x0a813fcf0468a8e617bfd031dea08b3c630afdd087bb57885918f1728d0f718a",
      ];

      await this.contract.verify(rootHash, key, value, mask, proofs);
    });

    it('should throw if not enough proofs', async () =>{
      const rootHash = '0x177af3eea5434eff0056a742f6a968fc928eebe368569a4cbdf8ab6438bb54aa';
      const key = '0x0367100453a0e46792466c1ce9a0eb84fc04904e';
      const value = '0xbb0f12ed099c0606987849682f36f70731543a5ad15cdfd3d47159e1755c640c';
      const mask = new BigNumber("83627794494489836780758943522431355647426559");
      const proofs = [
        "0x6b9c4179ae8d162cdfc71c03982516aae9c7029d47a68dcf397b839bd0c064cb",
        "0x8e70110bfc970738a02265b8b4559b76e9a374f9fa89a6a1854429dc193f3a8b",
        "0x15ff933a76f0508a2d09d36945db177a07410fae948e1aeeb6602e2ad44c3de0",
        "0x0e73e11c8b6a3fc15248108ce1adf65559e190cc8553d7f103bbcceb52c3e180",
        "0xf26c40d00bd38e6b3a11f47b439f49ba565e485ef38aae64d6cba896e6dc482b",
        "0x4ef7e1335cb56eb97c6a45a1e35b8bc0e541cf948c57b57e39b311bb1a96ef13",
        "0xfbbeb1505ae9fa5d36e3cfaf7f1fdaccb4387fd867b8254fb27361e43eb5f4f3",
        "0x96ba7837f94419d2da7f31eb3000e1a664bd0a976ddaecb3472f164565035d02",
        "0x932a5a20b9d7441ea81cb3df15d9155433b7231891764714f977b5a0f1f96400",
        "0xa3e412bab6d0a6fded598bd5bff625da7c55270dab08bc1df70a5f10cd555486",
        "0x442d3f3e4ab0c8814c5dd665c2828bb451c226c9f3b720fbb74db143dc0d5276",
        "0x34c776357cb2c1fa347724abea4ae48c838486a948c4ebadb318f20a8f2c183b",
        "0xff51fa4781d2fdda34f01e43c75f55e638af35be04e83bbf952ae6090b18904e",
        "0xd8bd275715d836fcd58ab0b33380b1ea3f3423bd806773c224b2c9798b8d892a",
      ];

      await expectThrow(this.contract.verify(rootHash, key, value, mask, proofs));
    });

    it('should proof incorrectly', async () =>{
      const rootHash = '0x177af3eea5434eff0056a742f6a968fc928eebe368569a4cbdf8ab6438bb54aa';
      const key = '0x0367100453a0e46792466c1ce9a0eb84fc04904e';
      const value = '0xbb0f12ed099c0606987849682f36f70731543a5ad15cdfd3d47159e1755c640c';
      const mask = new BigNumber("83627794494489836780758943522431355647426559");
      const proofs = [
        "0x6b9c4179ae8d162cdfc71c03982516aae9c7029d47a68dcf397b839bd0c064cb",
        "0x8e70110bfc970738a02265b8b4559b76e9a374f9fa89a6a1854429dc193f3a8b",
        "0x15ff933a76f0508a2d09d36945db177a07410fae948e1aeeb6602e2ad44c3de0",
        "0x0e73e11c8b6a3fc15248108ce1adf65559e190cc8553d7f103bbcceb52c3e180",
        "0xf26c40d00bd38e6b3a11f47b439f49ba565e485ef38aae64d6cba896e6dc482b",
        "0x4ef7e1335cb56eb97c6a45a1e35b8bc0e541cf948c57b57e39b311bb1a96ef13",
        "0xfbbeb1505ae9fa5d36e3cfaf7f1fdaccb4387fd867b8254fb27361e43eb5f4f3",
        "0x96ba7837f94419d2da7f31eb3000e1a664bd0a976ddaecb3472f164565035d02",
        "0x932a5a20b9d7441ea81cb3df15d9155433b7231891764714f977b5a0f1f96400",
        "0xa3e412bab6d0a6fded598bd5bff625da7c55270dab08bc1df70a5f10cd555486",
        "0x442d3f3e4ab0c8814c5dd665c2828bb451c226c9f3b720fbb74db143dc0d5276",
        "0x34c776357cb2c1fa347724abea4ae48c838486a948c4ebadb318f20a8f2c183b",
        "0xff51fa4781d2fdda34f01e43c75f55e638af35be04e83bbf952ae6090b18904e",
        "0xd8bd275715d836fcd58ab0b33380b1ea3f3423bd806773c224b2c9798b8d892a",
        "0x0a813fcf0468a8e617bfd031dea08b3c630afdd087bb57885918f0728d0f718a",
      ];

      await expectThrow(this.contract.verify(rootHash, key, value, mask, proofs));
    });
  });

});