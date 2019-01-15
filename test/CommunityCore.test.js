const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const {
  increase,
  duration,
} = require('openzeppelin-solidity/test/helpers/time');
const { Merkle } = require('../lib/merkle');

const AdminTCR = artifacts.require('AdminTCR');
const BandToken = artifacts.require('BandToken');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const Voting = artifacts.require('Voting');

require('chai').should();

contract('CommunityCore', ([_, owner, alice, bob, carol, deactivator]) => {
  beforeEach(async () => {
    this.band = await BandToken.new(1000000, { from: owner });
    this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
      from: owner,
    });
    this.voting = await Voting.new({ from: owner });
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
    this.admin = await AdminTCR.new(
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
      [web3.utils.fromAscii('core:admin_contract')],
      [this.admin.address],
      {
        from: owner,
      },
    );
    await increase(duration.days(30));
    await this.voting.resolvePoll(this.params.address, 1, { from: owner });
    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });
    await this.comm.transferOwnership(this.core.address, { from: owner });
    await this.core.activate(0, { from: owner });
  });

  context('Checking buy and sell community tokens with f(s) = x ^ 2', () => {
    it('should not allow buying directly', async () => {
      await reverting(this.core.buy(alice, 100, 11000, { from: alice }));
    });

    it("should not allow buying if buy doesn't have enough band", async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await reverting(
        this.band.transferAndCall(
          this.core.address,
          110000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should not allow buying if price limit does not pass', async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await reverting(
        this.band.transferAndCall(
          this.core.address,
          9000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should allow buying tokens if calling via band tokens', async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        11000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('90000');
      (await this.comm.balanceOf(alice)).toString().should.eq('100');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });

    it('should increase price for subsequent purchases', async () => {
      const calldata1 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.core.contract.methods.buy(_, 0, 10).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        11000,
        '0x' + calldata2.slice(2, 10),
        '0x' + calldata2.slice(138),
        { from: bob },
      );
      (await this.band.balanceOf(bob)).toString().should.eq('97900');
      (await this.comm.balanceOf(bob)).toString().should.eq('10');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });

    it('should allow selling with correct price drop', async () => {
      const calldata1 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );
      const calldata2 = this.core.contract.methods
        .sell(_, 0, 10000)
        .encodeABI();
      await reverting(
        this.comm.transferAndCall(
          this.core.address,
          10,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: alice },
        ),
      );
      const calldata3 = this.core.contract.methods.sell(_, 0, 1000).encodeABI();
      await this.comm.transferAndCall(
        this.core.address,
        10,
        '0x' + calldata3.slice(2, 10),
        '0x' + calldata3.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('91900');
      (await this.comm.balanceOf(alice)).toString().should.eq('90');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });
  });

  context('Checking auto-inflation feature', () => {
    beforeEach(async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });

    it('should inflate 10% per month properly after a purchase', async () => {
      // 10% per month inflation
      await this.params.propose(
        [web3.utils.fromAscii('core:inflation_ratio')],
        [38581],
        {
          from: owner,
        },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: alice },
      );
      await increase(duration.seconds(60));
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: alice,
      });
      await increase(duration.days(30) - duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });
      const calldata = this.core.contract.methods.buy(_, 0, 10).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('88100');
      (await this.comm.balanceOf(alice)).toString().should.eq('110');
      (await this.comm.balanceOf(this.core.address)).toString().should.eq('10');
      (await this.comm.totalSupply()).toString().should.eq('120');
      (await this.core.curveMultiplier()).toString().should.eq('826446280991');
    });

    it('should inflate 10% per hour properly after a sale', async () => {
      // 10% per hour inflation
      await this.params.propose(
        [web3.utils.fromAscii('core:inflation_ratio')],
        [27777778],
        {
          from: owner,
        },
      );

      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: alice },
      );
      await increase(duration.seconds(60));
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: alice,
      });
      await increase(duration.hours(1) - duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });
      // First sale
      await increase(duration.hours(9));
      const calldata = this.core.contract.methods.sell(_, 0, 0).encodeABI();
      await this.comm.transferAndCall(
        this.core.address,
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
      (await this.core.curveMultiplier()).toString().should.eq('250000000000');
      // Second sale
      await increase(duration.hours(10));
      await this.comm.transferAndCall(
        this.core.address,
        10,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('91443');
      (await this.comm.balanceOf(alice)).toString().should.eq('80');
      (await this.comm.balanceOf(this.core.address))
        .toString()
        .should.eq('290');
      (await this.comm.totalSupply()).toString().should.eq('370');
      (await this.core.curveMultiplier()).toString().should.eq('62500000000');
    });
  });

  context('Checking sales commission', () => {
    beforeEach(async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      // 20% sales tax
      await this.params.propose(
        [web3.utils.fromAscii('core:sales_commission')],
        [200000000000],
        {
          from: alice,
        },
      );

      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: alice },
      );
      await increase(duration.seconds(60));
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: alice,
      });
      await increase(duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });
    });

    it('should not impose commission on purchases', async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 15).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('86775');
      (await this.comm.balanceOf(alice)).toString().should.eq('115');
      (await this.comm.balanceOf(this.core.address)).toString().should.eq('0');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });

    it('should impose commission on sales', async () => {
      const calldata = this.core.contract.methods.sell(_, 0, 1000).encodeABI();
      await this.comm.transferAndCall(
        this.core.address,
        15,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('92256');
      (await this.comm.balanceOf(alice)).toString().should.eq('85');
      (await this.comm.balanceOf(this.core.address)).toString().should.eq('3');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });
  });

  context('Checking deflation feature', () => {
    beforeEach(async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: owner },
      );
      await this.band.transferAndCall(
        this.core.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });

    it('should not allow non-admin to deflate', async () => {
      await reverting(this.core.deflate(10, { from: alice }));
    });

    it('should not allow admin to deflate more than what they own', async () => {
      await reverting(this.core.deflate(110, { from: owner }));
    });

    it('should allow admin to deflate', async () => {
      await this.core.deflate(10, { from: owner });
      (await this.core.curveMultiplier()).toString().should.eq('1108033240997');

      // Change Admin TCR parameters to allow new admin application
      await this.params.propose(
        [
          web3.utils.fromAscii('admin:min_deposit'),
          web3.utils.fromAscii('admin:apply_stage_length'),
        ],
        [10, 60],
        {
          from: owner,
        },
      );

      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(90, 0, 42),
        { from: owner },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: alice },
      );
      await increase(duration.seconds(60));
      await this.voting.revealVote(this.params.address, 2, 90, 0, 42, {
        from: owner,
      });
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: alice,
      });
      await increase(duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });

      // Alice applies to be an admin.
      const calldata = this.admin.contract.methods
        .applyEntry(_, 0, await this.admin.toTCREntry(alice))
        .encodeABI();
      await this.comm.transferAndCall(
        this.admin.address,
        10,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );

      // The apply stage has not passed yet. TCR application is still pending.
      await reverting(this.core.deflate(10, { from: alice }));
      // 100 seconds have passed, and no one challenges, so now Alice is good.
      await increase(100);
      await this.core.deflate(10, { from: alice });
      (await this.core.curveMultiplier()).toString().should.eq('1234567901234');
    });
  });

  context('Checking migration feature', () => {
    beforeEach(async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: owner },
      );
      await this.band.transferAndCall(
        this.core.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
    });

    it('should not allow non-deactivator to deactivate', async () => {
      await reverting(this.core.deactivate({ from: deactivator }));
    });

    context('After the contract is deactivated', () => {
      beforeEach(async () => {
        await this.params.propose(
          [web3.utils.fromAscii('core:deactivator')],
          [deactivator],
          {
            from: alice,
          },
        );
        await this.voting.commitVote(
          this.params.address,
          2,
          web3.utils.soliditySha3(100, 0, 42),
          { from: owner },
        );
        await this.voting.commitVote(
          this.params.address,
          2,
          web3.utils.soliditySha3(100, 0, 42),
          { from: alice },
        );
        await increase(duration.seconds(60));
        await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
          from: owner,
        });
        await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
          from: alice,
        });
        await increase(duration.seconds(60));
        await this.voting.resolvePoll(this.params.address, 2, { from: alice });
        await this.core.deactivate({ from: deactivator });
      });

      it('should transfer band and comm ownership to deactivator', async () => {
        (await this.band.balanceOf(this.core.address))
          .toString()
          .should.eq('0');
        (await this.band.balanceOf(deactivator)).toString().should.eq('40000');
        (await this.comm.owner()).should.eq(deactivator);
      });

      it('should not allow buy or sell or deflate or deactivate', async () => {
        const calldata1 = this.core.contract.methods.buy(_, 0, 10).encodeABI();
        await reverting(
          this.band.transferAndCall(
            this.core.address,
            100000,
            '0x' + calldata1.slice(2, 10),
            '0x' + calldata1.slice(138),
            { from: owner },
          ),
        );
        const calldata2 = this.core.contract.methods.sell(_, 0, 10).encodeABI();
        await reverting(
          this.comm.transferAndCall(
            this.core.address,
            0,
            '0x' + calldata2.slice(2, 10),
            '0x' + calldata2.slice(138),
            { from: owner },
          ),
        );
        await reverting(this.core.deflate(10, { from: owner }));
        await reverting(this.core.deactivate({ from: deactivator }));
      });

      it('should allow creating new community core with new equation', async () => {
        const core = await CommunityCore.new(
          this.band.address,
          this.comm.address,
          this.params.address,
          [8, 1, 0, 3], // f(x) = x ^ 3
          {
            from: deactivator,
          },
        );

        await this.band.approve(core.address, 100000, { from: deactivator });
        await this.comm.transferOwnership(core.address, { from: deactivator });
        await core.activate(40000, { from: deactivator });

        (await core.currentBandCollatoralized()).toString().should.eq('40000');
        (await core.curveMultiplier()).toString().should.eq('5000000000');
      });
    });
  });

  context('Checking reward distribution feature', () => {
    beforeEach(async () => {
      const calldata = this.core.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.core.address,
        20000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: owner },
      );
      // Reward period of 1 month, with 1 day edit period.
      await this.params.propose(
        [
          web3.utils.fromAscii('core:reward_period'),
          web3.utils.fromAscii('core:reward_edit_period'),
        ],
        [2592000, 86400],
        {
          from: owner,
        },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: owner },
      );
      await increase(duration.seconds(60));
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: owner,
      });
      await increase(duration.seconds(60));
      await this.voting.resolvePoll(this.params.address, 2, { from: owner });

      // Owner sends some revenue to the contract
      await this.comm.transfer(this.core.address, 10, { from: owner });

      this.merkle = new Merkle();
      this.merkle.insert(owner, 5);
      this.merkle.insert(alice, 10);
      this.merkle.insert(bob, 15);
      this.merkle.insert(carol, 20);
    });

    it('should not allow non-admin to report reward', async () => {
      await reverting(
        this.core.addRewardDistribution(this.merkle.root, 50, {
          from: alice,
        }),
      );
    });

    context('After admin report reward', async () => {
      beforeEach(async () => {
        await this.core.addRewardDistribution(this.merkle.root, 50, {
          from: owner,
        });
      });

      it('should not allow members to withdraw before edit period', async () => {
        await reverting(
          this.core.claimReward(alice, 1, 10, this.merkle.getProof(alice)[1], {
            from: alice,
          }),
        );
      });

      it('should allow withdraw reward after edit period', async () => {
        await increase(duration.days(1.5));
        await this.core.claimReward(
          alice,
          1,
          10,
          this.merkle.getProof(alice)[1],
          {
            from: alice,
          },
        );
        (await this.comm.balanceOf(alice)).toString().should.eq('2');
      });

      it('should not allow members to withdraw with invalid value', async () => {
        await increase(duration.days(1.5));
        await this.core.claimReward(
          alice,
          1,
          10,
          this.merkle.getProof(alice)[1],
          {
            from: alice,
          },
        );
        (await this.comm.balanceOf(alice)).toString().should.eq('2');
        (await this.core.unwithdrawnReward()).toString().should.eq('8');
      });

      it('should allow extend edit period of admin overwrites the distribution hash', async () => {
        await increase(duration.days(0.75));
        this.merkle.insert(alice, 60);
        await this.core.editRewardDistribution(1, this.merkle.root, 100, {
          from: owner,
        });
        await increase(duration.days(0.75));
        await reverting(
          this.core.claimReward(alice, 1, 60, this.merkle.getProof(alice)[1], {
            from: alice,
          }),
        );
        await increase(duration.days(0.75));
        await this.core.claimReward(
          alice,
          1,
          60,
          this.merkle.getProof(alice)[1],
          {
            from: alice,
          },
        );
        (await this.comm.balanceOf(alice)).toString().should.eq('6');
        (await this.core.unwithdrawnReward()).toString().should.eq('4');
      });

      it('should allow another reward distribution after reward_period', async () => {
        await increase(duration.days(20));
        // Owner sends some revenue to the contract for the next period
        await this.comm.transfer(this.core.address, 10, { from: owner });
        // Alice claims reward of first period
        await this.core.claimReward(
          alice,
          1,
          10,
          this.merkle.getProof(alice)[1],
          {
            from: alice,
          },
        );
        (await this.comm.balanceOf(alice)).toString().should.eq('2');
        (await this.core.unwithdrawnReward()).toString().should.eq('8');

        // Admin tries to report for the next period, but it's too early
        this.merkle.insert(alice, 60);
        await reverting(
          this.core.addRewardDistribution(this.merkle.root, 100, {
            from: owner,
          }),
        );

        await increase(duration.days(20));
        await this.core.addRewardDistribution(this.merkle.root, 100, {
          from: owner,
        });

        // Alice claims reward of second period
        await increase(duration.days(2));
        await this.core.claimReward(
          alice,
          2,
          60,
          this.merkle.getProof(alice)[1],
          {
            from: alice,
          },
        );
        (await this.comm.balanceOf(alice)).toString().should.eq('8');
        (await this.core.unwithdrawnReward()).toString().should.eq('12');
      });
    });
  });
});
