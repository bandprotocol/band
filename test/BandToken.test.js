const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');

require('chai').should();

contract('BandToken', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    this.contract = await BandToken.new(1000000, owner, { from: owner });
    await this.contract.transfer(alice, 1000, { from: owner });
  });

  it('should have correct information', async () => {
    (await this.contract.name()).should.eq('BandToken');
    (await this.contract.symbol()).should.eq('BAND');
    (await this.contract.decimals()).toString().should.eq('18');
  });

  context('Without token locking', () => {
    it('should only allow valid token transfer', async () => {
      // Alice sends 100 tokens to Bob.
      await this.contract.transfer(bob, 100, { from: alice });
      // Alice sends another 1000 tokens. Should fail since Alice only has 900.
      await shouldFail.reverting(
        this.contract.transfer(bob, 1000, { from: alice }),
      );

      (await this.contract.balanceOf(alice)).toString().should.eq('900');
      (await this.contract.balanceOf(bob)).toString().should.eq('100');
    });

    it('should only allow valid transferFrom', async () => {
      // Bob tries to withdraw 100 from Alice. Should fail since no approve yet.
      await shouldFail.reverting(
        this.contract.transferFrom(alice, bob, 100, { from: bob }),
      );
      // Alice approves Bob's withdrawal.
      await this.contract.approve(bob, 100, { from: alice });
      // Bob tries to withdraw more than the approved amount.
      await shouldFail.reverting(
        this.contract.transferFrom(alice, bob, 200, { from: bob }),
      );
      // Bob withdraws 100 tokens from Alice successfully now.
      await this.contract.transferFrom(alice, bob, 100, { from: bob });

      (await this.contract.balanceOf(alice)).toString().should.eq('900');
      (await this.contract.balanceOf(bob)).toString().should.eq('100');
    });
  });

  context(
    'With one year token locking, starting 2020/02, with 3 month cliff',
    () => {
      beforeEach(async () => {
        // The owner sets Alice's balance to be locked for 1000 tokens,
        // starting from 2020/02/01 for 1 year with 3 months cliff.
        await this.contract.setTokenLock(alice, 10, 13, 22, 1000, {
          from: owner,
        });
      });

      it('should only allow transfer after the cliff ends', async () => {
        await time.increaseTo(1581724800); // 2020/02/15 (0.5 months)
        await shouldFail.reverting(
          this.contract.transfer(bob, 1, { from: alice }),
        );
        await time.increaseTo(1584230400); // 2020/03/15 (1.5 months)
        await shouldFail.reverting(
          this.contract.transfer(bob, 1, { from: alice }),
        );
        await time.increaseTo(1586908800); // 2020/04/15 (2.5 months)
        await shouldFail.reverting(
          this.contract.transfer(bob, 1, { from: alice }),
        );
        await time.increaseTo(1589500800); // 2020/05/15 (3.5 months) - 1/4 vested
        (await this.contract.unlockedBalanceOf(alice))
          .toString()
          .should.eq('250');
        // Alice sends 150 of the vested tokens to Bob.
        await this.contract.transfer(bob, 150, { from: alice });
        (await this.contract.unlockedBalanceOf(alice))
          .toString()
          .should.eq('100');
        // Sending another 150 should fail as only 250 total is available.
        await shouldFail.reverting(
          this.contract.transfer(bob, 150, { from: alice }),
        );
        await time.increaseTo(1610668800); // 2021/01/15 (11.5 months)
        // 11/12 vested - locked balance should be floor(1/12*1000).
        (await this.contract.unlockedBalanceOf(alice))
          .toString()
          .should.eq('767');
        await time.increaseTo(1613347200); // 2021/02/01
        // All fully vested. 1000 - 150 = 850 should be available!
        (await this.contract.unlockedBalanceOf(alice))
          .toString()
          .should.eq('850');
      });
    },
  );
});
