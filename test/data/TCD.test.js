const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandSimpleExchange = artifacts.require('BandSimpleExchange');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const SimpleVoting = artifacts.require('SimpleVoting');
const TCD = artifacts.require('TCD');
const TrustedDataSource = artifacts.require('TrustedDataSource');

require('chai').should();

contract('TCD', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.factory = await BandRegistry.deployed();
    this.band = await BandToken.at(await this.factory.band());
    await this.band.transfer(_, await this.band.balanceOf(owner), {
      from: owner,
    });
    await this.band.transfer(_, await this.band.balanceOf(alice), {
      from: alice,
    });
    await this.band.transfer(_, await this.band.balanceOf(bob), {
      from: bob,
    });
    await this.band.transfer(owner, 100000000, { from: _ });
    const data1 = await this.factory.createCommunity(
      'CoinHatcher',
      'CHT',
      [1],
      '0',
      '60',
      '5',
      '5',
    );
    this.core = await CommunityCore.at(data1.receipt.logs[0].args.community);
    this.comm = await CommunityToken.at(await this.core.token());
    this.curve = await BondingCurve.at(await this.core.bondingCurve());
    this.exchange = await BandSimpleExchange.at(await this.factory.exchange());
    this.params = await Parameters.at(await this.core.params());
    this.voting = await SimpleVoting.at(await this.factory.simpleVoting());
    const data2 = await this.core.createTCD(10, 3, '500000000000000000', 100);
    this.tcd = await TCD.at(data2.receipt.logs[0].args.tcd);

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    // alice buy 1000 SDD
    const calldata1 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      alice,
      this.curve.address,
      1000000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );
    // bob buy 1000 SDD
    const calldata2 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      bob,
      this.curve.address,
      3000000,
      '0x' + calldata2.slice(2, 10),
      '0x' + calldata2.slice(138),
      { from: bob },
    );
    // carol buy 1000 SDD
    const calldata3 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      carol,
      this.curve.address,
      5000000,
      '0x' + calldata3.slice(2, 10),
      '0x' + calldata3.slice(138),
      { from: carol },
    );
    // owner buy 1000 SDD
    const calldata4 = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      owner,
      this.curve.address,
      7000000,
      '0x' + calldata4.slice(2, 10),
      '0x' + calldata4.slice(138),
      { from: owner },
    );

    await this.band.approve(this.exchange.address, '10000000', {
      from: _,
    });

    await this.exchange.addBand(_, 10000000, { from: _ });
    await this.exchange.setExchangeRate('1000000000000000000000', { from: _ });

    await this.comm.approve(this.tcd.address, '1000', {
      from: owner,
    });
    await this.comm.approve(this.tcd.address, '1000', {
      from: alice,
    });
    await this.comm.approve(this.tcd.address, '1000', {
      from: bob,
    });
    await this.comm.approve(this.tcd.address, '1000', {
      from: carol,
    });
  });

  context('Registration', () => {
    it('check setting of tcd', async () => {
      (await this.tcd.token()).toString().should.eq(this.comm.address);
      (await this.tcd.params()).toString().should.eq(this.params.address);
      (await this.tcd.getActiveDataSourceCount()).toString().should.eq('0');
      (await this.tcd.getAllDataSourceCount()).toString().should.eq('0');
    });
    it('should revert if stake less than min_provider_stake', async () => {
      (await this.tcd.providers(owner)).currentStatus.toNumber().should.eq(0);
      (await this.tcd.providers(alice)).currentStatus.toNumber().should.eq(0);
      (await this.tcd.providers(bob)).currentStatus.toNumber().should.eq(0);
      (await this.tcd.providers(carol)).currentStatus.toNumber().should.eq(0);

      await this.tcd.register(owner, 40, owner, { from: owner });
      await this.tcd.register(alice, 30, alice, { from: alice });
      await this.tcd.register(bob, 20, bob, { from: bob });
      await shouldFail.reverting(
        this.tcd.register(carol, 9, carol, { from: carol }),
      );
      await this.tcd.register(carol, 10, carol, { from: carol });

      (await this.tcd.getActiveDataSourceCount()).toString().should.eq('3');

      (await this.tcd.getAllDataSourceCount()).toString().should.eq('4');

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

      const ownerDataSource = await this.tcd.providers(owner);
      const aliceDataSource = await this.tcd.providers(alice);
      const bobDataSource = await this.tcd.providers(bob);
      const carolDataSource = await this.tcd.providers(carol);

      ownerDataSource.currentStatus.toNumber().should.eq(1);
      aliceDataSource.currentStatus.toNumber().should.eq(1);
      bobDataSource.currentStatus.toNumber().should.eq(1);
      carolDataSource.currentStatus.toNumber().should.eq(1);

      ownerDataSource.stake.toNumber().should.eq(40);
      aliceDataSource.stake.toNumber().should.eq(30);
      bobDataSource.stake.toNumber().should.eq(20);
      carolDataSource.stake.toNumber().should.eq(10);

      ownerDataSource.totalPublicOwnership.toNumber().should.eq(40);
      aliceDataSource.totalPublicOwnership.toNumber().should.eq(30);
      bobDataSource.totalPublicOwnership.toNumber().should.eq(20);
      carolDataSource.totalPublicOwnership.toNumber().should.eq(10);

      ownerDataSource.owner.toString().should.eq(owner);
      aliceDataSource.owner.toString().should.eq(alice);
      bobDataSource.owner.toString().should.eq(bob);
      carolDataSource.owner.toString().should.eq(carol);
    });
    it('should revert if try to register again', async () => {
      await this.tcd.register(carol, 10, carol, { from: carol });
      await shouldFail.reverting(
        this.tcd.register(carol, 10, carol, { from: carol }),
      );
    });
    it('should revert if not enough tokens', async () => {
      await shouldFail.reverting(
        this.tcd.register(carol, 1001, carol, { from: carol }),
      );
    });
  });
  context('Kick', () => {
    beforeEach(async () => {
      await this.tcd.register(alice, 30, alice, { from: alice });
      await this.tcd.register(bob, 20, bob, { from: bob });
      await this.tcd.register(carol, 10, carol, { from: carol });
    });
    it('dataSource should be automatically kicked if owner has already withdrawn', async () => {
      await this.tcd.withdraw(alice, 30, alice, { from: alice });
      await shouldFail.reverting(this.tcd.kick(alice, { from: alice }));
    });
    it('should be able to kick if owner stake < min_provider_stake', async () => {
      (await this.params.get(web3.utils.fromAscii('data:min_provider_stake')))
        .toNumber()
        .should.eq(10);
      // not enough to kick carol
      await shouldFail.reverting(this.tcd.kick(carol, { from: alice }));
      await this.params.propose(
        alice,
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('data:min_provider_stake')],
        [20],
        {
          from: alice,
        },
      );
      // castVote
      await this.voting.castVote(alice, this.params.address, 1, 50, 0, {
        from: alice,
      });
      await time.increase(time.duration.seconds(60));
      // resolvePoll
      await this.voting.resolvePoll(this.params.address, 1, { from: alice });
      (await this.params.get(web3.utils.fromAscii('data:min_provider_stake')))
        .toNumber()
        .should.eq(20);
      // enough to kick carol
      this.tcd.kick(carol, { from: alice });
      // not enough to kick bob
      await shouldFail.reverting(this.tcd.kick(bob, { from: alice }));
    });
  });
  context('Vote', () => {
    beforeEach(async () => {
      await this.tcd.register(owner, 40, owner, { from: owner });
      await this.tcd.register(alice, 30, alice, { from: alice });
      await this.tcd.register(bob, 20, bob, { from: bob });
      await this.tcd.register(carol, 10, carol, { from: carol });
    });
    it('should be able to vote', async () => {
      await this.tcd.vote(alice, 10, owner, { from: alice });
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 10);
    });
    it('should be able to vote many times', async () => {
      await this.tcd.vote(alice, 10, owner, { from: alice });
      await this.tcd.vote(alice, 10, owner, { from: alice });
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 10 + 10);
    });
    it('should revert if not enough tokens', async () => {
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      await shouldFail.reverting(
        this.tcd.vote(alice, 1000, owner, { from: alice }),
      );
    });
    it('check dataSources', async () => {
      const numActiveSources = (await this.tcd.getActiveDataSourceCount()).toNumber();
      const numAllSources = (await this.tcd.getAllDataSourceCount()).toNumber();
      numActiveSources.should.eq(3);
      numAllSources.should.eq(4);
      const expectedSources = [owner, alice, bob, carol];
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
    });
    it('check dataSources after voting', async () => {
      const numAllSources = (await this.tcd.getAllDataSourceCount()).toNumber();
      await this.tcd.vote(alice, 15, carol, { from: alice });
      let expectedSources = [owner, alice, carol, bob];
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      await this.tcd.vote(bob, 10, carol, { from: bob });
      expectedSources = [owner, carol, alice, bob];
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      await this.tcd.vote(owner, 10, carol, { from: owner });
      expectedSources = [carol, owner, alice, bob];
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
    });
  });
  context('Withdraw', () => {
    beforeEach(async () => {
      await this.tcd.register(owner, 40, owner, { from: owner });
      await this.tcd.register(alice, 30, alice, { from: alice });
      await this.tcd.register(bob, 20, bob, { from: bob });
      await this.tcd.register(carol, 10, carol, { from: carol });
    });
    it('should be able to withdraw', async () => {
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);

      await this.tcd.vote(alice, 41, owner, { from: alice });
      await this.tcd.vote(bob, 37, owner, { from: bob });
      await this.tcd.vote(carol, 68, owner, { from: carol });

      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30 - 41);
      (await this.comm.unlockedBalanceOf(bob))
        .toNumber()
        .should.eq(1000 - 20 - 37);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10 - 68);

      await this.tcd.withdraw(bob, 37, owner, { from: bob });
      await this.tcd.withdraw(carol, 68, owner, { from: carol });
      await this.tcd.withdraw(alice, 41, owner, { from: alice });

      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);
    });
    it('dataSource should be ordered correctly after stake decrement', async () => {
      await this.tcd.vote(alice, 50, owner, { from: alice });
      await this.tcd.vote(alice, 50, alice, { from: alice });
      await this.tcd.vote(alice, 50, bob, { from: alice });
      await this.tcd.vote(alice, 50, carol, { from: alice });
      let numAllSources = (await this.tcd.getAllDataSourceCount()).toNumber();
      numAllSources.should.eq(4);
      let expectedSources = [owner, alice, bob, carol];
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      expectedSources = [alice, bob, carol, owner];
      await this.tcd.withdraw(alice, 50, owner, { from: alice });
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }

      await this.tcd.withdraw(alice, 80, alice, { from: alice });
      numAllSources = (await this.tcd.getAllDataSourceCount()).toNumber();
      numAllSources.should.eq(3);
      expectedSources = [bob, carol, owner];
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      expectedSources = [carol, owner, bob];
      await this.tcd.withdraw(alice, 50, bob, { from: alice });
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      expectedSources = [owner, bob, carol];
      await this.tcd.withdraw(alice, 50, carol, { from: alice });
      for (let i = 0; i < numAllSources; i++) {
        (await this.tcd.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
    });
    it('should be able to withdraw after owner has already kicked', async () => {
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);

      await this.tcd.vote(alice, 17, owner, { from: alice });
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17);
      await this.tcd.vote(bob, 71, owner, { from: bob });
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71);
      await this.tcd.vote(carol, 666, owner, { from: carol });
      (await this.tcd.providers(owner)).totalPublicOwnership
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

      (await this.tcd.providers(owner)).currentStatus.toNumber().should.eq(1);

      // owner withdraw his/her stake, dataSource will automatically kicked
      await this.tcd.withdraw(owner, 40, owner, { from: owner });

      const dataSource = await this.tcd.providers(owner);
      dataSource.currentStatus.toNumber().should.eq(2);
      dataSource.totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40);

      await this.tcd.withdraw(bob, 71, owner, { from: bob });
      (await this.comm.unlockedBalanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40 - 71);

      await this.tcd.withdraw(carol, 666, owner, { from: carol });
      (await this.comm.unlockedBalanceOf(carol))
        .toNumber()
        .should.eq(1000 - 10);
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40 - 71 - 666);

      await this.tcd.withdraw(alice, 17, owner, { from: alice });
      (await this.comm.unlockedBalanceOf(alice))
        .toNumber()
        .should.eq(1000 - 30);
      (await this.tcd.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(0); // 40 + 17 + 71 + 666 - 40 - 71 - 666 - 17
    });
  });
  context('Get', () => {
    beforeEach(async () => {
      this.ownerSource = await TrustedDataSource.new('From owner', {
        from: owner,
      });
      await this.ownerSource.setNumber(web3.utils.fromAscii('P'), 20, {
        from: owner,
      });
      await this.tcd.register(owner, 40, this.ownerSource.address, {
        from: owner,
      });
      this.aliceSource = await TrustedDataSource.new('From alice', {
        from: alice,
      });
      await this.aliceSource.setNumber(web3.utils.fromAscii('P'), 20, {
        from: alice,
      });
      await this.tcd.register(alice, 30, this.aliceSource.address, {
        from: alice,
      });
      this.bobSource = await TrustedDataSource.new('From bob', { from: bob });
      await this.bobSource.setNumber(web3.utils.fromAscii('P'), 10, {
        from: bob,
      });
      await this.tcd.register(bob, 20, this.bobSource.address, { from: bob });
      this.carolSource = await TrustedDataSource.new('From carol', {
        from: carol,
      });
      await this.carolSource.setNumber(web3.utils.fromAscii('P'), 11, {
        from: carol,
      });
      await this.tcd.register(carol, 10, this.carolSource.address, {
        from: carol,
      });
    });
    it('should revert if value less than query', async () => {
      shouldFail.reverting(this.tcd.getAsNumber(web3.utils.fromAscii('P')));
    });

    it('should return value and get eth when date retrieved', async () => {
      await this.tcd.getAsNumber(web3.utils.fromAscii('P'), {
        from: owner,
        value: 100,
      });
      (await web3.eth.getBalance(this.tcd.address)).should.eq('100');
    });

    it('should distribute value when someone call', async () => {
      // Carol join owner
      await this.tcd.vote(carol, 10, this.ownerSource.address, { from: carol });
      await this.tcd.getAsNumber(web3.utils.fromAscii('P'), {
        from: owner,
        value: 100,
      });

      await this.tcd.distributeFee(100, { from: owner });

      (await this.comm.unlockedBalanceOf(owner)).toString().should.eq('960');
      (await this.comm.unlockedBalanceOf(alice)).toString().should.eq('970');
      (await this.comm.unlockedBalanceOf(bob)).toString().should.eq('980');
      (await this.comm.unlockedBalanceOf(carol)).toString().should.eq('980');
      (await this.tcd.getStakeInProvider(this.aliceSource.address, alice))
        .toString()
        .should.eq('63');

      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);

      (await this.tcd.getStakeInProvider(this.ownerSource.address, carol))
        .toString()
        .should.eq('13');

      await this.tcd.withdraw(carol, 10, this.ownerSource.address, {
        from: carol,
      });

      (await this.comm.balanceOf(carol)).toNumber().should.eq(1003);
      (await this.comm.unlockedBalanceOf(carol)).toNumber().should.eq(993);

      await this.tcd.getAsNumber(web3.utils.fromAscii('P'), {
        from: owner,
        value: 101,
      });

      await this.tcd.distributeFee(100, { from: owner });

      (await this.tcd.getStakeInProvider(this.aliceSource.address, alice))
        .toString()
        .should.eq('96');
      (await this.tcd.getStakeInProvider(this.ownerSource.address, owner))
        .toString()
        .should.eq('103');
      await this.tcd.withdraw(owner, 10, this.ownerSource.address, {
        from: owner,
      });

      (await this.comm.unlockedBalanceOf(owner)).toString().should.eq('977');
      (await this.comm.balanceOf(owner)).toString().should.eq('1063');

      await this.tcd.getAsNumber(web3.utils.fromAscii('P'), {
        from: owner,
        value: 100,
      });
      await this.tcd.getAsNumber(web3.utils.fromAscii('P'), {
        from: owner,
        value: 100,
      });
      await this.tcd.distributeFee(200, { from: owner });
      (await this.tcd.getStakeInProvider(this.aliceSource.address, alice))
        .toString()
        .should.eq('163');

      (await this.comm.unlockedBalanceOf(alice)).toString().should.eq('970');
      (await this.comm.balanceOf(alice)).toString().should.eq('1000');

      (await this.tcd.getProviderPublicOwnership(
        this.aliceSource.address,
        alice,
      ))
        .toNumber()
        .should.eq(60);
      await this.tcd.withdraw(alice, 30, this.aliceSource.address, {
        from: alice,
      });

      (await this.comm.unlockedBalanceOf(alice)).toString().should.eq('1051');
      (await this.comm.balanceOf(alice)).toString().should.eq('1133');
    });
  });
});
