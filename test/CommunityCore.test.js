const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const {
  increase,
  increaseTo,
  duration,
} = require('openzeppelin-solidity/test/helpers/time');
const { Merkle } = require('../lib/merkle');

const AdminTCR = artifacts.require('AdminTCR');
const BandToken = artifacts.require('BandToken');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('CommunityCore', ([_, owner, alice, bob, carol, deactivator]) => {
  beforeEach(async () => {
    this.band = await BandToken.new(1000000, { from: owner });
    this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
      from: owner,
    });
    this.params = await Parameters.new(
      this.comm.address,
      [
        'params:proposal_expiration_time',
        'params:support_required',
        'params:minimum_quorum',
      ],
      [60, 80, 80],
      { from: owner },
    );
    this.admin = await AdminTCR.new(this.params.address, { from: owner });
    this.core = await CommunityCore.new(
      this.admin.address,
      this.band.address,
      this.params.address,
      [8, 1, 0, 2],
      {
        from: owner,
      },
    );

    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });
    await this.comm.transferOwnership(this.core.address, { from: owner });
    await this.core.activate(0, { from: owner });
  });

  context('Checking buy and sell community tokens with f(s) = x ^ 2', () => {
    it('should not allow buying tokens if owner has not approved', async () => {
      await reverting(this.core.buy(100, 9000, { from: alice }));
      await reverting(this.core.buy(100, 11000, { from: alice }));
    });

    it('should not allow buying if buy doesn\'t have enough band', async () => {
      await this.band.approve(this.core.address, 1000000, { from: alice });
      await reverting(this.core.buy(1000, 10000000, { from: alice }));
    });

    it('should not allow buying if price limit does not pass', async () => {
      await this.band.approve(this.core.address, 100000, { from: alice });
      await reverting(this.core.buy(100, 9000, { from: alice }));
    });

    it('should allow buying tokens if owner has approved', async () => {
      await this.band.approve(this.core.address, 100000, { from: alice });
      await this.core.buy(100, 11000, { from: alice });
      (await this.band.balanceOf(alice)).should.bignumber.eq(90000);
      (await this.comm.balanceOf(alice)).should.bignumber.eq(100);
      (await this.core.curveMultiplier()).should.bignumber.eq(1000000000000);
    });

    it('should increase price for subsequent purchases', async () => {
      await this.band.approve(this.core.address, 100000, { from: alice });
      await this.band.approve(this.core.address, 100000, { from: bob });
      await this.core.buy(100, 11000, { from: alice });
      await this.core.buy(10, 10000, { from: bob });
      (await this.band.balanceOf(bob)).should.bignumber.eq(97900);
      (await this.comm.balanceOf(bob)).should.bignumber.eq(10);
      (await this.core.curveMultiplier()).should.bignumber.eq(1000000000000);

      it('should allow community token owner to sell with proper price drop', async () => {
        await this.band.approve(this.core.address, 100000, { from: alice });
        await this.core.buy(100, 11000, { from: alice });
        await reverting(this.core.sell(10, 10000, { from: alice }));
        await this.core.sell(10, 1000, { from: alice });
        (await this.band.balanceOf(bob)).should.bignumber.eq(91900);
        (await this.comm.balanceOf(bob)).should.bignumber.eq(90);
        (await this.core.curveMultiplier()).should.bignumber.eq(1000000000000);
      });
    });
  });

  context('Checking auto-inflation feature', () => {
    beforeEach(async () => {
      await this.band.approve(this.core.address, 50000, { from: alice });
      await this.core.buy(100, 20000, { from: alice });
    });

    it('should inflate 10% per month properly after a purchase', async () => {
      // 10% per month inflation
      await this.params.propose(['core:inflation_ratio'], [38581], {
        from: owner,
      });
      await this.params.vote(1, 100, 0, { from: alice });
      await increase(duration.days(30));
      await this.params.resolve(1, { from: alice });
      await this.core.buy(10, 20000, { from: alice });
      (await this.band.balanceOf(alice)).should.bignumber.eq(88100);
      (await this.comm.balanceOf(alice)).should.bignumber.eq(110);
      (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(10);
      (await this.comm.totalSupply()).should.bignumber.eq(120);
      (await this.core.curveMultiplier()).should.bignumber.eq(826446280991);
    });

    it('should inflate 10% per hour properly after a sale', async () => {
      // 10% per hour inflation
      await this.params.propose(['core:inflation_ratio'], [27777778], {
        from: owner,
      });
      await this.params.vote(1, 100, 0, { from: alice });
      await increase(duration.hours(1));
      await this.params.resolve(1, { from: alice });
      // First sale
      await increase(duration.hours(9));
      await this.core.sell(10, 0, { from: alice });
      (await this.band.balanceOf(alice)).should.bignumber.eq(90975);
      (await this.comm.balanceOf(alice)).should.bignumber.eq(90);
      (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(100);
      (await this.comm.totalSupply()).should.bignumber.eq(190);
      (await this.core.curveMultiplier()).should.bignumber.eq(250000000000);
      // Second sale
      await increase( duration.hours(10));
      await this.core.sell(10, 0, { from: alice });
      (await this.band.balanceOf(alice)).should.bignumber.eq(91443);
      (await this.comm.balanceOf(alice)).should.bignumber.eq(80);
      (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(290);
      (await this.comm.totalSupply()).should.bignumber.eq(370);
      (await this.core.curveMultiplier()).should.bignumber.eq(62500000000);
    });
  });

  context('Checking sales tax', () => {
    beforeEach(async () => {
      await this.band.approve(this.core.address, 50000, { from: alice });
      await this.core.buy(100, 20000, { from: alice });
      // 20% sales tax
      await this.params.propose(['core:sales_tax'], [200000000000], {
        from: alice,
      });
      await this.params.vote(1, 100, 0, { from: alice });
      await increase(86400);
      await this.params.resolve(1, { from: alice });
    });

    it('should not impose taxes on purchases', async () => {
      await this.core.buy(15, 10000, { from: alice });
      (await this.band.balanceOf(alice)).should.bignumber.eq(86775);
      (await this.comm.balanceOf(alice)).should.bignumber.eq(115);
      (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(0);
      (await this.core.curveMultiplier()).should.bignumber.eq(1000000000000);
    });

    it('should impose taxes on sales', async () => {
      await this.core.sell(15, 1000, { from: alice });
      (await this.band.balanceOf(alice)).should.bignumber.eq(92256);
      (await this.comm.balanceOf(alice)).should.bignumber.eq(new BigNumber(85));
      (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(3);
      (await this.core.curveMultiplier()).should.bignumber.eq(1000000000000);
    });
  });

  context('Checking deflation feature', () => {
    beforeEach(async () => {
      await this.band.approve(this.core.address, 100000, { from: owner });
      await this.band.approve(this.core.address, 100000, { from: alice });
      await this.core.buy(100, 100000, { from: owner });
      await this.core.buy(100, 100000, { from: alice });
    });

    it('should not allow non-admin to deflate', async () => {
      await reverting(this.core.deflate(10, { from: alice }));
    });

    it('should not allow admin to deflate more than what he or she owns', async () => {
      await reverting(this.core.deflate(110, { from: owner }));
    });

    it('should allow admin to deflate', async () => {
      await this.core.deflate(10, { from: owner });
      (await this.core.curveMultiplier()).should.bignumber.eq(1108033240997);

      // Change Admin TCR parameters to allow new admin application
      await this.params.propose(
        ['admin:min_deposit', 'admin:apply_stage_length'],
        [10, 60],
        {
          from: owner,
        },
      );

      await this.params.vote(1, 100, 0, { from: alice });
      await this.params.vote(1, 90, 0, { from: owner });
      await increase(86400);
      await this.params.resolve(1, { from: alice });

      // Alice applies to be an admin.
      await this.comm.approve(this.admin.address, 100000, { from: alice });
      await this.admin.applyAdmin(10, { from: alice });
      // The apply stage has not passed yet. TCR application is still pending.
      await reverting(this.core.deflate(10, { from: alice }));
      // 100 seconds have passed, and no one challenges, so now Alice is good to go.
      await increase(100);
      this.core.deflate(10, { from: alice });
      (await this.core.curveMultiplier()).should.bignumber.eq(1234567901234);
    });
  });

  context('Checking migration feature', () => {
    beforeEach(async () => {
      await this.band.approve(this.core.address, 100000, { from: owner });
      await this.band.approve(this.core.address, 100000, { from: alice });
      await this.core.buy(100, 100000, { from: owner });
      await this.core.buy(100, 100000, { from: alice });
    });

    it('should not allow non-deactivator to deactivate', async () => {
      await reverting(this.core.deactivate({ from: deactivator }));
    });

    context('After the contract is deactivated', () => {
      beforeEach(async () => {
        await this.params.propose(['core:deactivator'], [deactivator], {
          from: alice,
        });
        await this.params.vote(1, 100, 0, { from: alice });
        await this.params.vote(1, 100, 0, { from: owner });
        await increase(86400);
        await this.params.resolve(1, { from: alice });
        await this.core.deactivate({ from: deactivator });
      });

      it('should transfer band and comm ownership to deactivator', async () => {
        (await this.band.balanceOf(this.core.address)).should.bignumber.eq(0);
        (await this.band.balanceOf(deactivator)).should.bignumber.eq(40000);
        (await this.comm.owner()).should.eq(deactivator);
      });

      it('should not allow buy or sell or deflate or deactivate', async () => {
        await reverting(this.core.buy(10, 10000, { from: alice }));
        await reverting(this.core.sell(10, 10, { from: alice }));
        await reverting(this.core.deflate(10, { from: owner }));
        await reverting(this.core.deactivate({ from: deactivator }));
      });

      it('should allow creating new community core with new equation', async () => {
        const core = await CommunityCore.new(
          this.admin.address,
          this.band.address,
          this.params.address,
          [8, 1, 0, 3], // f(x) = x ^ 3
          {
            from: deactivator,
          },
        );

        await this.band.approve(core.address, 100000, { from: deactivator });
        await this.comm.transferOwnership(core.address, { from: deactivator });
        await core.activate(40000, { from: deactivator });

        (await core.currentBandCollatoralized()).should.bignumber.eq(40000);
        (await core.curveMultiplier()).should.bignumber.eq(5000000000);
      });
    });
  });

  context('Checking reward distribution feature', () => {
    beforeEach(async () => {
      await this.band.approve(this.core.address, 50000, { from: owner });
      await this.core.buy(100, 20000, { from: owner });
      // Reward period of 1 month, with 1 day edit period.
      await this.params.propose(
        ['core:reward_period', 'core:reward_edit_period'],
        [2592000, 86400],
        {
          from: owner,
        },
      );
      await this.params.vote(1, 100, 0, { from: owner });
      await increase(86400);
      await this.params.resolve(1, { from: alice });
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
          this.core.claimReward(1, 10, this.merkle.getProof(alice)[1], {
            from: alice,
          }),
        );
      });

      it('should allow withdraw reward after edit period', async () => {
        await increase(duration.days(1.5));
        await this.core.claimReward(1, 10, this.merkle.getProof(alice)[1], {
          from: alice,
        });
        (await this.comm.balanceOf(alice)).should.bignumber.eq(2);
      });

      it('should not allow members to withdraw with invalid value', async () => {
        await increase(duration.days(1.5));
        await this.core.claimReward(1, 10, this.merkle.getProof(alice)[1], {
          from: alice,
        });
        (await this.comm.balanceOf(alice)).should.bignumber.eq(2);
        (await this.core.unwithdrawnReward()).should.bignumber.eq(8);
      });

      it('should allow extend edit period of admin overwrites the distribution hash', async () => {
        await increase(duration.days(0.75));
        this.merkle.insert(alice, 60);
        await this.core.editRewardDistribution(1, this.merkle.root, 100, {
          from: owner,
        });
        await increase(duration.days(0.75));
        await reverting(
          this.core.claimReward(1, 60, this.merkle.getProof(alice)[1], {
            from: alice,
          }),
        );
        await increase(duration.days(0.75));
        await this.core.claimReward(1, 60, this.merkle.getProof(alice)[1], {
          from: alice,
        });
        (await this.comm.balanceOf(alice)).should.bignumber.eq(6);
        (await this.core.unwithdrawnReward()).should.bignumber.eq(4);
      });

      it('should allow another reward distribution after reward_period', async () => {
        await increase(duration.days(20));

        // Owner sends some revenue to the contract for the next period
        await this.comm.transfer(this.core.address, 10, { from: owner });

        // Alice claims reward of first period
        await this.core.claimReward(1, 10, this.merkle.getProof(alice)[1], {
          from: alice,
        });
        (await this.comm.balanceOf(alice)).should.bignumber.eq(2);
        (await this.core.unwithdrawnReward()).should.bignumber.eq(8);

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
        await this.core.claimReward(2, 60, this.merkle.getProof(alice)[1], {
          from: alice,
        });
        (await this.comm.balanceOf(alice)).should.bignumber.eq(8);
        (await this.core.unwithdrawnReward()).should.bignumber.eq(12);
      });
    });
  });
});
