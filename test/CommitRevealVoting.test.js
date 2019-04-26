const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');

require('chai').should();

contract('CommitRevealVoting', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.factory = await BandRegistry.deployed();
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
      ],
      [60, 60, '800000000000000000', '600000000000000000'],
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
    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });
    await this.band.transfer(carol, 100000, { from: owner });
    await this.comm.transferOwnership(this.curve.address, { from: owner });

    // alice buy 100 XCH
    const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      alice,
      this.curve.address,
      11000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );

    // bob buy 100 XCH
    const calldata2 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      bob,
      this.curve.address,
      30000,
      '0x' + calldata2.slice(2, 10),
      '0x' + calldata2.slice(138),
      { from: bob },
    );

    // propose a new proposal
    await this.params.propose(
      owner,
      '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
      [web3.utils.fromAscii('example_proposal')],
      [1000000],
      {
        from: owner,
      },
    );
  });

  context('commit : should revert if commit with wrong parameters', () => {
    it('correct params for a commit, getPollUserState should be Committed', async () => {
      // commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: alice },
      );
      await this.voting.commitVote(
        bob,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: bob },
      );
      (await this.voting.getPollUserState(this.params.address, 1, alice))
        .toString()
        .should.eq('1');
      (await this.voting.getPollUserState(this.params.address, 1, bob))
        .toString()
        .should.eq('1');
    });
    it('should revert (totalWeight == 0), getPollUserState should be Invalid', async () => {
      // commit
      await shouldFail.reverting(
        this.voting.commitVote(
          alice,
          this.params.address,
          1,
          web3.utils.soliditySha3(0, 0, 42),
          '0x00',
          0,
          0,
          { from: alice },
        ),
      );
      await shouldFail.reverting(
        this.voting.commitVote(
          bob,
          this.params.address,
          1,
          web3.utils.soliditySha3(30, 30, 42),
          '0x00',
          0,
          0,
          { from: bob },
        ),
      );
      (await this.voting.getPollUserState(this.params.address, 1, alice))
        .toString()
        .should.eq('0');
      (await this.voting.getPollUserState(this.params.address, 1, bob))
        .toString()
        .should.eq('0');
    });
    it('should revert (totalWeight > voting power), getPollUserState should be Invalid', async () => {
      // commit
      await shouldFail.reverting(
        this.voting.commitVote(
          alice,
          this.params.address,
          1,
          web3.utils.soliditySha3(200, 0, 42),
          '0x00',
          200,
          0,
          { from: alice },
        ),
      );
      await shouldFail.reverting(
        this.voting.commitVote(
          bob,
          this.params.address,
          1,
          web3.utils.soliditySha3(60, 0, 42),
          '0x00',
          110,
          0,
          { from: bob },
        ),
      );
      (await this.voting.getPollUserState(this.params.address, 1, alice))
        .toString()
        .should.eq('0');
      (await this.voting.getPollUserState(this.params.address, 1, bob))
        .toString()
        .should.eq('0');
    });

    it('should use delegated execution to commitVote feelessly', async () => {
      // commit
      const data = await this.voting.contract.methods
        .commitVote(
          alice,
          this.params.address,
          1,
          web3.utils.soliditySha3(60, 0, 42),
          '0x00',
          60,
          0,
        )
        .encodeABI();
      const nonce = 0;
      const dataNoFuncSig = '0x' + data.slice(10 + 64);
      const sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce, dataNoFuncSig),
        alice,
      );
      await this.factory.sendDelegatedExecution(
        alice,
        this.voting.address,
        '0x' + data.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      );
      (await this.voting.getPollUserState(this.params.address, 1, alice))
        .toString()
        .should.eq('1');
    });
  });

  context('try to commit again after first commit', () => {
    beforeEach(async () => {
      // first commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: alice },
      );
      await this.voting.commitVote(
        bob,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: bob },
      );
    });
    it('correct params', async () => {
      // commit again
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(69, 0, 22),
        web3.utils.soliditySha3(60, 0, 42),
        69,
        60,
        { from: alice },
      );
      await this.voting.commitVote(
        bob,
        this.params.address,
        1,
        web3.utils.soliditySha3(39, 0, 48),
        web3.utils.soliditySha3(60, 0, 42),
        39,
        60,
        { from: bob },
      );
    });
    it('should revert, wrong params', async () => {
      // commit again
      await shouldFail.reverting(
        this.voting.commitVote(
          alice,
          this.params.address,
          1,
          web3.utils.soliditySha3(60, 0, 42),
          '0x00',
          60,
          0,
          { from: alice },
        ),
      );
      await shouldFail.reverting(
        this.voting.commitVote(
          bob,
          this.params.address,
          1,
          web3.utils.soliditySha3(60, 0, 42),
          web3.utils.soliditySha3(99, 99, 99),
          60,
          99,
          { from: bob },
        ),
      );
    });
  });

  context('reveal : should revert if reveal with wrong parameters', () => {
    beforeEach(async () => {
      // commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: alice },
      );
      await this.voting.commitVote(
        bob,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: bob },
      );
    });
    it('correct params, getPollUserState should be Revealed', async () => {
      await time.increase(time.duration.seconds(60));
      // reveal vote with correct params
      await this.voting.revealVote(alice, this.params.address, 1, 60, 0, 42, {
        from: alice,
      });
      await this.voting.revealVote(bob, this.params.address, 1, 60, 0, 42, {
        from: bob,
      });
      (await this.voting.getPollUserState(this.params.address, 1, alice))
        .toString()
        .should.eq('2');
      (await this.voting.getPollUserState(this.params.address, 1, bob))
        .toString()
        .should.eq('2');
    });
    it('should revert, wrong salt', async () => {
      await time.increase(time.duration.seconds(60));
      // reveal vote with wrong salt
      await shouldFail.reverting(
        this.voting.revealVote(alice, this.params.address, 1, 60, 0, 43, {
          from: alice,
        }),
      );
      await shouldFail.reverting(
        this.voting.revealVote(bob, this.params.address, 1, 60, 0, 43, {
          from: bob,
        }),
      );
    });
    it('should revert, wrong total weight(yes+no)', async () => {
      await time.increase(time.duration.seconds(60));
      // reveal vote with wrong salt
      await shouldFail.reverting(
        this.voting.revealVote(alice, this.params.address, 1, 60, 10, 42, {
          from: alice,
        }),
      );
      await shouldFail.reverting(
        this.voting.revealVote(bob, this.params.address, 1, 50, 0, 42, {
          from: bob,
        }),
      );
    });
    it('should revert, correct total weight(yes+no) but wrong yes/no weight', async () => {
      await time.increase(time.duration.seconds(60));
      // reveal vote with wrong yes/no weight
      await shouldFail.reverting(
        this.voting.revealVote(alice, this.params.address, 1, 0, 60, 42, {
          from: alice,
        }),
      );
      await shouldFail.reverting(
        this.voting.revealVote(bob, this.params.address, 1, 30, 30, 42, {
          from: bob,
        }),
      );
    });
    it('should revert, try to reveal after reveal time has end', async () => {
      await time.increase(time.duration.seconds(120));
      await shouldFail.reverting(
        this.voting.revealVote(alice, this.params.address, 1, 60, 0, 42, {
          from: alice,
        }),
      );
      await shouldFail.reverting(
        this.voting.revealVote(bob, this.params.address, 1, 60, 0, 42, {
          from: bob,
        }),
      );
    });
  });

  context('resolvePoll : should revert if condition not met', () => {
    it('correctly resolve, enough voting power, pollState should be Yes', async () => {
      // commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: alice },
      );
      await this.voting.commitVote(
        bob,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: bob },
      );
      await time.increase(time.duration.seconds(60));
      // reveal vote with correct params
      await this.voting.revealVote(alice, this.params.address, 1, 60, 0, 42, {
        from: alice,
      });
      await this.voting.revealVote(bob, this.params.address, 1, 60, 0, 42, {
        from: bob,
      });
      // quickly end reveal time
      await time.increase(time.duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 1, {
        from: bob,
      });
      (await this.voting.polls(this.params.address, 1)).pollState
        .toString()
        .should.eq('2');
    });
    it('correctly resolve, lack of voting power, pollState should be Inconclusive', async () => {
      // commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(1, 0, 42),
        '0x00',
        1,
        0,
        { from: alice },
      );
      // waiting for commit period to end
      await time.increase(time.duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 1, {
        from: bob,
      });
      (await this.voting.polls(this.params.address, 1)).pollState
        .toString()
        .should.eq('4');
    });
    it('should revert, lack of voting power but try to resolve too soon', async () => {
      // commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(1, 0, 42),
        '0x00',
        1,
        0,
        { from: alice },
      );
      await shouldFail.reverting(
        this.voting.resolvePoll(this.params.address, 1, {
          from: bob,
        }),
      );
    });
    it('should revert, enough voting power but try to resolve too zoon', async () => {
      // commit
      await this.voting.commitVote(
        alice,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: alice },
      );
      await this.voting.commitVote(
        bob,
        this.params.address,
        1,
        web3.utils.soliditySha3(60, 0, 42),
        '0x00',
        60,
        0,
        { from: bob },
      );
      await time.increase(time.duration.seconds(60));
      await shouldFail.reverting(
        this.voting.resolvePoll(this.params.address, 1, {
          from: bob,
        }),
      );
    });
  });
});
