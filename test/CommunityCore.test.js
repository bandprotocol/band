const { shouldFail, time } = require('openzeppelin-test-helpers');
const { Merkle } = require('../lib/merkle');

const BandToken = artifacts.require('BandToken');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BandFactory = artifacts.require('BandFactory');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');

require('chai').should();

contract('CommunityCore', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.factory = await BandFactory.deployed();
    this.band = await BandToken.new(1000000, owner, { from: owner });
    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });
    this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
      from: owner,
    });
    this.voting = await CommitRevealVoting.new({ from: owner });
    this.params = await Parameters.new(
      this.comm.address,
      this.voting.address,
      [
        web3.utils.fromAscii('params:commit_time'),
        web3.utils.fromAscii('params:reveal_time'),
        web3.utils.fromAscii('params:support_required_pct'),
        web3.utils.fromAscii('params:min_participation_pct'),
      ],
      [60, 60, 80, 10],
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
    await this.comm.transferOwnership(this.curve.address, { from: owner });
    // Alice buys 100 tokens to get voting power. Will sell it back soon.
    const buyCalldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      alice,
      this.curve.address,
      100000,
      '0x' + buyCalldata.slice(2, 10),
      '0x' + buyCalldata.slice(138),
      { from: alice },
    );

    // Alice sells 100 tokens back
    const sellCalldata = this.curve.contract.methods
      .sell(_, 0, 100)
      .encodeABI();
    await this.comm.transferAndCall(
      alice,
      this.curve.address,
      100,
      '0x' + sellCalldata.slice(2, 10),
      '0x' + sellCalldata.slice(138),
      { from: alice },
    );
  });

  context('Checking buy and sell community tokens with f(s) = x ^ 2', () => {
    it('should not allow buying directly without approval', async () => {
      await shouldFail.reverting(
        this.curve.buy(alice, 100, 11000, { from: alice }),
      );
    });

    it("should not allow buying if buy doesn't have enough band", async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await shouldFail.reverting(
        this.band.transferAndCall(
          alice,
          this.curve.address,
          110000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should not allow buying if price limit does not pass', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await shouldFail.reverting(
        this.band.transferAndCall(
          alice,
          this.curve.address,
          9000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should allow buying tokens if calling via band tokens', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        11000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('90000');
      (await this.comm.balanceOf(alice)).toString().should.eq('100');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should time.increase price for subsequent purchases', async () => {
      const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.band.transferAndCall(
        bob,
        this.curve.address,
        11000,
        '0x' + calldata2.slice(2, 10),
        '0x' + calldata2.slice(138),
        { from: bob },
      );
      (await this.band.balanceOf(bob)).toString().should.eq('97900');
      (await this.comm.balanceOf(bob)).toString().should.eq('10');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should allow selling with correct price drop', async () => {
      const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.curve.contract.methods
        .sell(_, 0, 10000)
        .encodeABI();
      await shouldFail.reverting(
        this.comm.transferAndCall(
          alice,
          this.curve.address,
          10,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: alice },
        ),
      );
      const calldata3 = this.curve.contract.methods
        .sell(_, 0, 1000)
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.curve.address,
        10,
        '0x' + calldata3.slice(2, 10),
        '0x' + calldata3.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('91900');
      (await this.comm.balanceOf(alice)).toString().should.eq('90');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should be able to sell/transferAndCall feelessly', async () => {
      await this.comm.setExecDelegator(this.factory.address);

      const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.curve.contract.methods
        .sell(_, 0, 10000)
        .encodeABI();
      await shouldFail.reverting(
        this.comm.transferAndCall(
          alice,
          this.curve.address,
          10,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: alice },
        ),
      );

      const calldata3 = this.curve.contract.methods
        .sell(_, 0, 1000)
        .encodeABI();
      const calldata4 = await this.comm.contract.methods
        .transferAndCall(
          alice,
          this.curve.address,
          10,
          '0x' + calldata3.slice(2, 10),
          '0x' + calldata3.slice(138),
        )
        .encodeABI();

      const nonce = (await this.factory.execNonces(alice)).toNumber();
      const dataNoFuncSig = '0x' + calldata4.slice(10 + 64);
      const sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce, dataNoFuncSig),
        alice,
      );

      await this.factory.sendDelegatedExecution(
        alice,
        this.comm.address,
        '0x' + calldata4.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      );

      (await this.band.balanceOf(alice)).toString().should.eq('91900');
      (await this.comm.balanceOf(alice)).toString().should.eq('90');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });
  });

  context('Checking auto-inflation feature', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });

    it('should inflate 10% per month properly after a purchase', async () => {
      // 10% per month inflation
      await this.params.propose(
        owner,
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('curve:inflation_rate')],
        [38580246914],
        {
          from: owner,
        },
      );
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(100, 0, 42),
        '0x00',
        100,
        0,
        { from: alice },
      );
      await time.increase(time.duration.seconds(60));
      await this.voting.revealVote(alice, this.params.address, 1, 100, 0, 42, {
        from: alice,
      });
      await time.increase(time.duration.days(30) - time.duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 1, { from: alice });
      const calldata = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('88100');
      (await this.comm.balanceOf(alice)).toString().should.eq('110');
      (await this.comm.balanceOf(this.core.address)).toString().should.eq('10');
      (await this.comm.totalSupply()).toString().should.eq('120');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('826446280991735537');
    });

    it('should inflate 10% per hour properly after a sale', async () => {
      // 10% per hour inflation
      await this.params.propose(
        owner,
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('curve:inflation_rate')],
        [27777777777778],
        {
          from: owner,
        },
      );

      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(100, 0, 42),
        '0x00',
        100,
        0,
        { from: alice },
      );
      await time.increase(time.duration.seconds(60));
      await this.voting.revealVote(alice, this.params.address, 1, 100, 0, 42, {
        from: alice,
      });
      await time.increase(time.duration.hours(1) - time.duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 1, { from: alice });
      // First sale
      await time.increase(time.duration.hours(9));
      const calldata = this.curve.contract.methods.sell(_, 0, 0).encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.curve.address,
        10,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('90975');
      (await this.comm.balanceOf(alice)).toString().should.eq('90');
      (await this.comm.balanceOf(this.core.address))
        .toString()
        .should.eq('100');
      (await this.comm.totalSupply()).toString().should.eq('190');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('250000000000000000');
      // Second sale
      await time.increase(time.duration.hours(10));
      await this.comm.transferAndCall(
        alice,
        this.curve.address,
        10,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('91444');
      (await this.comm.balanceOf(alice)).toString().should.eq('80');
      (await this.comm.balanceOf(this.core.address))
        .toString()
        .should.eq('290');
      (await this.comm.totalSupply()).toString().should.eq('370');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('62500000000000000');
    });
  });

  context('Checking liquidity fee', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      // 20% liquidity fee
      await this.params.propose(
        alice,
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('curve:liquidity_fee')],
        [200000000000],
        {
          from: alice,
        },
      );

      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(100, 0, 42),
        '0x00',
        100,
        0,
        { from: alice },
      );
      await time.increase(time.duration.seconds(60));
      await this.voting.revealVote(alice, this.params.address, 1, 100, 0, 42, {
        from: alice,
      });
      await time.increase(time.duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 1, { from: alice });
    });

    it('should impose commission on purchases', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 15).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('86775');
      (await this.comm.balanceOf(alice)).toString().should.eq('115');
      (await this.comm.balanceOf(this.curve.address)).toString().should.eq('0');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should not impose commission on sales', async () => {
      const calldata = this.curve.contract.methods.sell(_, 0, 1000).encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.curve.address,
        15,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('92775');
      (await this.comm.balanceOf(alice)).toString().should.eq('85');
      (await this.comm.balanceOf(this.curve.address)).toString().should.eq('0');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });
  });

  context('Checking deflation feature', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        owner,
        this.curve.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: owner },
      );
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      await this.comm.approve(this.curve.address, 100, { from: owner });
    });

    it('should not allow deflate more than what they own', async () => {
      await shouldFail.reverting(
        this.curve.deflate(owner, 110, { from: owner }),
      );
    });

    it('should allow anyone to deflate', async () => {
      await this.curve.deflate(owner, 10, { from: owner });
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1108033240997229916');
    });
  });
});
