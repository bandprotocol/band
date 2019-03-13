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
    this.band = await BandToken.new(100000000, owner, { from: owner });
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
        web3.utils.fromAscii('tcr:dispensation_percentage'),
        web3.utils.fromAscii('tcr:min_deposit'),
        web3.utils.fromAscii('tcr:apply_stage_length'),
        web3.utils.fromAscii('tcr:commit_time'),
        web3.utils.fromAscii('tcr:reveal_time'),
        web3.utils.fromAscii('tcr:support_required_pct'),
        web3.utils.fromAscii('tcr:min_participation_pct'),
      ],
      [
        60,
        60,
        50 * 1e12,
        50 * 1e12,
        30 * 1e12,
        100,
        300,
        30,
        30,
        50 * 1e12,
        50 * 1e12,
      ],
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
    this.tcr = await SimpleTCR.new(
      web3.utils.fromAscii('tcr:'),
      this.core.address,
      this.voting.address,
      //  if x <= 60
      //    return 1e12
      //  else if x <= 120
      //    return 1e12 - (5e11 * (x-60))/60
      //  else
      //    return 5e11
      [
        17,
        13,
        1,
        0,
        60,
        0,
        1e12,
        17,
        13,
        1,
        0,
        120,
        5,
        0,
        1e12,
        7,
        6,
        0,
        5e11,
        5,
        1,
        0,
        60,
        0,
        60,
        0,
        5e11,
      ],
      { from: owner },
    );

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    await this.comm.transferOwnership(this.core.address, { from: owner });
    // alice buy 1000 XCH
    const calldata1 = this.core.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      alice,
      this.core.address,
      1000000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );
    // bob buy 1000 XCH
    const calldata2 = this.core.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      bob,
      this.core.address,
      3000000,
      '0x' + calldata2.slice(2, 10),
      '0x' + calldata2.slice(138),
      { from: bob },
    );
    // carol buy 1000 XCH
    const calldata3 = this.core.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      carol,
      this.core.address,
      5000000,
      '0x' + calldata3.slice(2, 10),
      '0x' + calldata3.slice(138),
      { from: carol },
    );
  });

  context('Basic Functionality', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    beforeEach(async () => {
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.tcr.address,
        200, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });
    it('Should have the same execDelegator as community token', async () => {
      const execDelegatorToken = (await this.comm.execDelegator()).toString();
      (await this.tcr.execDelegator()).toString().should.eq(execDelegatorToken);
    });
    it('Should be unable to overwrite existing entry', async () => {
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          alice,
          this.tcr.address,
          300, // minDeposit is 100
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });
    it('Should be unable to create entry with stake < min_deposit', async () => {
      const newEntryHash = web3.utils.soliditySha3('some new entry');
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, newEntryHash)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          alice,
          this.tcr.address,
          99, // minDeposit is 100
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });
    it('verify parameters of TCR', async () => {
      (await this.tcr.get(web3.utils.fromAscii('dispensation_percentage')))
        .toNumber()
        .should.eq(30 * 1e12);

      (await this.tcr.get(web3.utils.fromAscii('min_deposit')))
        .toNumber()
        .should.eq(100);

      (await this.tcr.get(web3.utils.fromAscii('apply_stage_length')))
        .toNumber()
        .should.eq(300);

      (await this.tcr.get(web3.utils.fromAscii('support_required_pct')))
        .toNumber()
        .should.eq(50 * 1e12);

      (await this.tcr.get(web3.utils.fromAscii('min_participation_pct')))
        .toNumber()
        .should.eq(50 * 1e12);
    });
    it('verify min_deposit with time-value decay', async () => {
      // min_deposit at the begining
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(100);
      // 300 sec passed, end of apply_stage_length
      await increase(duration.seconds(300));
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(100);
      // 360 sec passed, end of cliff
      await increase(duration.seconds(60));
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(100);
      // linearly decrease overtime, 370 -> 420 sec
      for (let i = 80; i < 120; i += 20) {
        await increase(duration.seconds(20));
        // 1e12 - (5e11 * (x-60))/60
        Math.floor(100 - (50 * (i - 60)) / 60).should.eq(
          (await this.tcr.currentMinDeposit(entryHash)).toNumber(),
        );
      }
      // min_deposit reduced to half forever, 420 -> ∞ sec
      await increase(duration.seconds(10000));
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(50);
    });
    it('Should should active after listAt', async () => {
      (await this.tcr.isEntryActive(entryHash)).toString().should.eq('false');
      await increase(duration.seconds(300));
      (await this.tcr.isEntryActive(entryHash)).toString().should.eq('true');
    });
    it('Should withdrawable if nothing goes wrong', async () => {
      const balanceOfAlice = (await this.comm.balanceOf(alice)).toNumber();
      const withdrawAmount = 100;
      await this.tcr.withdraw(alice, entryHash, withdrawAmount, {
        from: alice,
      });
      (await this.comm.balanceOf(alice))
        .toNumber()
        .should.eq(balanceOfAlice + withdrawAmount);
    });
    it('Should not withdrawable if not proposer', async () => {
      await reverting(
        this.tcr.withdraw(bob, entryHash, 100, {
          from: bob,
        }),
      );
    });
    it('Should not withdrawable if not withdrawableDeposit < min_deposit', async () => {
      await reverting(
        this.tcr.withdraw(alice, entryHash, 101, {
          from: alice,
        }),
      );
    });
    it('Should exitable if nothing goes wrong', async () => {
      const balanceOfAlice = (await this.comm.balanceOf(alice)).toNumber();
      await this.tcr.exit(alice, entryHash, {
        from: alice,
      });
      (await this.comm.balanceOf(alice))
        .toNumber()
        .should.eq(balanceOfAlice + 200);
    });
  });

  context('Challenge Functionality', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    const reasonHash = web3.utils.soliditySha3('some reason');
    beforeEach(async () => {
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.tcr.address,
        200, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });
    it('Should be unchallengeable if deposit < min_deposit', async () => {
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(bob, 10, entryHash, reasonHash)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          bob,
          this.tcr.address,
          99, // minDeposit is 100
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: bob },
        ),
      );
    });
    it('Should be challengeable if not thing goes wrong', async () => {
      const balanceOfBob = (await this.comm.balanceOf(bob)).toNumber();
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(bob, 10, entryHash, reasonHash)
        .encodeABI();
      await this.comm.transferAndCall(
        bob,
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.comm.balanceOf(bob)).toNumber().should.eq(balanceOfBob - 100);
      (await this.tcr.entries(entryHash)).challengeID.toNumber().should.eq(1);
      (await this.tcr.challenges(1)).rewardPool.toNumber().should.eq(100 + 100);
    });
    it('Should be unable to challenge entry that already has a challenge', async () => {
      let calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await this.comm.transferAndCall(
        bob,
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      // carol try to create another challenge for the entry
      calldata = await this.tcr.contract.methods
        .initiateChallenge(
          _,
          0,
          entryHash,
          web3.utils.soliditySha3('reason of carol'),
        )
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          carol,
          this.tcr.address,
          100,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: carol },
        ),
      );
    });
    it('Should return fund back to challenger, if challengeDeposit > stake', async () => {
      const balanceOfBob = (await this.comm.balanceOf(bob)).toNumber();
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash) // increase challengeDeposit to 200
        .encodeABI();
      await this.comm.transferAndCall(
        bob,
        this.tcr.address,
        200, // minDeposit is 100, should return 100 back to bob
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.comm.balanceOf(bob)).toNumber().should.eq(balanceOfBob - 100);
      (await this.tcr.entries(entryHash)).challengeID.toNumber().should.eq(1);
      (await this.tcr.challenges(1)).rewardPool.toNumber().should.eq(100 + 100);
    });
  });
  context('Voting for an on going challenge', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    const reasonHash = web3.utils.soliditySha3('some reason');
    const salt = 99;
    beforeEach(async () => {
      let calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.tcr.address,
        200, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await this.comm.transferAndCall(
        bob,
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
    });
    it('should unable to vote more than voting power', async () => {
      await reverting(
        this.voting.commitVote(
          bob,
          this.tcr.address,
          1,
          web3.utils.soliditySha3(1000, 0, 42),
          '0x00',
          1000,
          0,
          { from: bob },
        ),
      );

      await reverting(
        this.voting.commitVote(
          alice,
          this.tcr.address,
          1,
          web3.utils.soliditySha3(0, 1000, 42),
          '0x00',
          1000,
          0,
          { from: alice },
        ),
      );

      await this.voting.commitVote(
        carol,
        this.tcr.address,
        1,
        web3.utils.soliditySha3(0, 1000, 42),
        '0x00',
        1000,
        0,
        { from: carol },
      );

      this.comm.transfer(bob, 100, { from: alice });

      // Have 1000 community tokens but still cannot buy
      await reverting(
        this.voting.commitVote(
          bob,
          this.tcr.address,
          1,
          web3.utils.soliditySha3(1000, 0, 42),
          '0x00',
          1000,
          0,
          { from: bob },
        ),
      );

      await this.voting.commitVote(
        bob,
        this.tcr.address,
        1,
        web3.utils.soliditySha3(900, 0, 42),
        '0x00',
        900,
        0,
        { from: bob },
      );
    });
    it('Should revert if try to claim reward before challenge has resolved', async () => {
      const commits = [[alice, 0, 600], [bob, 600, 0], [carol, 400, 300]];
      const challengeID = 1;
      // on one claim their reward
      for (const commit of commits) {
        const person = commit[0];
        await reverting(
          this.tcr.claimReward(person, challengeID, { from: person }),
        );
      }
      // everyone commit
      for (const [person, yes, no] of commits) {
        await this.voting.commitVote(
          person,
          this.tcr.address,
          challengeID,
          web3.utils.soliditySha3(yes, no, salt),
          '0x00',
          yes + no,
          0,
          { from: person },
        );
      }
      (await this.voting.polls(this.tcr.address, challengeID)).totalCount
        .toNumber()
        .should.eq(1900);
      await increase(duration.seconds(30));
      // no one can claim their reward
      for (const commit of commits) {
        const person = commit[0];
        await reverting(
          this.tcr.claimReward(person, challengeID, { from: person }),
        );
      }
      // everyone reveal
      for (const [person, yes, no] of commits) {
        await this.voting.revealVote(
          person,
          this.tcr.address,
          challengeID,
          yes,
          no,
          salt,
          {
            from: person,
          },
        );
      }
      // no one can claim their reward
      for (const commit of commits) {
        const person = commit[0];
        await reverting(
          this.tcr.claimReward(person, challengeID, { from: person }),
        );
      }
    });
    it('Alice should loss after voting has correctly resolved, entry will be removed', async () => {
      const commits = [[alice, 0, 600], [bob, 600, 0], [carol, 400, 300]];
      const challengeID = 1;
      // everyone commit
      for (const [person, yes, no] of commits) {
        await this.voting.commitVote(
          person,
          this.tcr.address,
          challengeID,
          web3.utils.soliditySha3(yes, no, salt),
          '0x00',
          yes + no,
          0,
          { from: person },
        );
      }
      (await this.voting.polls(this.tcr.address, challengeID)).totalCount
        .toNumber()
        .should.eq(1900);
      await increase(duration.seconds(30));
      // everyone reveal
      for (const [person, yes, no] of commits) {
        await this.voting.revealVote(
          person,
          this.tcr.address,
          challengeID,
          yes,
          no,
          salt,
          {
            from: person,
          },
        );
      }
      const poll = await this.voting.polls(this.tcr.address, challengeID);
      poll.yesCount.toNumber().should.eq(1000);
      poll.noCount.toNumber().should.eq(900);
      await increase(duration.seconds(30));
      // alice resolve
      await this.voting.resolvePoll(this.tcr.address, challengeID, {
        from: alice,
      });
      // entry should be removed
      (await this.tcr.entries(entryHash)).proposer.should.eq(
        '0x' + '0'.repeat(40),
      );
      // alice should loss her stake
      (await this.comm.balanceOf(alice)).toNumber().should.eq(1000 - 100);
      // bob should gain more 30% from leader reward and
      // so he should also get 600/(400+600) of the remaining
      // from his voting after resolve
      (await this.comm.balanceOf(bob))
        .toNumber()
        .should.eq(1000 + 30 + (200 - 130) * (600 / (400 + 600)));

      // alice should not get anything from reward pool
      await reverting(
        this.tcr.claimReward(alice, challengeID, { from: alice }),
      );
      // carol claim her reward, so she should get 400/(400+600) of the remaining
      await this.tcr.claimReward(carol, challengeID, { from: carol });
      (await this.comm.balanceOf(carol))
        .toNumber()
        .should.eq(1000 + (200 - 130) * (400 / (400 + 600)));
      // bob cannot claim his reward, because he already got it in resolving process
      await reverting(this.tcr.claimReward(bob, challengeID, { from: bob }));
      (await this.comm.balanceOf(bob))
        .toNumber()
        .should.eq(1000 + 30 + (200 - 130) * (600 / (400 + 600)));
    });
    it('Bob should loss after voting has correctly resolved', async () => {
      const commits = [[alice, 0, 100], [bob, 800, 0], [carol, 0, 900]];
      const challengeID = 1;
      // everyone commit
      for (const [person, yes, no] of commits) {
        await this.voting.commitVote(
          person,
          this.tcr.address,
          challengeID,
          web3.utils.soliditySha3(yes, no, salt),
          '0x00',
          yes + no,
          0,
          { from: person },
        );
      }
      (await this.voting.polls(this.tcr.address, challengeID)).totalCount
        .toNumber()
        .should.eq(1800);
      await increase(duration.seconds(30));
      // everyone reveal
      for (const [person, yes, no] of commits) {
        await this.voting.revealVote(
          person,
          this.tcr.address,
          challengeID,
          yes,
          no,
          salt,
          {
            from: person,
          },
        );
      }
      const poll = await this.voting.polls(this.tcr.address, challengeID);
      poll.yesCount.toNumber().should.eq(800);
      poll.noCount.toNumber().should.eq(1000);
      await increase(duration.seconds(30));
      // carol resolve
      await this.voting.resolvePoll(this.tcr.address, challengeID, {
        from: carol,
      });
      // entry should gain +30 for withdrawableDeposit
      // and (200 - 130) * (100 / (900 + 100)) from alice(the proposer) voting
      (await this.tcr.entries(entryHash)).withdrawableDeposit
        .toNumber()
        .should.eq(200 + 30 + (200 - 130) * (100 / (900 + 100)));
      // bob should loss his deposit of his challenge
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 100);
      // bob should not get anything from reward pool
      await reverting(this.tcr.claimReward(bob, challengeID, { from: bob }));
      // carol claim her reward, so she should get 400/(400+600) of the remaining
      await this.tcr.claimReward(carol, challengeID, { from: carol });
      (await this.comm.balanceOf(carol))
        .toNumber()
        .should.eq(1000 + (200 - 130) * (900 / (900 + 100)));
      // alice cannot claim her reward, because it already add to the entry since resolving has ended
      await reverting(
        this.tcr.claimReward(alice, challengeID, { from: alice }),
      );
      (await this.comm.balanceOf(alice)).toNumber().should.eq(800);
    });
    it('Should be inconclusive if tatal voting power < min_participation_pct', async () => {
      const commits = [[alice, 0, 400], [bob, 400, 0], [carol, 0, 200]];
      const challengeID = 1;
      // everyone commit
      for (const [person, yes, no] of commits) {
        await this.voting.commitVote(
          person,
          this.tcr.address,
          challengeID,
          web3.utils.soliditySha3(yes, no, salt),
          '0x00',
          yes + no,
          0,
          { from: person },
        );
      }
      (await this.voting.polls(this.tcr.address, challengeID)).totalCount
        .toNumber()
        .should.eq(1000);
      await increase(duration.seconds(30));
      // everyone reveal
      for (const [person, yes, no] of commits) {
        await this.voting.revealVote(
          person,
          this.tcr.address,
          challengeID,
          yes,
          no,
          salt,
          {
            from: person,
          },
        );
      }
      const poll = await this.voting.polls(this.tcr.address, challengeID);
      poll.yesCount.toNumber().should.eq(400);
      poll.noCount.toNumber().should.eq(600);
      await increase(duration.seconds(30));
      // bob resolve
      await this.voting.resolvePoll(this.tcr.address, challengeID, {
        from: bob,
      });
      // poll state should be inconclusive
      (await this.voting.polls(this.tcr.address, challengeID)).pollState
        .toString()
        .should.eq('4');
      // no one can claim their reward
      for (const commit of commits) {
        const person = commit[0];
        await reverting(
          this.tcr.claimReward(person, challengeID, { from: person }),
        );
      }
      // fund of every entities should be the same
      (await this.tcr.entries(entryHash)).withdrawableDeposit
        .toNumber()
        .should.eq(200);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(800);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);
    });
    it('Should be the same as inconclusive if enough participant but yesCount or noCount is 0', async () => {
      const commits = [[alice, 0, 700], [bob, 700, 0], [carol, 0, 700]];
      const challengeID = 1;
      // everyone commit
      for (const [person, yes, no] of commits) {
        await this.voting.commitVote(
          person,
          this.tcr.address,
          challengeID,
          web3.utils.soliditySha3(yes, no, salt),
          '0x00',
          yes + no,
          0,
          { from: person },
        );
      }
      // participant is more than enough
      (await this.voting.polls(this.tcr.address, challengeID)).totalCount
        .toNumber()
        .should.eq(2100);
      await increase(duration.seconds(30));
      // nobody reveal ...
      await increase(duration.seconds(30));
      const poll = await this.voting.polls(this.tcr.address, challengeID);
      poll.yesCount.toNumber().should.eq(0);
      poll.noCount.toNumber().should.eq(0);
      // bob resolve
      await this.voting.resolvePoll(this.tcr.address, challengeID, {
        from: bob,
      });
      // poll state should be inconclusive
      (await this.voting.polls(this.tcr.address, challengeID)).pollState
        .toString()
        .should.eq('4');
      // no one can claim their reward
      for (const commit of commits) {
        const person = commit[0];
        await reverting(
          this.tcr.claimReward(person, challengeID, { from: person }),
        );
      }
      // fund of every entities should be the same
      (await this.tcr.entries(entryHash)).withdrawableDeposit
        .toNumber()
        .should.eq(200);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(800);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);
    });
  });
  context('Min_deposit change', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    const reasonHash = web3.utils.soliditySha3('some reason');
    const newMinDeposit = 500;
    const salt = 99;
    beforeEach(async () => {
      // create entry
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.tcr.address,
        200, // stake is 200 and minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      // propose new min_deposit
      await this.params.propose(
        owner,
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('tcr:min_deposit')],
        [newMinDeposit],
        {
          from: owner,
        },
      );
      // start vote for new min_deposit
      const commits = [[alice, 600, 0], [bob, 600, 0], [carol, 0, 600]];
      const proposeID = 1;
      // everyone commit
      for (const [person, yes, no] of commits) {
        await this.voting.commitVote(
          person,
          this.params.address,
          proposeID,
          web3.utils.soliditySha3(yes, no, salt),
          '0x00',
          yes + no,
          0,
          { from: person },
        );
      }
      (await this.voting.polls(this.params.address, proposeID)).totalCount
        .toNumber()
        .should.eq(1800);
      await increase(duration.seconds(60));
      // everyone reveal
      for (const [person, yes, no] of commits) {
        await this.voting.revealVote(
          person,
          this.params.address,
          proposeID,
          yes,
          no,
          salt,
          {
            from: person,
          },
        );
      }
      await increase(duration.seconds(60));
      // alice resolve
      await this.voting.resolvePoll(this.params.address, proposeID, {
        from: alice,
      });
    });
    it('New min_deposit should has new value', async () => {
      (await this.tcr.get(web3.utils.fromAscii('min_deposit')))
        .toNumber()
        .should.eq(newMinDeposit);
    });
    it('Should be unable to init challenge with previous min_deposit', async () => {
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          bob,
          this.tcr.address,
          100, // old min_deposit is 100
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: bob },
        ),
      );
    });
    it('Should be unable to init challenge if deposit is < stake', async () => {
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          bob,
          this.tcr.address,
          199, // stake is 200
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: bob },
        ),
      );
    });
    it('Should be able to init challenge with deposit === stake when min_deposit > stake', async () => {
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await this.comm.transferAndCall(
        bob,
        this.tcr.address,
        200, // stake is 100, min_deposit is 500
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
    });
    it('Should be unable to create new entry with stake < new_min_deposit', async () => {
      // create new entry
      const newEntryHash = web3.utils.soliditySha3('some new entry');
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, newEntryHash)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          alice,
          this.tcr.address,
          200, // stake is 200 and minDeposit is 500
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });
    it('Should be able to create new entry with stake === new_min_deposit', async () => {
      // create new entry
      const newEntryHash = web3.utils.soliditySha3('some new entry');
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, newEntryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        alice,
        this.tcr.address,
        500, // stake is 500 and minDeposit is 500
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });
  });
});
