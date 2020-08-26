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
    this.tcdFactory = await OffchainAggTCDFactory.new();
    this.registry = await BandRegistry.new(
      this.band.address,
      this.exchange.address,
      { from: owner },
    );
    this.commFactory = await CommunityFactory.new(this.registry.address, {
      from: owner,
    });
    const testCurve = await EquationExpression.new(
      [1],
      '19999999999999999999999999',
    );
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
    await this.comm.addCapper(this.tcdFactory.address, { from: owner });

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    // alice buy 1000 SDD
    const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      1000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );
    // bob buy 1000 SDD
    const calldata2 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      10000,
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
    const data2 = await this.tcdFactory.createOffchainAggTCD(
      web3.utils.fromAscii('data:'),
      data1.receipt.logs[2].args.bondingCurve,
      this.registry.address,
      data1.receipt.logs[2].args.params,
    );

    this.tcd = await OffchainAggTCD.at(data2.receipt.logs[0].args.mtcd);

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
      [10, 3, '500000000000000000', 100, 0, this.tcd.address, 38580246914],
      { from: owner },
    );

    // Create exchange
    await this.band.transfer(this.exchange.address, 10000000, { from: owner });
    await this.exchange.setExchangeRate('1000000000000000000000', {
      from: owner,
    });
  });

  context('Inflate tokens to TCD contract', () => {
    it("should fail if there aren't active provider", async () => {
      await time.increase(30 * 24 * 60 * 60);
      // Alice buy token
      const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      await expectRevert.unspecified(
        this.band.transferAndCall(
          this.curve.address,
          100000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        ),
      );

      (await this.comm.balanceOf(this.tcd.address)).toString().should.eq('0');

      (await this.tcd.activeCount()).toString().should.eq('0');
    });

    it('should increase stake of provider after inflation', async () => {
      // Register new provider
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000001',
        40,
        { from: alice },
      );

      // Increase time
      await time.increase(30 * 24 * 60 * 60);

      // Alice buy token
      const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );

      // Inflation must send to TCD Contract
      (await this.comm.balanceOf(this.tcd.address)).toString().should.eq('400');

      // Stake of alice must increase 400
      (await this.tcd.getStake(alice, alice)).toString().should.eq('440');
    });

    it('should distribute stake to stakers after inflation', async () => {
      // Register new provider
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000001',
        40,
        { from: alice },
      );

      await this.tcd.stake(
        alice,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        60,
        { from: bob },
      );

      // Increase time
      await time.increase(30 * 24 * 60 * 60);

      // Alice buy token
      const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );

      // Inflation must send to TCD Contract
      (await this.comm.balanceOf(this.tcd.address)).toString().should.eq('400');

      // Stake of alice must increase 160
      (await this.tcd.getStake(alice, alice)).toString().should.eq('200');

      // Stake of alice must increase 240
      (await this.tcd.getStake(alice, bob)).toString().should.eq('300');
    });

    it('should distribute stake to providers after inflation', async () => {
      // Register new provider
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000001',
        40,
        { from: alice },
      );

      await this.tcd.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        60,
        { from: bob },
      );

      // Increase time
      await time.increase(30 * 24 * 60 * 60);

      // Alice buy token
      const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );

      // Inflation must send to TCD Contract
      (await this.comm.balanceOf(this.tcd.address)).toString().should.eq('400');

      // Stake of alice must increase 200
      (await this.tcd.getStake(alice, alice)).toString().should.eq('240');

      // Stake of alice must increase 200
      (await this.tcd.getStake(bob, bob)).toString().should.eq('260');
    });

    it('should distribute inflated tokens correctly every inflation happen', async () => {
      // Register new provider
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000001',
        40,
        { from: alice },
      );

      await this.tcd.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        60,
        { from: bob },
      );

      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000000',
        60,
        { from: carol },
      );

      // Increase time
      await time.increase(30 * 24 * 60 * 60);

      // Alice buy token
      const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );

      // Inflation must send to TCD Contract
      (await this.comm.balanceOf(this.tcd.address)).toString().should.eq('400');

      // Stake of alice must increase 133
      (await this.tcd.getStake(alice, alice)).toString().should.eq('173');

      // Stake of bob must increase 133
      (await this.tcd.getStake(bob, bob)).toString().should.eq('193');

      // Stake of carol must increase 133
      (await this.tcd.getStake(carol, carol)).toString().should.eq('193');

      // UndistributedReward must be 1
      (await this.tcd.undistributedReward()).toString().should.eq('1');

      // Increase time 1 month again
      await time.increase(30 * 24 * 60 * 60);

      // Alice sell token
      const sellData = this.curve.contract.methods.sell(_, 0, 1).encodeABI();
      this.comm.transferAndCall(
        this.curve.address,
        1000,
        '0x' + sellData.slice(2, 10),
        '0x' + sellData.slice(138),
        { from: alice },
      );

      // Inflation must distribute to providers
      (await this.comm.balanceOf(this.tcd.address)).toString().should.eq('940');

      // Stake of alice must increase 180
      (await this.tcd.getStake(alice, alice)).toString().should.eq('353');

      // Stake of bob must increase 180
      (await this.tcd.getStake(bob, bob)).toString().should.eq('373');

      // Stake of carol must increase 180
      (await this.tcd.getStake(carol, carol)).toString().should.eq('373');

      // UndistributedReward must be 1
      (await this.tcd.undistributedReward()).toString().should.eq('1');
    });
  });

  context('Inflate tokens to user address', () => {
    beforeEach(async () => {
      // Set benificiary to carol
      await this.params.setRaw(
        [web3.utils.fromAscii('bonding:revenue_beneficiary')],
        [carol],
        { from: owner },
      );
    });
    it('should send inflated token to benificiary', async () => {
      await time.increase(30 * 24 * 60 * 60);
      // Alice buy token
      const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      this.band.transferAndCall(
        this.curve.address,
        100000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      ),
        // Inflation must send to Carol
        (await this.comm.balanceOf(carol)).toString().should.eq('1400');
    });
  });
});
