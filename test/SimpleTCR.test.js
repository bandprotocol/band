const { shouldFail, time } = require('openzeppelin-test-helpers');

const TCR = artifacts.require('TCR');
const TCRFactory = artifacts.require('TCRFactory');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');

require('chai').should();

contract('TCR', ([_, owner, alice, bob, carol, minProposer, minChallenger]) => {
  beforeEach(async () => {
    this.registry = await BandRegistry.deployed();
    this.commFactory = await CommunityFactory.new(this.registry.address, {
      from: owner,
    });
    this.band = await BandToken.at(await this.registry.band());
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
    const expression = await BondingCurveExpression.new([8, 1, 0, 2]);
    const data1 = await this.commFactory.create(
      'CoinHatcher',
      'CHT',
      expression.address,
      '0',
      '60',
      '500000000000000000',
      '500000000000000000',
      { from: owner },
    );
    this.comm = await CommunityToken.at(data1.receipt.logs[2].args.token);
    this.curve = await BondingCurve.at(data1.receipt.logs[2].args.bondingCurve);
    this.params = await Parameters.at(data1.receipt.logs[2].args.params);

    this.tcrFactory = await TCRFactory.new();
    //  if x <= 60
    //    return 1e18
    //  else if x <= 120
    //    return 1e18 - (5e17 * (x-60))/60
    //  else
    //    return 5e17
    const testDecay = await BondingCurveExpression.new([
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
    const data2 = await this.tcrFactory.createTCR(
      web3.utils.fromAscii('tcr:'),
      testDecay.address,
      this.params.address,
    );
    this.tcr = await TCR.at(data2.receipt.logs[0].args.tcr);

    this.params.setRaw(
      [
        web3.utils.fromAscii('tcr:min_deposit'),
        web3.utils.fromAscii('tcr:apply_stage_length'),
        web3.utils.fromAscii('tcr:dispensation_percentage'),
        web3.utils.fromAscii('tcr:commit_time'),
        web3.utils.fromAscii('tcr:reveal_time'),
        web3.utils.fromAscii('tcr:min_participation_pct'),
        web3.utils.fromAscii('tcr:support_required_pct'),
      ],
      [
        100,
        300,
        '300000000000000000',
        30,
        30,
        '700000000000000000',
        '500000000000000000',
      ],
      { from: owner },
    );

    await this.band.transfer(alice, 10000000, { from: owner });
    await this.band.transfer(bob, 10000000, { from: owner });
    await this.band.transfer(carol, 10000000, { from: owner });
    await this.band.transfer(minProposer, 10000000, { from: owner });
    await this.band.transfer(minChallenger, 10000000, { from: owner });
    // alice buy 1000 XCH
    const calldata = this.curve.contract.methods.buy(_, 0, 1000).encodeABI();
    await this.band.transferAndCall(
      this.curve.address,
      1000000,
      '0x' + calldata.slice(2, 10),
      '0x' + calldata.slice(138),
      { from: alice },
    );
    // bob buy 1000 XCH
    await this.band.transferAndCall(
      this.curve.address,
      3000000,
      '0x' + calldata.slice(2, 10),
      '0x' + calldata.slice(138),
      { from: bob },
    );
    // carol buy 1000 XCH
    await this.band.transferAndCall(
      this.curve.address,
      5000000,
      '0x' + calldata.slice(2, 10),
      '0x' + calldata.slice(138),
      { from: carol },
    );
    const calldata100 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
    // minProposer buy 1000 XCH
    await this.band.transferAndCall(
      this.curve.address,
      10000000,
      '0x' + calldata100.slice(2, 10),
      '0x' + calldata100.slice(138),
      { from: minProposer },
    );
    // minChallenger buy 1000 XCH
    await this.band.transferAndCall(
      this.curve.address,
      10000000,
      '0x' + calldata100.slice(2, 10),
      '0x' + calldata100.slice(138),
      { from: minChallenger },
    );
  });

  context('Basic Functionality', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    beforeEach(async () => {
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        this.tcr.address,
        200, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });
    it('Should be unable to overwrite existing entry', async () => {
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await shouldFail.reverting(
        this.comm.transferAndCall(
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
      await shouldFail.reverting(
        this.comm.transferAndCall(
          this.tcr.address,
          99, // minDeposit is 100
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });
    it('verify parameters of TCR', async () => {
      (await this.params.get(
        web3.utils.fromAscii('tcr:'),
        web3.utils.fromAscii('dispensation_percentage'),
      ))
        .toString()
        .should.eq('300000000000000000');
      (await this.params.get(
        web3.utils.fromAscii('tcr:'),
        web3.utils.fromAscii('min_deposit'),
      ))
        .toNumber()
        .should.eq(100);
      (await this.params.get(
        web3.utils.fromAscii('tcr:'),
        web3.utils.fromAscii('apply_stage_length'),
      ))
        .toNumber()
        .should.eq(300);
      (await this.params.get(
        web3.utils.fromAscii('tcr:'),
        web3.utils.fromAscii('support_required_pct'),
      ))
        .toString()
        .should.eq('500000000000000000');
      (await this.params.get(
        web3.utils.fromAscii('tcr:'),
        web3.utils.fromAscii('min_participation_pct'),
      ))
        .toString()
        .should.eq('700000000000000000');
    });
    it('verify min_deposit with time-value decay', async () => {
      // min_deposit at the begining
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(100);
      // 300 sec passed, end of apply_stage_length
      await time.increase(time.duration.seconds(300));
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(100);
      // 360 sec passed, end of cliff
      await time.increase(time.duration.seconds(60));
      (await this.tcr.currentMinDeposit(entryHash))
        .toNumber()
        .should.closeTo(100, 1);
      // linearly decrease overtime, 370 -> 420 sec
      for (let i = 80; i < 120; i += 20) {
        await time.increase(time.duration.seconds(20));
        // 1e18 - (5e17 * (x-60))/60
        Math.floor(100 - (50 * (i - 60)) / 60).should.closeTo(
          (await this.tcr.currentMinDeposit(entryHash)).toNumber(),
          1,
        );
      }
      // min_deposit reduced to half forever, 420 -> ∞ sec
      await time.increase(time.duration.seconds(10000));
      (await this.tcr.currentMinDeposit(entryHash)).toNumber().should.eq(50);
    });
    it('Should should active after listAt', async () => {
      (await this.tcr.isEntryActive(entryHash)).toString().should.eq('false');
      await time.increase(time.duration.seconds(300));
      (await this.tcr.isEntryActive(entryHash)).toString().should.eq('true');
    });
    it('Should withdrawable if nothing goes wrong', async () => {
      const balanceOfAlice = (await this.comm.balanceOf(alice)).toNumber();
      const withdrawAmount = 100;
      await this.tcr.withdraw(entryHash, withdrawAmount, {
        from: alice,
      });
      (await this.comm.balanceOf(alice))
        .toNumber()
        .should.eq(balanceOfAlice + withdrawAmount);
    });
    it('Should not withdrawable if not proposer', async () => {
      await shouldFail.reverting(
        this.tcr.withdraw(entryHash, 100, {
          from: bob,
        }),
      );
    });
    it('Should not withdrawable if not deposit < min_deposit', async () => {
      await shouldFail.reverting(
        this.tcr.withdraw(entryHash, 101, {
          from: alice,
        }),
      );
    });
    it('Should exitable if nothing goes wrong', async () => {
      const balanceOfAlice = (await this.comm.balanceOf(alice)).toNumber();
      await this.tcr.exit(entryHash, {
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
      await shouldFail.reverting(
        this.comm.transferAndCall(
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
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.comm.balanceOf(bob)).toNumber().should.eq(balanceOfBob - 100);
      (await this.tcr.entries(entryHash)).challengeId.toNumber().should.eq(1);
      (await this.tcr.challenges(1)).rewardPool.toNumber().should.eq(100);
    });
    it('Should be unable to challenge entry that already has a challenge', async () => {
      let calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await this.comm.transferAndCall(
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
      await shouldFail.reverting(
        this.comm.transferAndCall(
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
        .initiateChallenge(_, 0, entryHash, reasonHash) // time.increase challengeDeposit to 200
        .encodeABI();
      await this.comm.transferAndCall(
        this.tcr.address,
        200, // minDeposit is 100, should return 100 back to bob
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.comm.balanceOf(bob)).toNumber().should.eq(balanceOfBob - 100);
      (await this.tcr.entries(entryHash)).challengeId.toNumber().should.eq(1);
      (await this.tcr.challenges(1)).rewardPool.toNumber().should.eq(100);
    });
  });
  context('Voting for an on going challenge', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    const reasonHash = web3.utils.soliditySha3('some reason');
    const entryHash2 = web3.utils.soliditySha3('some entry with minimum stake');
    const reasonHash2 = web3.utils.soliditySha3('challenge with minimum stake');
    const salt = 99;
    beforeEach(async () => {
      let calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
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
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      const applyCalldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash2)
        .encodeABI();
      await this.comm.transferAndCall(
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + applyCalldata.slice(2, 10),
        '0x' + applyCalldata.slice(138),
        { from: minProposer },
      );

      const challengeCalldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash2, reasonHash2)
        .encodeABI();

      await this.comm.transferAndCall(
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + challengeCalldata.slice(2, 10),
        '0x' + challengeCalldata.slice(138),
        { from: minChallenger },
      );
    });
    it('Should revert if proposer/challenger commit or reveal vote', async () => {
      const challengeId = 1;
      // Commit
      await shouldFail.reverting(
        this.tcr.commitVote(challengeId, web3.utils.soliditySha3(true, salt), {
          from: alice,
        }),
      );
      await shouldFail.reverting(
        this.tcr.commitVote(challengeId, web3.utils.soliditySha3(false, salt), {
          from: bob,
        }),
      );
      // Carol can commit vote
      await this.tcr.commitVote(
        challengeId,
        web3.utils.soliditySha3(true, salt),
        { from: carol },
      );
      await time.increase(time.duration.seconds(30));
      // Reveal
      await shouldFail.reverting(
        this.tcr.revealVote(alice, challengeId, true, salt, { from: alice }),
      );
      await shouldFail.reverting(
        this.tcr.revealVote(bob, challengeId, false, salt, { from: bob }),
      );
      // Carol can reveal vote
      await this.tcr.revealVote(carol, challengeId, true, salt, {
        from: carol,
      });
    });
    it('Should revert if try to claim reward before challenge has resolved', async () => {
      const users = [alice, bob, carol];
      // const commits = [[alice, true], [bob, false], [carol, true]];
      const challengeId = 1;
      // on one claim their reward
      for (const person of users) {
        await shouldFail.reverting(
          this.tcr.claimReward(person, challengeId, { from: person }),
        );
      }
      // Carol vote
      await this.tcr.commitVote(
        challengeId,
        web3.utils.soliditySha3(true, salt),
        { from: carol },
      );
      (await this.tcr.challenges(challengeId)).totalCommitCount
        .toNumber()
        .should.eq(2700);
      await time.increase(time.duration.seconds(30));
      // no one can claim their reward
      for (const person of users) {
        await shouldFail.reverting(
          this.tcr.claimReward(person, challengeId, { from: person }),
        );
      }
      // Carol reveal
      await this.tcr.revealVote(carol, challengeId, true, salt, {
        from: carol,
      });
      // no one can claim their reward
      for (const person of users) {
        await shouldFail.reverting(
          this.tcr.claimReward(person, challengeId, { from: person }),
        );
      }
    });
    it('Alice should lose after voting has correctly resolved, entry will be removed', async () => {
      // const commits = [[alice, true], [bob, false], [carol, false]];
      const challengeId = 1;
      // Carol commit
      await this.tcr.commitVote(
        challengeId,
        web3.utils.soliditySha3(false, salt),
        { from: carol },
      );
      (await this.tcr.challenges(challengeId)).totalCommitCount
        .toNumber()
        .should.eq(2700);
      await time.increase(time.duration.seconds(30));
      // Carol reveal
      await this.tcr.revealVote(carol, challengeId, false, salt, {
        from: carol,
      });
      const challenge = await this.tcr.challenges(challengeId);
      challenge.removeCount.toNumber().should.eq(1900);
      challenge.keepCount.toNumber().should.eq(800);
      await time.increase(time.duration.seconds(30));
      // alice resolve
      await this.tcr.resolveChallenge(challengeId, {
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

      const bobVoteReward = Math.floor((200 - 130) * (900 / (900 + 1000)));
      (await this.comm.balanceOf(bob))
        .toNumber()
        .should.eq(1000 + 30 + bobVoteReward);

      // alice should not get anything from reward pool
      await shouldFail.reverting(
        this.tcr.claimReward(alice, challengeId, { from: alice }),
      );
      // carol claim her reward, so she should get 400/(400+600) of the remaining
      await this.tcr.claimReward(carol, challengeId, { from: carol });
      (await this.comm.balanceOf(carol))
        .toNumber()
        .should.eq(1000 + 70 - bobVoteReward);
      // bob cannot claim his reward, because he already got it in resolving process
      await shouldFail.reverting(
        this.tcr.claimReward(bob, challengeId, { from: bob }),
      );
      (await this.comm.balanceOf(bob))
        .toNumber()
        .should.eq(1000 + 30 + bobVoteReward);
    });
    it('Bob should loss after voting has correctly resolved', async () => {
      // const commits = [[alice, true], [bob, false], [carol, true]];
      const challengeId = 1;
      (await this.tcr.challenges(challengeId)).totalCommitCount
        .toNumber()
        .should.eq(1700);
      // everyone commit
      await this.tcr.commitVote(
        challengeId,
        web3.utils.soliditySha3(true, salt),
        { from: carol },
      );
      (await this.tcr.challenges(challengeId)).totalCommitCount
        .toNumber()
        .should.eq(2700);
      await time.increase(time.duration.seconds(30));
      // everyone reveal
      await this.tcr.revealVote(carol, challengeId, true, salt, {
        from: carol,
      });
      const challenge = await this.tcr.challenges(challengeId);
      challenge.keepCount.toNumber().should.eq(1800);
      challenge.removeCount.toNumber().should.eq(900);
      await time.increase(time.duration.seconds(30));
      // carol resolve
      await this.tcr.resolveChallenge(challengeId, {
        from: carol,
      });
      // entry should gain +30 for deposit
      // and (200 - 130) * (100 / (900 + 100)) from alice(the proposer) voting
      const aliceRewardVote = Math.floor((200 - 130) * (800 / (800 + 1000)));
      (await this.tcr.entries(entryHash)).deposit
        .toNumber()
        .should.eq(200 + 30 + aliceRewardVote);
      // bob should loss his deposit of his challenge
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000 - 100);
      // bob should not get anything from reward pool
      await shouldFail.reverting(
        this.tcr.claimReward(bob, challengeId, { from: bob }),
      );
      // carol claim her reward, so she should get 400/(400+600) of the remaining
      await this.tcr.claimReward(carol, challengeId, { from: carol });
      (await this.comm.balanceOf(carol))
        .toNumber()
        .should.eq(1000 + (200 - 130) - aliceRewardVote);
      // alice cannot claim her reward, because it already add to the entry since resolving has ended
      await shouldFail.reverting(
        this.tcr.claimReward(alice, challengeId, { from: alice }),
      );
      (await this.comm.balanceOf(alice)).toNumber().should.eq(800);
    });
    it('Should be inconclusive if total (voted) voting power < min_participation_pct', async () => {
      const users = [alice, bob, carol];
      const challengeId = 1;
      (await this.tcr.challenges(challengeId)).totalCommitCount
        .toNumber()
        .should.eq(1700);
      const challenge = await this.tcr.challenges(challengeId);
      challenge.keepCount.toNumber().should.eq(800);
      challenge.removeCount.toNumber().should.eq(900);
      await time.increase(time.duration.seconds(60));
      // bob resolve
      await this.tcr.resolveChallenge(challengeId, {
        from: bob,
      });
      // poll state should be inconclusive
      (await this.tcr.challenges(challengeId)).state.toNumber().should.eq(4);
      // no one can claim their reward
      for (const person of users) {
        await shouldFail.reverting(
          this.tcr.claimReward(person, challengeId, { from: person }),
        );
      }
      // fund of every entities should be the same
      (await this.tcr.entries(entryHash)).deposit.toNumber().should.eq(200);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(800);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(1000);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);
    });
    it('Should be the same as inconclusive if enough participant but yesCount or noCount is 0', async () => {
      const commits = [[alice, true], [bob, false], [carol, true]];
      const challengeId = 2;
      // everyone commit
      for (const [person, voteKeep] of commits) {
        await this.tcr.commitVote(
          challengeId,
          web3.utils.soliditySha3(voteKeep, salt),
          { from: person },
        );
      }
      // participant is more than enough
      (await this.tcr.challenges(challengeId)).totalCommitCount
        .toNumber()
        .should.eq(2700);
      await time.increase(time.duration.seconds(30));
      // nobody reveal ...
      await time.increase(time.duration.seconds(30));
      const challenge = await this.tcr.challenges(challengeId);
      challenge.keepCount.toNumber().should.eq(0);
      challenge.removeCount.toNumber().should.eq(0);
      // bob resolve
      await this.tcr.resolveChallenge(challengeId, {
        from: bob,
      });
      // poll state should be inconclusive
      (await this.tcr.challenges(challengeId)).state.toNumber().should.eq(4);
      // no one can claim their reward
      for (const commit of commits) {
        const person = commit[0];
        await shouldFail.reverting(
          this.tcr.claimReward(person, challengeId, { from: person }),
        );
      }
      // fund of every entities should be the same
      (await this.tcr.entries(entryHash2)).deposit.toNumber().should.eq(100);
      (await this.comm.balanceOf(alice)).toNumber().should.eq(800);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(900);
      (await this.comm.balanceOf(carol)).toNumber().should.eq(1000);
      (await this.comm.balanceOf(minProposer)).toNumber().should.eq(0);
      (await this.comm.balanceOf(minChallenger)).toNumber().should.eq(100);
    });
  });

  context('Claim reward flow', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    const reasonHash = web3.utils.soliditySha3('some reason');
    beforeEach(async () => {
      await this.comm.transfer(minProposer, 200, { from: alice });
      await this.comm.transfer(minChallenger, 200, { from: bob });

      // Balances at this time
      // alice          800
      // bob            800
      // carol         1000
      // minProposer    300
      // minChallenger  300

      const applyCalldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        this.tcr.address,
        200, // minDeposit is 100
        '0x' + applyCalldata.slice(2, 10),
        '0x' + applyCalldata.slice(138),
        { from: alice },
      );

      const challengeCalldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await this.comm.transferAndCall(
        this.tcr.address,
        100, // minDeposit is 100
        '0x' + challengeCalldata.slice(2, 10),
        '0x' + challengeCalldata.slice(138),
        { from: minChallenger },
      );
    });
    it('Should start with initial vote from proposer and challenger', async () => {
      const challengeId = 1;
      (await this.tcr.challenges(challengeId)).keepCount
        .toNumber()
        .should.eq(600);
      (await this.tcr.challenges(challengeId)).removeCount
        .toNumber()
        .should.eq(200);
      (await this.tcr.getVoteStatus(challengeId, alice))
        .toNumber()
        .should.eq(2);
      (await this.tcr.getVoteStatus(challengeId, bob)).toNumber().should.eq(0);
      (await this.tcr.getVoteStatus(challengeId, minChallenger))
        .toNumber()
        .should.eq(3);
    });
    it('Should distrubute reward correctly when keep entry', async () => {
      const voters = [[bob, true], [carol, false], [minProposer, true]];
      const challengeId = 1;
      const salt = 12;
      for (const [voter, voteKeep] of voters) {
        await this.tcr.commitVote(
          challengeId,
          web3.utils.soliditySha3(voteKeep, salt),
          { from: voter },
        );
      }
      await time.increase(time.duration.seconds(30));

      // Only voter that voted keep reveal
      await this.tcr.revealVote(bob, challengeId, true, salt, { from: bob });
      await this.tcr.revealVote(minProposer, challengeId, true, salt, {
        from: minProposer,
      });

      (await this.tcr.challenges(challengeId)).keepCount
        .toNumber()
        .should.eq(1700);
      (await this.tcr.challenges(challengeId)).removeCount
        .toNumber()
        .should.eq(200);
      await time.increase(time.duration.seconds(30));
      // Resolve challenge
      await this.tcr.resolveChallenge(challengeId, { from: alice });

      // Challenge status must be yes
      (await this.tcr.challenges(challengeId)).state.toNumber().should.eq(2);

      // Stake must increase
      const aliceReward = Math.floor((70 * 600) / 1700);
      (await this.tcr.entries(entryHash)).deposit
        .toNumber()
        .should.eq(200 + 30 + aliceReward);

      // Should revert when carol want to claim reward
      await shouldFail.reverting(
        this.tcr.claimReward(carol, challengeId, { from: carol }),
      );

      await this.tcr.claimReward(bob, challengeId, { from: bob });
      await this.tcr.claimReward(minProposer, challengeId, {
        from: minProposer,
      });
      const bobReward = Math.floor(((70 - aliceReward) * 800) / 1100);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(800 + bobReward);
      (await this.comm.balanceOf(minProposer))
        .toNumber()
        .should.eq(300 + 70 - aliceReward - bobReward);
    });
    it('Should distrubute reward correctly when remove entry', async () => {
      const voters = [[bob, false], [carol, false], [minProposer, true]];
      const challengeId = 1;
      const salt = 12;
      for (const [voter, voteKeep] of voters) {
        await this.tcr.commitVote(
          challengeId,
          web3.utils.soliditySha3(voteKeep, salt),
          { from: voter },
        );
      }
      await time.increase(time.duration.seconds(30));

      // Only voter that voted keep reveal
      await this.tcr.revealVote(bob, challengeId, false, salt, { from: bob });
      await this.tcr.revealVote(carol, challengeId, false, salt, {
        from: carol,
      });
      await this.tcr.revealVote(minProposer, challengeId, true, salt, {
        from: minProposer,
      });

      (await this.tcr.challenges(challengeId)).keepCount
        .toNumber()
        .should.eq(900);
      (await this.tcr.challenges(challengeId)).removeCount
        .toNumber()
        .should.eq(2000);
      await time.increase(time.duration.seconds(30));
      // Resolve challenge
      await this.tcr.resolveChallenge(challengeId, { from: alice });

      // Challenge status must be yes
      (await this.tcr.challenges(challengeId)).state.toNumber().should.eq(3);

      // Must revert if ask min_deposit
      await shouldFail.reverting(this.tcr.currentMinDeposit(entryHash));

      // Should revert when minProposer want to claim reward
      await shouldFail.reverting(
        this.tcr.claimReward(minProposer, challengeId, { from: minProposer }),
      );

      // Check balance of minChallenger
      const challengerVoteReward = Math.floor((70 * 200) / 2000);
      (await this.comm.balanceOf(minChallenger))
        .toNumber()
        .should.eq(300 + 30 + challengerVoteReward);
      await this.tcr.claimReward(bob, challengeId, { from: bob });
      await this.tcr.claimReward(carol, challengeId, { from: carol });

      const bobReward = Math.floor(((70 - challengerVoteReward) * 800) / 1800);
      (await this.comm.balanceOf(bob)).toNumber().should.eq(800 + bobReward);
      (await this.comm.balanceOf(carol))
        .toNumber()
        .should.eq(1000 + 70 - challengerVoteReward - bobReward);
    });
  });

  context('Min_deposit change', () => {
    const entryHash = web3.utils.soliditySha3('some entry');
    const reasonHash = web3.utils.soliditySha3('some reason');
    const newMinDeposit = 500;
    beforeEach(async () => {
      // create entry
      const calldata = await this.tcr.contract.methods
        .applyEntry(_, 0, entryHash)
        .encodeABI();
      await this.comm.transferAndCall(
        this.tcr.address,
        200, // stake is 200 and minDeposit is 100
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      // propose new min_deposit
      await this.params.propose(
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('tcr:min_deposit')],
        [newMinDeposit],
        {
          from: owner,
        },
      );
      // start vote for new min_deposit
      const votes = [[alice, true], [bob, false], [carol, true]];
      const proposeId = 0;
      // everyone commit
      for (const [person, accepted] of votes) {
        await this.params.voteOnProposal(proposeId, accepted, {
          from: person,
        });
      }
      await time.increase(time.duration.seconds(60));
    });
    it('New min_deposit should have new value', async () => {
      (await this.params.get(
        web3.utils.fromAscii('tcr:'),
        web3.utils.fromAscii('min_deposit'),
      ))
        .toNumber()
        .should.eq(newMinDeposit);
    });
    it('Should be unable to init challenge with previous min_deposit', async () => {
      const calldata = await this.tcr.contract.methods
        .initiateChallenge(_, 0, entryHash, reasonHash)
        .encodeABI();
      await shouldFail.reverting(
        this.comm.transferAndCall(
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
      await shouldFail.reverting(
        this.comm.transferAndCall(
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
      await shouldFail.reverting(
        this.comm.transferAndCall(
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
        this.tcr.address,
        500, // stake is 500 and minDeposit is 500
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });
  });
});
