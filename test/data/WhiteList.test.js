const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandMockExchange = artifacts.require('BandMockExchange');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const TCDBase = artifacts.require('TCDBase');
const TCDFactory = artifacts.require('TCDFactory');
const SimpleDataSource = artifacts.require('SimpleDataSource');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const WhiteListTCR = artifacts.require('WhiteListTCR');

require('chai').should();

const op = x => (x.length < 64 ? op('0' + x) : '0x' + x);

contract('WhiteListTCR', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new({ from: owner });
    await this.band.mint(owner, 100000000, { from: owner });
    this.exchange = await BandMockExchange.new(this.band.address, {
      from: owner,
    });
    this.tcdFactory = await TCDFactory.new();
    this.registry = await BandRegistry.new(
      this.band.address,
      this.exchange.address,
      { from: owner },
    );
    this.whiteListTCRDecay = await BondingCurveExpression.new([
      18,
      14,
      1,
      0,
      60,
      0,
      '1000000000000000000',
      18,
      14,
      1,
      0,
      120,
      5,
      0,
      '1000000000000000000',
      7,
      6,
      0,
      '500000000000000000',
      5,
      1,
      0,
      60,
      0,
      60,
      0,
      '500000000000000000',
    ]);
    this.registryParams = await Parameters.new(this.band.address, {
      from: owner,
    });
    this.whiteList = await WhiteListTCR.new(
      web3.utils.fromAscii('tcr:'),
      this.whiteListTCRDecay.address,
      this.registryParams.address,
      { from: owner },
    );
    this.commFactory = await CommunityFactory.new(this.registry.address, {
      from: owner,
    });
    const testCurve = await BondingCurveExpression.new([1]);
    const data1 = await this.commFactory.create(
      'CoinHatcher',
      'CHT',
      testCurve.address,
      '0',
      '60',
      '5',
      '5',
      { from: owner },
    );
    // console.log(data1.receipt.logs);
    this.comm = await CommunityToken.at(data1.receipt.logs[2].args.token);
    this.curve = await BondingCurve.at(data1.receipt.logs[2].args.bondingCurve);
    this.params = await Parameters.at(data1.receipt.logs[2].args.params);
    await this.comm.addCapper(this.tcdFactory.address, { from: owner });
    const data2 = await this.tcdFactory.createTCD(
      web3.utils.fromAscii('data:'),
      data1.receipt.logs[2].args.bondingCurve,
      this.registry.address,
      data1.receipt.logs[2].args.params,
      true,
    );

    await this.params.setRaw(
      [
        web3.utils.fromAscii('data:min_provider_stake'),
        web3.utils.fromAscii('data:max_provider_count'),
        web3.utils.fromAscii('data:owner_revenue_pct'),
        web3.utils.fromAscii('data:query_price'),
        web3.utils.fromAscii('data:withdraw_delay'),
      ],
      [10, 3, '500000000000000000', 100, 0],
      { from: owner },
    );

    this.tcd = await TCDBase.at(data2.receipt.logs[0].args.tcd);

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

    await this.band.transfer(this.exchange.address, 10000000, { from: owner });
    await this.exchange.setExchangeRate('1000000000000000000000', {
      from: owner,
    });
  });
  context('Check setting', () => {
    it('check setting of whiteList', async () => {
      (await this.whiteList.depositDecayFunction())
        .toString()
        .should.eq(this.whiteListTCRDecay.address);
      (await this.whiteList.params())
        .toString()
        .should.eq(this.registryParams.address);
      (await this.whiteList.token()).toString().should.eq(this.band.address);
      (await this.registry.whiteList())
        .toString()
        .should.eq('0x0000000000000000000000000000000000000000');
    });
    it('Only owner can set whiteList of registry', async () => {
      (await this.registry.whiteList())
        .toString()
        .should.eq('0x0000000000000000000000000000000000000000');
      await this.registry.setWhiteList(bob, { from: owner });
      (await this.registry.whiteList()).toString().should.eq(bob);
      await shouldFail.reverting(
        this.registry.setWhiteList(alice, { from: alice }),
      );
      (await this.registry.whiteList()).toString().should.eq(bob);
    });
  });
  context('Get', () => {
    beforeEach(async () => {
      this.ownerSource = await SimpleDataSource.new('From owner', {
        from: owner,
      });
      await this.ownerSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        20,
        {
          from: owner,
        },
      );
      await this.tcd.register(40, this.ownerSource.address, {
        from: owner,
      });
      this.aliceSource = await SimpleDataSource.new('From alice', {
        from: alice,
      });
      await this.aliceSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        20,
        {
          from: alice,
        },
      );
      await this.tcd.register(30, this.aliceSource.address, {
        from: alice,
      });
      this.bobSource = await SimpleDataSource.new('From bob', { from: bob });
      await this.bobSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        10,
        {
          from: bob,
        },
      );
      await this.tcd.register(20, this.bobSource.address, { from: bob });
      this.carolSource = await SimpleDataSource.new('From carol', {
        from: carol,
      });
      await this.carolSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        11,
        {
          from: carol,
        },
      );
      await this.tcd.register(10, this.carolSource.address, {
        from: carol,
      });
      await this.registryParams.setRaw(
        [
          web3.utils.fromAscii('tcr:min_deposit'),
          web3.utils.fromAscii('tcr:apply_stage_length'),
          web3.utils.fromAscii('tcr:dispensation_percentage'),
          web3.utils.fromAscii('tcr:commit_time'),
          web3.utils.fromAscii('tcr:reveal_time'),
          web3.utils.fromAscii('tcr:min_participation_pct'),
          web3.utils.fromAscii('tcr:support_required_pct'),
        ],
        [1, 0, '0', 30, 30, '0', '1'],
        { from: owner },
      );
      await this.band.approve(this.whiteList.address, 10000000, {
        from: owner,
      });
      await this.band.approve(this.whiteList.address, 10000000, {
        from: alice,
      });
      await this.band.approve(this.whiteList.address, 10000000, {
        from: bob,
      });
      await this.band.approve(this.whiteList.address, 10000000, {
        from: carol,
      });
    });
    it('should revert if value less than query', async () => {
      shouldFail.reverting(
        this.tcd.query(
          '0x5000000000000000000000000000000000000000000000000000000000000000',
        ),
      );
    });
    it('should be able to apply to whiteList', async () => {
      (await this.whiteList.verify(alice)).toString().should.eq('false');
      await this.whiteList.applyEntry(alice, 1, op(alice.slice(2)), {
        from: alice,
      });
      (await this.whiteList.verify(alice)).toString().should.eq('true');
    });
    it('should verify whiteList via registry', async () => {
      await this.registry.setWhiteList(this.whiteList.address, { from: owner });
      (await this.registry.verify(alice)).toString().should.eq('false');
      await this.whiteList.applyEntry(alice, 1, op(alice.slice(2)), {
        from: alice,
      });
      (await this.registry.verify(alice)).toString().should.eq('true');
    });
    it('should return value and get eth when data retrieved', async () => {
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      (await web3.eth.getBalance(this.tcd.address)).should.eq('100');
    });
    it('Can only read if after has been applied to whiteList', async () => {
      await this.registry.setWhiteList(this.whiteList.address, { from: owner });
      await this.whiteList.applyEntry(alice, 1, op(alice.slice(2)), {
        from: alice,
      });
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: alice,
          value: 100,
        },
      );

      await shouldFail.reverting(
        this.tcd.query(
          '0x5000000000000000000000000000000000000000000000000000000000000000',
          {
            from: bob,
            value: 100,
          },
        ),
      );

      await this.whiteList.applyEntry(bob, 1, op(bob.slice(2)), {
        from: bob,
      });
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: alice,
          value: 100,
        },
      );
    });
    it('Can not read after has been challenged out of whiteList', async () => {
      await this.registry.setWhiteList(this.whiteList.address, { from: owner });
      await this.whiteList.applyEntry(alice, 1, op(alice.slice(2)), {
        from: alice,
      });
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: alice,
          value: 100,
        },
      );

      await this.whiteList.initiateChallenge(
        carol,
        1,
        op(alice.slice(2)),
        web3.utils.fromAscii('carol fire alice'),
        { from: carol },
      );

      await time.increase(time.duration.seconds(60));
      await this.whiteList.resolveChallenge(1, {
        from: carol,
      });

      await shouldFail.reverting(
        this.tcd.query(
          '0x5000000000000000000000000000000000000000000000000000000000000000',
          {
            from: alice,
            value: 100,
          },
        ),
      );
    });
  });
});
