const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');

const ProofMock = artifacts.require('ProofMock');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('ProofMock', ([_, owner]) => {
  context('Mapping to nonzero key', () => {
    beforeEach(async () => {
      this.contract = await ProofMock.new({ from: owner });
      this.rootHash =
        '0x177af3eea5434eff0056a742f6a968fc928eebe368569a4cbdf8ab6438bb54aa';
      this.key = '0x0367100453a0e46792466c1ce9a0eb84fc04904e';
      this.value =
        '0xbb0f12ed099c0606987849682f36f70731543a5ad15cdfd3d47159e1755c640c';
      this.proofs = [
        '0x0000000000000000000000000003bfffffffffffffffffffffffffffffffffff',
        '0x6b9c4179ae8d162cdfc71c03982516aae9c7029d47a68dcf397b839bd0c064cb',
        '0x8e70110bfc970738a02265b8b4559b76e9a374f9fa89a6a1854429dc193f3a8b',
        '0x15ff933a76f0508a2d09d36945db177a07410fae948e1aeeb6602e2ad44c3de0',
        '0x0e73e11c8b6a3fc15248108ce1adf65559e190cc8553d7f103bbcceb52c3e180',
        '0xf26c40d00bd38e6b3a11f47b439f49ba565e485ef38aae64d6cba896e6dc482b',
        '0x4ef7e1335cb56eb97c6a45a1e35b8bc0e541cf948c57b57e39b311bb1a96ef13',
        '0xfbbeb1505ae9fa5d36e3cfaf7f1fdaccb4387fd867b8254fb27361e43eb5f4f3',
        '0x96ba7837f94419d2da7f31eb3000e1a664bd0a976ddaecb3472f164565035d02',
        '0x932a5a20b9d7441ea81cb3df15d9155433b7231891764714f977b5a0f1f96400',
        '0xa3e412bab6d0a6fded598bd5bff625da7c55270dab08bc1df70a5f10cd555486',
        '0x442d3f3e4ab0c8814c5dd665c2828bb451c226c9f3b720fbb74db143dc0d5276',
        '0x34c776357cb2c1fa347724abea4ae48c838486a948c4ebadb318f20a8f2c183b',
        '0xff51fa4781d2fdda34f01e43c75f55e638af35be04e83bbf952ae6090b18904e',
        '0xd8bd275715d836fcd58ab0b33380b1ea3f3423bd806773c224b2c9798b8d892a',
        '0x0a813fcf0468a8e617bfd031dea08b3c630afdd087bb57885918f1728d0f718a',
      ];
    });

    it('should proof correctly if input is correct', async () => {
      await this.contract.verify(
        this.rootHash,
        this.key,
        this.value,
        this.proofs,
      );
    });

    it('should fail if key is changed', async () => {
      await reverting(
        this.contract.verify(
          this.rootHash,
          '0x0367100453a0e46792466c1ce9a0eb84fc04904f',
          this.value,
          this.proofs,
        ),
      );
    });

    it('should fail if value is changed', async () => {
      await reverting(
        this.contract.verify(
          this.rootHash,
          this.key,
          '0xbb0f12ed099c0606987849682f36f70731543a5ad15cdfd3d47159e1755c640d',
          this.proofs,
        ),
      );
    });

    it('should fail if proof is too short (truncated)', async () => {
      await reverting(
        this.contract.verify(
          this.rootHash,
          this.key,
          this.value,
          this.proofs.slice(0, -1),
        ),
      );
    });

    it('should fail if proof is too long (extra)', async () => {
      await reverting(
        this.contract.verify(
          this.rootHash,
          this.key,
          this.value,
          this.proofs.concat([
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          ]),
        ),
      );
    });
  });

  context('Mapping to zero key', () => {
    beforeEach(async () => {
      this.contract = await ProofMock.new({ from: owner });
      this.rootHash =
        '0x9c2824ba9d3851f13b272e3ae432b58011c529e88613fd54e75bf2388d2a6022';
      this.key = '0xa63ae0df6209c7514c18d6bf7f7e69460cd0d04a';
      this.value =
        '0x0000000000000000000000000000000000000000000000000000000000000000';
      this.proofs = [
        '0x0000000000000000000000000007ffffffffffffffffffffffffffffffffffff',
        '0x3f6101114395ab85f8d4d97b8a6e6d2c5118f48c563b7c7ced5489c47b84600c',
        '0xdb60bf4f157f2f3a7420c281cb122d0b195dbdea13e151790aa54b9b5a97b6c5',
        '0x2d6265473fb4ca3f0fc680407628f969377a6a31e31f650a189defe32822f9a3',
        '0x9427bb5be4d93ac5849d8d14c51334c5930a2e4bc89a4f03cd2aa57bbe2f1619',
        '0x6d7375ea40410c97a515a8dc4abf05793b45e33563907325e66d143484e94649',
        '0xa8752a8101ad7c05f16201a7c91fa79796fd6c362cd0f5f34717e80f8c61f3c7',
        '0xb09308b70bcd2e8a766945be976e9e71fa345ae659e1ada29b4e51e954715346',
        '0x8e97d74ea0751a3d3367fa92bb1df4bd657f335b66cfd7a88937640d164d3a36',
        '0x3a0948968179df0df8ab8cd3a8f6e5373f309d143dac56ec97659820ba03176c',
        '0x708e995348326c04a7aba59fa4e7eadad23e693a7ef132902b19a547f2cfa475',
        '0xeaa37fb3c7892adbd1d3def07a3a4ebe350c59ab75acc88e57458b92b0953685',
        '0xf17d5104fc8d32b785f5c1f53f54840d457fa169eec2cd0ca854d2e98c092b0b',
        '0x8ba718f28d7411d9a436cce986b0b5d9de9bf3e063b77b40efd9d0c1d7def178',
      ];
    });

    it('should proof correctly if input is correct', async () => {
      await this.contract.verify(
        this.rootHash,
        this.key,
        this.value,
        this.proofs,
      );
    });
  });
});
