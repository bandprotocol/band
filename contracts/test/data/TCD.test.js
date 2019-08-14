const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandMockExchange = artifacts.require('BandMockExchange');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const TCDBase = artifacts.require('TCDBase');
const AggTCDFactory = artifacts.require('AggTCDFactory');
const MockDataSource = artifacts.require('MockDataSource');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const MedianAggregator = artifacts.require('MedianAggregator');

require('chai').should();

const nextActiveList = async (tcdAddress, key) => {
  return web3.utils.toChecksumAddress(
    web3.utils.padLeft(
      await web3.eth.getStorageAt(
        tcdAddress,
        web3.utils.soliditySha3({ t: 'uint256', v: key }, 2),
      ),
      40,
    ),
  );
};

const nextReserveList = async (tcdAddress, key) => {
  return web3.utils.toChecksumAddress(
    web3.utils.padLeft(
      await web3.eth.getStorageAt(
        tcdAddress,
        web3.utils.soliditySha3({ t: 'uint256', v: key }, 3),
      ),
      40,
    ),
  );
};

contract('TCD', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new({ from: owner });
    await this.band.mint(owner, 100000000, { from: owner });
    this.exchange = await BandMockExchange.new(this.band.address, {
      from: owner,
    });
    this.tcdFactory = await AggTCDFactory.new();
    this.registry = await BandRegistry.new(
      this.band.address,
      this.exchange.address,
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
      {
        from: owner,
      },
    );
    this.comm = await CommunityToken.at(data1.receipt.logs[2].args.token);
    this.curve = await BondingCurve.at(data1.receipt.logs[2].args.bondingCurve);
    this.params = await Parameters.at(data1.receipt.logs[2].args.params);
    await this.comm.addCapper(this.tcdFactory.address, { from: owner });
    const data2 = await this.tcdFactory.createTCD(
      web3.utils.fromAscii('data:'),
      data1.receipt.logs[2].args.bondingCurve,
      this.registry.address,
      data1.receipt.logs[2].args.params,
    );
    this.median = await MedianAggregator.new({ from: owner });
    await this.params.setRaw(
      [
        web3.utils.fromAscii('data:min_provider_stake'),
        web3.utils.fromAscii('data:max_provider_count'),
        web3.utils.fromAscii('data:owner_revenue_pct'),
        web3.utils.fromAscii('data:query_price'),
        web3.utils.fromAscii('data:withdraw_delay'),
        web3.utils.fromAscii('data:data_aggregator'),
      ],
      [10, 3, '500000000000000000', 100, 0, this.median.address],
      { from: owner },
    );

    this.tcd = await TCDBase.at(data2.receipt.logs[0].args.atcd);

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
  context('Registration', () => {
    it('check setting of tcd', async () => {
      (await this.tcd.token()).toString().should.eq(this.comm.address);
      (await this.tcd.params()).toString().should.eq(this.params.address);
      (await this.tcd.activeCount()).toNumber().should.eq(0);
      (await this.tcd.reserveCount()).toNumber().should.eq(0);
    });
    it('should revert if stake less than min_provider_stake', async () => {
      await this.tcd.register(
        owner,
        '0x0000000000000000000000000000000000000001',
        40,
        { from: owner },
      );
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000001',
        30,
        { from: alice },
      );
      await this.tcd.register(
        bob,
        '0x0000000000000000000000000000000000000001',
        20,
        { from: bob },
      );
      await shouldFail.reverting(
        this.tcd.register(
          carol,
          '0x0000000000000000000000000000000000000001',
          9,
          { from: carol },
        ),
      );
      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000001',
        10,
        { from: carol },
      );

      (await this.tcd.activeCount()).toNumber().should.eq(3);

      (await this.tcd.reserveCount()).toNumber().should.eq(1);

      (await this.comm.unlockedBalanceOf(owner))
        .toNumber()
        .should.eq(1000 - 40);
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);

      const ownerDataSource = await this.tcd.infoMap(owner);
      const aliceDataSource = await this.tcd.infoMap(alice);
      const bobDataSource = await this.tcd.infoMap(bob);
      const carolDataSource = await this.tcd.infoMap(carol);

      ownerDataSource.stake.toNumber().should.eq(40);
      aliceDataSource.stake.toNumber().should.eq(30);
      bobDataSource.stake.toNumber().should.eq(20);
      carolDataSource.stake.toNumber().should.eq(10);

      ownerDataSource.totalOwnerships.toNumber().should.eq(40);
      aliceDataSource.totalOwnerships.toNumber().should.eq(30);
      bobDataSource.totalOwnerships.toNumber().should.eq(20);
      carolDataSource.totalOwnerships.toNumber().should.eq(10);

      ownerDataSource.owner.toString().should.eq(owner);
      aliceDataSource.owner.toString().should.eq(alice);
      bobDataSource.owner.toString().should.eq(bob);
      carolDataSource.owner.toString().should.eq(carol);
    });
    it('should revert if try to register again', async () => {
      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000001',
        10,
        { from: carol },
      );
      await shouldFail.reverting(
        this.tcd.register(
          carol,
          '0x0000000000000000000000000000000000000001',
          10,
          { from: carol },
        ),
      );
    });
    it('should register again if last owner withdraw all stake', async () => {
      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000001',
        10,
        { from: carol },
      );

      (await this.tcd.infoMap(carol)).owner.toString().should.eq(carol);
      await this.tcd.unstake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        { from: carol },
      );

      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000001',
        10,
        { from: alice },
      );

      (await this.tcd.infoMap(carol)).owner.toString().should.eq(alice);
    });
    it('should revert if not enough tokens', async () => {
      await shouldFail.reverting(
        this.tcd.register(
          carol,
          '0x0000000000000000000000000000000000000000',
          1001,
          { from: carol },
        ),
      );
    });
  });
  context('Kick from list', () => {
    beforeEach(async () => {
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000000',
        30,
        { from: alice },
      );
      await this.tcd.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        20,
        { from: bob },
      );
      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000000',
        10,
        { from: carol },
      );
    });
    it('dataSource should be automatically unlisted if owner has already withdrawn', async () => {
      await this.tcd.unstake(
        alice,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        30,
        { from: alice },
      );
      (await nextActiveList(this.tcd.address, alice)).should.eq(
        '0x0000000000000000000000000000000000000000',
      );
    });
    it('should be able to unlist if owner stake < min_provider_stake', async () => {
      (await this.params.getRaw(
        web3.utils.fromAscii('data:min_provider_stake'),
      ))
        .toNumber()
        .should.eq(10);
      // not enough to unlist carol
      await this.tcd.unstake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        0,
        {
          from: alice,
        },
      );
      (await nextActiveList(this.tcd.address, carol)).should.eq(bob);
      // (await this.tcd.activeList(carol)).toString().should.eq(bob);
      await this.params.propose(
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('data:min_provider_stake')],
        [20],
        {
          from: alice,
        },
      );
      // castVote
      await this.params.vote(0, true, {
        from: alice,
      });
      (await this.params.getRaw(
        web3.utils.fromAscii('data:min_provider_stake'),
      ))
        .toNumber()
        .should.eq(20);
      // enough to unlist carol
      await this.tcd.unstake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        0,
        {
          from: alice,
        },
      );

      // Remove from both lists
      (await nextActiveList(this.tcd.address, carol)).should.eq(
        '0x0000000000000000000000000000000000000000',
      );
      // (await this.tcd.activeList(carol))
      //   .toString()
      //   .should.eq('0x0000000000000000000000000000000000000000');
      (await nextReserveList(this.tcd.address, carol)).should.eq(
        '0x0000000000000000000000000000000000000000',
      );
      // (await this.tcd.reserveList(carol))
      //   .toString()
      //   .should.eq('0x0000000000000000000000000000000000000000');
      // not enough to unlist bob
      await this.tcd.unstake(
        bob,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        0,
        {
          from: alice,
        },
      );
      (await nextActiveList(this.tcd.address, bob)).should.eq(alice);
      // (await this.tcd.activeList(bob)).toString().should.eq(alice);
    });
  });
  context('Vote', () => {
    beforeEach(async () => {
      await this.tcd.register(
        owner,
        '0x0000000000000000000000000000000000000000',
        40,
        { from: owner },
      );
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000000',
        30,
        { from: alice },
      );
      await this.tcd.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        20,
        { from: bob },
      );
      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000000',
        10,
        { from: carol },
      );
    });
    it('should be able to vote', async () => {
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        { from: alice },
      );
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 10);
    });
    it('should be able to vote many times', async () => {
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        { from: alice },
      );
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        { from: alice },
      );
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 10 + 10);
    });
    it('should revert if not enough tokens', async () => {
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      await shouldFail.reverting(
        this.tcd.stake(
          owner,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          1000,
          {
            from: alice,
          },
        ),
      );
    });
    it('check dataSources', async () => {
      const numActiveSources = (await this.tcd.activeCount()).toNumber();
      const numAllSources =
        (await this.tcd.reserveCount()).toNumber() + numActiveSources;
      numActiveSources.should.eq(3);
      numAllSources.should.eq(4);
      // const expectedSources = [owner, alice, bob, carol];
      // (await this.tcd.activeList('0x0000000000000000000000000000000000000001'))
      //   .toString()
      //   .should.eq(bob);
      // (await this.tcd.activeList(bob)).toString().should.eq(alice);
      // (await this.tcd.activeList(alice)).toString().should.eq(owner);
      // (await this.tcd.activeList(owner))
      //   .toString()
      //   .should.eq('0x0000000000000000000000000000000000000001');

      (await nextActiveList(
        this.tcd.address,
        '0x0000000000000000000000000000000000000001',
      )).should.eq(bob);
      (await nextActiveList(this.tcd.address, bob)).should.eq(alice);
      (await nextActiveList(this.tcd.address, alice)).should.eq(owner);
      (await nextActiveList(this.tcd.address, owner)).should.eq(
        '0x0000000000000000000000000000000000000001',
      );

      (await nextReserveList(
        this.tcd.address,
        '0x0000000000000000000000000000000000000002',
      )).should.eq(carol);
      (await nextReserveList(this.tcd.address, carol)).should.eq(
        '0x0000000000000000000000000000000000000002',
      );
      // (await this.tcd.reserveList('0x0000000000000000000000000000000000000002'))
      //   .toString()
      //   .should.eq(carol);
      // (await this.tcd.reserveList(carol))
      //   .toString()
      //   .should.eq('0x0000000000000000000000000000000000000002');
    });
    it('check dataSources after voting', async () => {
      await this.tcd.stake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        15,
        {
          from: alice,
        },
      );
      // let expectedSources = [owner, alice, carol, bob];
      const activeListCount = (await this.tcd.activeCount()).toNumber();
      let expectedSources = [
        '0x0000000000000000000000000000000000000001',
        carol,
        alice,
        owner,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
      await this.tcd.stake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: bob,
        },
      );
      expectedSources = [
        '0x0000000000000000000000000000000000000001',
        alice,
        carol,
        owner,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
      await this.tcd.stake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: owner,
        },
      );
      expectedSources = [
        '0x0000000000000000000000000000000000000001',
        alice,
        owner,
        carol,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
    });
  });
  context('Withdraw', () => {
    beforeEach(async () => {
      await this.tcd.register(
        owner,
        '0x0000000000000000000000000000000000000000',
        40,
        { from: owner },
      );
      await this.tcd.register(
        alice,
        '0x0000000000000000000000000000000000000000',
        30,
        { from: alice },
      );
      await this.tcd.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        20,
        { from: bob },
      );
      await this.tcd.register(
        carol,
        '0x0000000000000000000000000000000000000000',
        10,
        { from: carol },
      );
    });
    it('should be able to withdraw', async () => {
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);

      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        41,
        {
          from: alice,
        },
      );
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        37,
        {
          from: bob,
        },
      );
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        68,
        {
          from: carol,
        },
      );

      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30 - 41);
      (await this.comm.unlockedBalanceOf(bob))
        .toNumber()
        .should.eq(1000 - 20 - 37);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10 - 68);

      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        37,
        { from: bob },
      );
      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        68,
        { from: carol },
      );
      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        41,
        { from: alice },
      );

      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);
    });
    it('dataSource should be ordered correctly after stake decrement', async () => {
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      await this.tcd.stake(
        alice,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      await this.tcd.stake(
        bob,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      await this.tcd.stake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      let numAllSources =
        (await this.tcd.reserveCount()).toNumber() +
        (await this.tcd.activeCount()).toNumber();
      numAllSources.should.eq(4);
      const activeListCount = (await this.tcd.activeCount()).toNumber();
      let expectedSources = [
        '0x0000000000000000000000000000000000000001',
        bob,
        alice,
        owner,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
      expectedSources = [alice, bob, carol, owner];
      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      expectedSources = [
        '0x0000000000000000000000000000000000000001',
        carol,
        bob,
        alice,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }

      await this.tcd.unstake(
        alice,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        80,
        { from: alice },
      );
      numAllSources =
        (await this.tcd.reserveCount()).toNumber() +
        (await this.tcd.activeCount()).toNumber();
      numAllSources.should.eq(3);
      expectedSources = [
        '0x0000000000000000000000000000000000000001',
        owner,
        carol,
        bob,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
      // numAllSources.should.eq(5);
      expectedSources = [carol, owner, bob];
      await this.tcd.unstake(
        bob,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      expectedSources = [
        '0x0000000000000000000000000000000000000001',
        bob,
        owner,
        carol,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
      await this.tcd.unstake(
        carol,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        50,
        { from: alice },
      );
      expectedSources = [
        '0x0000000000000000000000000000000000000001',
        carol,
        bob,
        owner,
        '0x0000000000000000000000000000000000000001',
      ];
      for (let i = 0; i < activeListCount + 1; i++) {
        (await nextActiveList(this.tcd.address, expectedSources[i])).should.eq(
          expectedSources[i + 1],
        );
        // (await this.tcd.activeList(expectedSources[i]))
        //   .toString()
        //   .should.eq(expectedSources[i + 1]);
      }
    });
    it('should be able to withdraw after owner has already exited', async () => {
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);

      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        17,
        { from: alice },
      );
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 17);
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        71,
        { from: bob },
      );
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 17 + 71);
      await this.tcd.stake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        666,
        { from: carol },
      );
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 17 + 71 + 666);

      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30 - 17);
      (await this.comm.unlockedBalanceOf(bob))
        .toNumber()
        .should.eq(1000 - 20 - 71);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10 - 666);

      // owner withdraw his/her stake, dataSource will automatically unlisted
      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        40,
        { from: owner },
      );

      const dataSource = await this.tcd.infoMap(owner);
      (await nextActiveList(this.tcd.address, owner)).should.eq(
        '0x0000000000000000000000000000000000000000',
      );
      // (await this.tcd.activeList(owner))
      //   .toString()
      //   .should.eq('0x0000000000000000000000000000000000000000');
      (await nextReserveList(this.tcd.address, owner)).should.eq(
        '0x0000000000000000000000000000000000000000',
      );
      // (await this.tcd.reserveList(owner))
      //   .toString()
      //   .should.eq('0x0000000000000000000000000000000000000000');
      dataSource.totalOwnerships.toNumber().should.eq(40 + 17 + 71 + 666 - 40);

      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        71,
        { from: bob },
      );
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40 - 71);

      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        666,
        { from: carol },
      );
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);
      (await this.tcd.infoMap(owner)).totalOwnerships
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40 - 71 - 666);

      await this.tcd.unstake(
        owner,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        17,
        { from: alice },
      );
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.tcd.infoMap(owner)).totalOwnerships.toNumber().should.eq(0); // 40 + 17 + 71 + 666 - 40 - 71 - 666 - 17
    });
  });
  context('Get', () => {
    beforeEach(async () => {
      this.ownerSource = await MockDataSource.new('From owner', {
        from: owner,
      });
      await this.ownerSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        20,
        {
          from: owner,
        },
      );
      await this.tcd.register(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        40,
        {
          from: owner,
        },
      );
      this.aliceSource = await MockDataSource.new('From alice', {
        from: alice,
      });
      await this.aliceSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        20,
        {
          from: alice,
        },
      );
      await this.tcd.register(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        30,
        {
          from: alice,
        },
      );
      this.bobSource = await MockDataSource.new('From bob', { from: bob });
      await this.bobSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        10,
        {
          from: bob,
        },
      );
      await this.tcd.register(
        this.bobSource.address,
        '0x0000000000000000000000000000000000000000',
        20,
        { from: bob },
      );
      this.carolSource = await MockDataSource.new('From carol', {
        from: carol,
      });
      await this.carolSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        11,
        {
          from: carol,
        },
      );
      await this.tcd.register(
        this.carolSource.address,
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: carol,
        },
      );
    });
    it('should revert if value less than query', async () => {
      await shouldFail.reverting(
        this.tcd.query(
          '0x5000000000000000000000000000000000000000000000000000000000000000',
        ),
      );
    });

    it('should return value and get eth when date retrieved', async () => {
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      (await web3.eth.getBalance(this.tcd.address)).should.eq('100');
    });

    it('should distribute value when someone call', async () => {
      // Carol join owner
      await this.tcd.stake(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        { from: carol },
      );
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );

      await this.tcd.distributeFee(100, { from: owner });

      (await this.comm.unlockedBalanceOf(owner)).toNumber().should.eq(960);
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(980);
      (await this.comm.unlockedBalanceOf(carol)).toNumber().should.eq(980);
      (await this.tcd.getStake(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(63);

      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);

      (await this.tcd.getStake(this.ownerSource.address, carol))
        .toNumber()
        .should.eq(13);

      await this.tcd.unstake(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: carol,
        },
      );

      (await this.comm.balanceOf(carol)).toNumber().should.eq(1003);
      (await this.comm.unlockedBalanceOf(carol)).toNumber().should.eq(993);

      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 101,
        },
      );

      await this.tcd.distributeFee(100, { from: owner });

      (await this.tcd.getStake(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(96);
      (await this.tcd.getStake(this.ownerSource.address, owner))
        .toNumber()
        .should.eq(103);
      await this.tcd.unstake(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: owner,
        },
      );

      (await this.comm.unlockedBalanceOf(owner)).toNumber().should.eq(977);
      (await this.comm.balanceOf(owner)).toNumber().should.eq(1063);

      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );
      await this.tcd.distributeFee(200, { from: owner });
      (await this.tcd.getStake(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(163);

      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000);

      (await this.tcd.getOwnership(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(60);
      await this.tcd.unstake(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        30,
        {
          from: alice,
        },
      );

      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(1051);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1133);
    });
  });
  context('Withdraw delay', () => {
    beforeEach(async () => {
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

      this.comm = await CommunityToken.at(data1.receipt.logs[2].args.token);
      this.curve = await BondingCurve.at(
        data1.receipt.logs[2].args.bondingCurve,
      );
      this.params = await Parameters.at(data1.receipt.logs[2].args.params);
      await this.comm.addCapper(this.tcdFactory.address, { from: owner });
      const data2 = await this.tcdFactory.createTCD(
        web3.utils.fromAscii('data:'),
        this.curve.address,
        this.registry.address,
        this.params.address,
      );

      await this.params.setRaw(
        [
          web3.utils.fromAscii('data:min_provider_stake'),
          web3.utils.fromAscii('data:max_provider_count'),
          web3.utils.fromAscii('data:owner_revenue_pct'),
          web3.utils.fromAscii('data:query_price'),
          web3.utils.fromAscii('data:withdraw_delay'),
          web3.utils.fromAscii('data:data_aggregator'),
        ],
        [10, 3, '500000000000000000', 100, 3600, this.median.address],
        { from: owner },
      );
      this.tcd = await TCDBase.at(data2.receipt.logs[0].args.atcd);
      // alice buy 1000 SDD
      const calldata = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
      await this.band.transferAndCall(
        this.curve.address,
        1000000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      // bob buy 1000 SDD
      await this.band.transferAndCall(
        this.curve.address,
        3000000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      // carol buy 1000 SDD
      await this.band.transferAndCall(
        this.curve.address,
        5000000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: carol },
      );
      // owner buy 1000 SDD
      await this.band.transferAndCall(
        this.curve.address,
        7000000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: owner },
      );
      this.ownerSource = await MockDataSource.new('From owner', {
        from: owner,
      });
      await this.ownerSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        20,
        {
          from: owner,
        },
      );
      await this.tcd.register(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        40,
        {
          from: owner,
        },
      );
      this.aliceSource = await MockDataSource.new('From alice', {
        from: alice,
      });
      await this.aliceSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        20,
        {
          from: alice,
        },
      );
      await this.tcd.register(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        30,
        {
          from: alice,
        },
      );
      this.bobSource = await MockDataSource.new('From bob', { from: bob });
      await this.bobSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        10,
        {
          from: bob,
        },
      );
      await this.tcd.register(
        this.bobSource.address,
        '0x0000000000000000000000000000000000000000',
        20,
        {
          from: bob,
        },
      );
      this.carolSource = await MockDataSource.new('From carol', {
        from: carol,
      });
      await this.carolSource.setNumber(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        11,
        {
          from: carol,
        },
      );
      await this.tcd.register(
        this.carolSource.address,
        '0x0000000000000000000000000000000000000000',
        10,
        {
          from: carol,
        },
      );
    });
    it('should decrease stake and ownership when owner withdraw', async () => {
      (await this.tcd.getStake(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(30);
      (await this.tcd.getOwnership(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(30);
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
      await this.tcd.unstake(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        15,
        {
          from: alice,
        },
      );
      (await this.tcd.getStake(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(15);
      (await this.tcd.getOwnership(this.aliceSource.address, alice))
        .toNumber()
        .should.eq(15);
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
    });
    it('should revert if withdraw before time', async () => {
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
      await this.tcd.unstake(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        15,
        {
          from: alice,
        },
      );
      await shouldFail.reverting(this.tcd.unlockTokenFromReceipt(0));
    });
    it('should unlock withdraw if time passed', async () => {
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
      await this.tcd.unstake(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        15,
        {
          from: alice,
        },
      );
      await time.increase(time.duration.seconds(3600));
      await this.tcd.unlockTokenFromReceipt(0);
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(985);
    });
    it('should revert if withdraw out of range withdrawReceipts', async () => {
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
      await this.tcd.unstake(
        this.aliceSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        15,
        {
          from: alice,
        },
      );
      await time.increase(time.duration.seconds(3600));
      await shouldFail.throwing(this.tcd.unlockTokenFromReceipt(1));
      (await this.comm.unlockedBalanceOf(alice)).toNumber().should.eq(970);
    });
    it('should withdraw normally if he is not owner', async () => {
      await this.tcd.stake(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        40,
        { from: carol },
      );

      await this.tcd.query(
        '0x5000000000000000000000000000000000000000000000000000000000000000',
        {
          from: owner,
          value: 100,
        },
      );

      await this.tcd.distributeFee(100, { from: owner });
      await this.tcd.unstake(
        this.ownerSource.address,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        40,
        {
          from: carol,
        },
      );
      (await this.comm.unlockedBalanceOf(carol)).toNumber().should.eq(998);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1008);
    });
  });

  context('Mutiple TCD', () => {
    beforeEach(async () => {
      const data2 = await this.tcdFactory.createTCD(
        web3.utils.fromAscii('data:'),
        this.curve.address,
        this.registry.address,
        this.params.address,
      );
      await this.params.setRaw(
        [
          web3.utils.fromAscii('data:min_provider_stake'),
          web3.utils.fromAscii('data:max_provider_count'),
          web3.utils.fromAscii('data:owner_revenue_pct'),
          web3.utils.fromAscii('data:query_price'),
          web3.utils.fromAscii('data:withdraw_delay'),
          web3.utils.fromAscii('data:data_aggregator'),
        ],
        [10, 3, '500000000000000000', 100, 20, this.median.address],
        { from: owner },
      );

      this.tcd2 = await TCDBase.at(data2.receipt.logs[0].args.atcd);

      const data3 = await this.tcdFactory.createTCD(
        web3.utils.fromAscii('qd:'),
        this.curve.address,
        this.registry.address,
        this.params.address,
      );
      await this.params.setRaw(
        [
          web3.utils.fromAscii('qd:min_provider_stake'),
          web3.utils.fromAscii('qd:max_provider_count'),
          web3.utils.fromAscii('qd:owner_revenue_pct'),
          web3.utils.fromAscii('qd:query_price'),
          web3.utils.fromAscii('qd:withdraw_delay'),
        ],
        [1000, 5, '120000000000000000', 1000, 20],
        { from: owner },
      );
      this.tcd3 = await TCDBase.at(data3.receipt.logs[0].args.atcd);
    });

    it('Should set new parameter to data: prefix', async () => {
      (await this.params.getRaw(
        web3.utils.fromAscii('data:min_provider_stake'),
      ))
        .toNumber()
        .should.eq(10);
      (await this.params.getRaw(
        web3.utils.fromAscii('data:max_provider_count'),
      ))
        .toNumber()
        .should.eq(3);
      (await this.params.getRaw(web3.utils.fromAscii('data:owner_revenue_pct')))
        .toString()
        .should.eq('500000000000000000');
      (await this.params.getRaw(web3.utils.fromAscii('data:query_price')))
        .toNumber()
        .should.eq(100);
      (await this.params.getRaw(web3.utils.fromAscii('data:withdraw_delay')))
        .toNumber()
        .should.eq(20);
    });
    it('Should set new parameter to qd: prefix', async () => {
      (await this.params.getRaw(web3.utils.fromAscii('qd:min_provider_stake')))
        .toNumber()
        .should.eq(1000);
      (await this.params.getRaw(web3.utils.fromAscii('qd:max_provider_count')))
        .toNumber()
        .should.eq(5);
      (await this.params.getRaw(web3.utils.fromAscii('qd:owner_revenue_pct')))
        .toString()
        .should.eq('120000000000000000');
      (await this.params.getRaw(web3.utils.fromAscii('qd:query_price')))
        .toNumber()
        .should.eq(1000);
      (await this.params.getRaw(web3.utils.fromAscii('qd:withdraw_delay')))
        .toNumber()
        .should.eq(20);
    });
    it('Should stake with 2 TCD', async () => {
      await this.tcd.register(
        owner,
        '0x0000000000000000000000000000000000000000',
        600,
        { from: owner },
      );
      await shouldFail.reverting(
        this.tcd.register(
          alice,
          '0x0000000000000000000000000000000000000000',
          600,
          { from: owner },
        ),
      );
      await this.tcd2.register(
        bob,
        '0x0000000000000000000000000000000000000000',
        600,
        { from: owner },
      );
      await this.tcd3.register(
        alice,
        '0x0000000000000000000000000000000000000000',
        1000,
        { from: owner },
      );

      await shouldFail.reverting(this.comm.transfer(bob, 10, { from: owner }));
      await this.tcd3.unstake(
        alice,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        200,
        { from: owner },
      );
      (await this.comm.balanceOf(owner)).toNumber().should.eq(1000);
      (await this.comm.unlockedBalanceOf(owner)).toNumber().should.eq(0);
      await shouldFail.reverting(this.comm.transfer(bob, 10, { from: owner }));

      await time.increase(time.duration.seconds(20));
      await this.tcd3.unlockTokenFromReceipt(0);
      await shouldFail.reverting(this.comm.transfer(bob, 210, { from: owner }));
      await this.comm.transfer(bob, 10, { from: owner });
      (await this.comm.balanceOf(owner)).toNumber().should.eq(990);
      (await this.comm.unlockedBalanceOf(owner)).toNumber().should.eq(190);
    });
  });
});
