const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BandFactory = artifacts.require('BandFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const SimpleVoting = artifacts.require('SimpleVoting');
const StakeDelegatedDataSource = artifacts.require('StakeDelegatedDataSource');

require('chai').should();

contract('StakeDelegatedDataSource', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.factory = await BandFactory.deployed();
    this.band = await BandToken.new(100000000, owner, { from: owner });
    this.comm = await CommunityToken.new('TestSDD', 'SDD', 18, {
      from: owner,
    });
    this.voting = await SimpleVoting.new({ from: owner });
    this.params = await Parameters.new(
      this.comm.address,
      this.voting.address,
      [
        web3.utils.fromAscii('params:expiration_time'),
        web3.utils.fromAscii('params:support_required_pct'),
        web3.utils.fromAscii('params:min_participation_pct'),
        web3.utils.fromAscii('data:min_provider_stake'),
        web3.utils.fromAscii('data:active_data_source_count'),
      ],
      [60, '5', '5', '10', 3],
      { from: owner },
    );
    this.core = await CommunityCore.new(
      this.band.address,
      this.comm.address,
      this.params.address,
      [8, 1, 0, 2],
      {
        from: owner,
      },
    );
    this.curve = await BondingCurve.at(await this.core.bondingCurve());
    this.delegatedSource = await StakeDelegatedDataSource.new(
      this.core.address,
    );
    await this.delegatedSource.setExecDelegator(this.factory.address);
    await this.params.setExecDelegator(this.factory.address);
    await this.voting.setExecDelegator(this.factory.address);

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    await this.comm.transferOwnership(this.curve.address, { from: owner });
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
      10000000,
      '0x' + calldata4.slice(2, 10),
      '0x' + calldata4.slice(138),
      { from: owner },
    );

    await this.comm.approve(this.delegatedSource.address, '1000', {
      from: owner,
    });
    await this.comm.approve(this.delegatedSource.address, '1000', {
      from: alice,
    });
    await this.comm.approve(this.delegatedSource.address, '1000', {
      from: bob,
    });
    await this.comm.approve(this.delegatedSource.address, '1000', {
      from: carol,
    });
  });

  context('Registration', () => {
    it('check setting of delegatedSource', async () => {
      (await this.delegatedSource.token())
        .toString()
        .should.eq(this.comm.address);
      (await this.delegatedSource.params())
        .toString()
        .should.eq(this.params.address);
      (await this.delegatedSource.getActiveDataSourceCount())
        .toString()
        .should.eq('0');
      (await this.delegatedSource.getAllDataSourceCount())
        .toString()
        .should.eq('0');
    });
    it('should revert if stake less than min_provider_stake', async () => {
      (await this.delegatedSource.providers(owner)).currentStatus
        .toNumber()
        .should.eq(0);
      (await this.delegatedSource.providers(alice)).currentStatus
        .toNumber()
        .should.eq(0);
      (await this.delegatedSource.providers(bob)).currentStatus
        .toNumber()
        .should.eq(0);
      (await this.delegatedSource.providers(carol)).currentStatus
        .toNumber()
        .should.eq(0);

      await this.delegatedSource.register(owner, 40, owner, { from: owner });
      await this.delegatedSource.register(alice, 30, alice, { from: alice });
      await this.delegatedSource.register(bob, 20, bob, { from: bob });
      await shouldFail.reverting(
        this.delegatedSource.register(carol, 9, carol, { from: carol }),
      );
      await this.delegatedSource.register(carol, 10, carol, { from: carol });

      (await this.delegatedSource.getActiveDataSourceCount())
        .toString()
        .should.eq('3');

      (await this.delegatedSource.getAllDataSourceCount())
        .toString()
        .should.eq('4');

      (await this.comm.balanceOf(owner)).toNumber().should.eq(1000 - 40);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10);

      const ownerDataSource = await this.delegatedSource.providers(owner);
      const aliceDataSource = await this.delegatedSource.providers(alice);
      const bobDataSource = await this.delegatedSource.providers(bob);
      const carolDataSource = await this.delegatedSource.providers(carol);

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
      await this.delegatedSource.register(carol, 10, carol, { from: carol });
      await shouldFail.reverting(
        this.delegatedSource.register(carol, 10, carol, { from: carol }),
      );
    });
    it('should revert if not enough tokens', async () => {
      await shouldFail.reverting(
        this.delegatedSource.register(carol, 1001, carol, { from: carol }),
      );
    });
  });
  context('Kick', () => {
    beforeEach(async () => {
      await this.delegatedSource.register(alice, 30, alice, { from: alice });
      await this.delegatedSource.register(bob, 20, bob, { from: bob });
      await this.delegatedSource.register(carol, 10, carol, { from: carol });
    });
    it('dataSource should be automatically kicked if owner has already withdrawn', async () => {
      await this.delegatedSource.withdraw(alice, alice, { from: alice });
      await shouldFail.reverting(
        this.delegatedSource.kick(alice, { from: alice }),
      );
    });
    it('should be able to kick if owner stake < min_provider_stake', async () => {
      (await this.params.getZeroable(
        web3.utils.fromAscii('data:min_provider_stake'),
      ))
        .toNumber()
        .should.eq(10);
      // not enough to kick carol
      await shouldFail.reverting(
        this.delegatedSource.kick(carol, { from: alice }),
      );
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
      (await this.params.getZeroable(
        web3.utils.fromAscii('data:min_provider_stake'),
      ))
        .toNumber()
        .should.eq(20);
      // enough to kick carol
      this.delegatedSource.kick(carol, { from: alice });
      // not enough to kick bob
      await shouldFail.reverting(
        this.delegatedSource.kick(bob, { from: alice }),
      );
    });
  });
  context('Vote', () => {
    beforeEach(async () => {
      await this.delegatedSource.register(owner, 40, owner, { from: owner });
      await this.delegatedSource.register(alice, 30, alice, { from: alice });
      await this.delegatedSource.register(bob, 20, bob, { from: bob });
      await this.delegatedSource.register(carol, 10, carol, { from: carol });
    });
    it('should be able to vote', async () => {
      await this.delegatedSource.vote(alice, 10, owner, { from: alice });
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 10);
    });
    it('should be able to vote many times', async () => {
      await this.delegatedSource.vote(alice, 10, owner, { from: alice });
      await this.delegatedSource.vote(alice, 10, owner, { from: alice });
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 10 + 10);
    });
    it('should revert if not enough tokens', async () => {
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30);
      await shouldFail.reverting(
        this.delegatedSource.vote(alice, 1000, owner, { from: alice }),
      );
    });
    it('check dataSources', async () => {
      const numActiveSources = (await this.delegatedSource.getActiveDataSourceCount()).toNumber();
      const numAllSources = (await this.delegatedSource.getAllDataSourceCount()).toNumber();
      numActiveSources.should.eq(3);
      numAllSources.should.eq(4);
      const expectedSources = [owner, alice, bob, carol];
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
    });
    it('check dataSources after voting', async () => {
      const numAllSources = (await this.delegatedSource.getAllDataSourceCount()).toNumber();
      await this.delegatedSource.vote(alice, 15, carol, { from: alice });
      let expectedSources = [owner, alice, carol, bob];
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      await this.delegatedSource.vote(bob, 10, carol, { from: bob });
      expectedSources = [owner, carol, alice, bob];
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      await this.delegatedSource.vote(owner, 10, carol, { from: owner });
      expectedSources = [carol, owner, alice, bob];
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
    });
  });
  context('Withdraw', () => {
    beforeEach(async () => {
      await this.delegatedSource.register(owner, 40, owner, { from: owner });
      await this.delegatedSource.register(alice, 30, alice, { from: alice });
      await this.delegatedSource.register(bob, 20, bob, { from: bob });
      await this.delegatedSource.register(carol, 10, carol, { from: carol });
    });
    it('should be able to withdraw', async () => {
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10);

      await this.delegatedSource.vote(alice, 41, owner, { from: alice });
      await this.delegatedSource.vote(bob, 37, owner, { from: bob });
      await this.delegatedSource.vote(carol, 68, owner, { from: carol });

      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30 - 41);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20 - 37);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10 - 68);

      await this.delegatedSource.withdraw(bob, owner, { from: bob });
      await this.delegatedSource.withdraw(carol, owner, { from: carol });
      await this.delegatedSource.withdraw(alice, owner, { from: alice });

      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10);
    });
    it('dataSource should be ordered correctly after stake decrement', async () => {
      await this.delegatedSource.vote(alice, 50, owner, { from: alice });
      await this.delegatedSource.vote(alice, 50, alice, { from: alice });
      await this.delegatedSource.vote(alice, 50, bob, { from: alice });
      await this.delegatedSource.vote(alice, 50, carol, { from: alice });
      let numAllSources = (await this.delegatedSource.getAllDataSourceCount()).toNumber();
      numAllSources.should.eq(4);
      let expectedSources = [owner, alice, bob, carol];
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      expectedSources = [alice, bob, carol, owner];
      await this.delegatedSource.withdraw(alice, owner, { from: alice });
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      await this.delegatedSource.withdraw(alice, alice, { from: alice });
      numAllSources = (await this.delegatedSource.getAllDataSourceCount()).toNumber();
      numAllSources.should.eq(3);
      expectedSources = [bob, carol, owner];
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      expectedSources = [carol, owner, bob];
      await this.delegatedSource.withdraw(alice, bob, { from: alice });
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
      expectedSources = [owner, bob, carol];
      await this.delegatedSource.withdraw(alice, carol, { from: alice });
      for (let i = 0; i < numAllSources; i++) {
        (await this.delegatedSource.dataSources(i))
          .toString()
          .should.eq(expectedSources[i]);
      }
    });
    it('should be able to withdraw after owner has already kicked', async () => {
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10);

      await this.delegatedSource.vote(alice, 17, owner, { from: alice });
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17);
      await this.delegatedSource.vote(bob, 71, owner, { from: bob });
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71);
      await this.delegatedSource.vote(carol, 666, owner, { from: carol });
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666);

      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30 - 17);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20 - 71);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10 - 666);

      (await this.delegatedSource.providers(owner)).currentStatus
        .toNumber()
        .should.eq(1);

      // owner withdraw his/her stake, dataSource will automatically kicked
      await this.delegatedSource.withdraw(owner, owner, { from: owner });

      const dataSource = await this.delegatedSource.providers(owner);
      dataSource.currentStatus.toNumber().should.eq(2);
      dataSource.totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40);

      await this.delegatedSource.withdraw(bob, owner, { from: bob });
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 20);
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40 - 71);

      await this.delegatedSource.withdraw(carol, owner, { from: carol });
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000 - 10);
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(40 + 17 + 71 + 666 - 40 - 71 - 666);

      await this.delegatedSource.withdraw(alice, owner, { from: alice });
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 30);
      (await this.delegatedSource.providers(owner)).totalPublicOwnership
        .toNumber()
        .should.eq(0); // 40 + 17 + 71 + 666 - 40 - 71 - 666 - 17
    });
  });
});
