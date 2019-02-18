const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const {
  increase,
  duration,
} = require('openzeppelin-solidity/test/helpers/time');

const SimpleTCR = artifacts.require('SimpleTCR');
const BandToken = artifacts.require('BandToken');
const BandFactory = artifacts.require('BandFactory');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');

require('chai').should();

contract('SimpleTCR', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.factory = await BandFactory.deployed();
    this.band = await BandToken.new(1000000, owner, { from: owner });
    this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
      from: owner,
    });
    this.voting = await CommitRevealVoting.new({ from: owner });
    await this.voting.setExecDelegator(this.factory.address);
    this.params = await Parameters.new(
      this.comm.address,
      this.voting.address,
      [
        web3.utils.fromAscii('params:commit_time'),
        web3.utils.fromAscii('params:reveal_time'),
        web3.utils.fromAscii('params:support_required_pct'),
        web3.utils.fromAscii('params:min_participation_pct'),
        web3.utils.fromAscii('tcr:dispensation_percentage'),
        web3.utils.fromAscii('tcr:min_deposit'),
        web3.utils.fromAscii('tcr:apply_stage_length'),
      ],
      [60, 60, 50, 50, 30, 10, 300],
      { from: owner },
    );
    this.tcr = await SimpleTCR.new(
      web3.utils.fromAscii('tcr:'),
      this.comm.address,
      this.voting.address,
      this.params.address,
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
    await this.params.propose(
      owner,
      [web3.utils.fromAscii('core:tcr_contract')],
      [this.tcr.address],
      {
        from: owner,
      },
    );
    await increase(duration.days(30));
    await this.voting.resolvePoll(this.params.address, 1, { from: owner });
    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });
    await this.band.transfer(carol, 100000, { from: owner });
    await this.comm.transferOwnership(this.core.address, { from: owner });

    // alice buy 100 XCH
    const calldata1 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      alice,
      this.core.address,
      11000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );

    // bob buy 100 XCH
    const calldata2 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      bob,
      this.core.address,
      30000,
      '0x' + calldata2.slice(2, 10),
      '0x' + calldata2.slice(138),
      { from: bob },
    );

    // carol buy 100 XCH
    const calldata3 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      carol,
      this.core.address,
      50000,
      '0x' + calldata3.slice(2, 10),
      '0x' + calldata3.slice(138),
      { from: carol },
    );
  });

  context('Basic Functionality', () => {
    beforeEach(async () => {
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, web3.utils.soliditySha3('some entry'))
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.tcr.address,
        20, // minDeposit is 10
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });
    it('verify parameters of TCR', async () => {
      (await this.tcr.get(web3.utils.fromAscii('dispensation_percentage')))
        .toNumber()
        .should.eq(30);

      (await this.tcr.get(web3.utils.fromAscii('min_deposit')))
        .toNumber()
        .should.eq(10);

      (await this.tcr.get(web3.utils.fromAscii('apply_stage_length')))
        .toNumber()
        .should.eq(300);
    });
    it('Should should active after listAt', async () => {
      (await this.tcr.isEntryActive(web3.utils.soliditySha3('some entry')))
        .toString()
        .should.eq('false');
      await increase(duration.seconds(300));
      (await this.tcr.isEntryActive(web3.utils.soliditySha3('some entry')))
        .toString()
        .should.eq('true');
    });
    it('Should withdrawable if nothing goes wrong', async () => {
      const balanceOfAlice = (await this.comm.balanceOf(alice)).toNumber();
      const withdrawAmount = 10;
      await this.tcr.withdraw(
        alice,
        web3.utils.soliditySha3('some entry'),
        withdrawAmount,
        { from: alice },
      );
      (await this.comm.balanceOf(alice))
        .toNumber()
        .should.eq(balanceOfAlice + withdrawAmount);
    });
    it('Should not withdrawable if not proposer', async () => {
      await reverting(
        this.tcr.withdraw(bob, web3.utils.soliditySha3('some entry'), 10, {
          from: bob,
        }),
      );
    });
    it('Should not withdrawable if not withdrawableDeposit < min_deposit', async () => {
      await reverting(
        this.tcr.withdraw(alice, web3.utils.soliditySha3('some entry'), 11, {
          from: alice,
        }),
      );
    });
    it('Should exitable if nothing goes wrong', async () => {
      const balanceOfAlice = (await this.comm.balanceOf(alice)).toNumber();
      await this.tcr.exit(alice, web3.utils.soliditySha3('some entry'), {
        from: alice,
      });
      (await this.comm.balanceOf(alice))
        .toNumber()
        .should.eq(balanceOfAlice + 20);
    });
  });

  context('Challenge Functionality', () => {
    beforeEach(async () => {
      // commit
    });
    it('2-1', async () => {
      await increase(duration.seconds(60));
      // reveal vote with correct params
    });
    it('2-2', async () => {
      await increase(duration.seconds(60));
      // reveal vote with wrong salt
    });
  });
});
