const { expectRevert, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const EquationExpression = artifacts.require('EquationExpression');
const BandMockExchange = artifacts.require('BandMockExchange');
const OffchainAggTCD = artifacts.require('OffchainAggTCD');
const OffchainAggTCDFactory = artifacts.require('OffchainAggTCDFactory');
const CommunityFactory = artifacts.require('CommunityFactory');

require('chai').should();

contract('BondingCurve', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new({ from: owner });
    await this.band.mint(owner, 100000000, { from: owner });
    this.exchange = await BandMockExchange.new(this.band.address, {
      from: owner,
    });
    this.mtcdFactory = await OffchainAggTCDFactory.new();
    this.registry = await BandRegistry.new(
      this.band.address,
      this.exchange.address,
      { from: owner },
    );
    this.commFactory = await CommunityFactory.new(this.registry.address, {
      from: owner,
    });
    const testCurve = await EquationExpression.new([1]);
    const data1 = await this.commFactory.create(
      'Data feed token',
      'XFN',
      testCurve.address,
      '0',
      '60',
      '5',
      '5',
      {
        from: owner,
      },
    );
    this.comm = await CommunityToken.at(data1.receipt.logs[2].args.token);
    this.curve = await BondingCurve.at(data1.receipt.logs[2].args.bondingCurve);
    this.params = await Parameters.at(data1.receipt.logs[2].args.params);
    await this.comm.addCapper(this.mtcdFactory.address, { from: owner });

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    // alice buy 1000 SDD
    const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      1000000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );
    // bob buy 1000 SDD
    const calldata2 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      3000000,
      '0x' + calldata2.slice(2, 10),
      '0x' + calldata2.slice(138),
      { from: bob },
    );
    // carol buy 1000 SDD
    const calldata3 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      5000000,
      '0x' + calldata3.slice(2, 10),
      '0x' + calldata3.slice(138),
      { from: carol },
    );
    // owner buy 1000 SDD
    const calldata4 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      7000000,
      '0x' + calldata4.slice(2, 10),
      '0x' + calldata4.slice(138),
      { from: owner },
    );

    // Create TCD
    const data2 = await this.mtcdFactory.createOffchainAggTCD(
      web3.utils.fromAscii('data:'),
      data1.receipt.logs[2].args.bondingCurve,
      this.registry.address,
      data1.receipt.logs[2].args.params,
    );

    this.mtcd = await OffchainAggTCD.at(data2.receipt.logs[0].args.mtcd);

    await this.params.setRaw(
      [
        web3.utils.fromAscii('data:min_provider_stake'),
        web3.utils.fromAscii('data:max_provider_count'),
        web3.utils.fromAscii('data:owner_revenue_pct'),
        web3.utils.fromAscii('data:query_price'),
        web3.utils.fromAscii('data:withdraw_delay'),
        web3.utils.fromAscii('bonding:revenue_beneficiary'),
        web3.utils.fromAscii('bonding:inflation_rate'),
      ],
      [10, 3, '500000000000000000', 100, 0, this.mtcd.address, 38580246914],
      { from: owner },
    );

    // Create exchange
    await this.band.transfer(this.exchange.address, 10000000, { from: owner });
    await this.exchange.setExchangeRate('1000000000000000000000', {
      from: owner,
    });
  });

  context(
    "Tokens are transfered to TCD contract if there aren't providers",
    () => {
      it('should buy tokens and infaltion send to TCD', async () => {
        await time.increase(30 * 24 * 60 * 60);
        // Alice buy token
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 1000)
          .encodeABI();
        await this.band.transferAndCall(
          this.curve.address,
          10000000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        (await this.comm.balanceOf(this.mtcd.address))
          .toString()
          .should.eq('1');
      });
    },
  );
});
