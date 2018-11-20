const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const { increaseTo } = require('openzeppelin-solidity/test/helpers/time');

const BandToken = artifacts.require('BandToken');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('BandToken', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.contract = await BandToken.new(1000000, { from: owner });
    await this.contract.transfer(alice, 1000, { from: owner });
  });

  context('Without token locking', async () => {
    it('should only allow valid token transfer', async () => {
      // Alice sends 100 tokens to Bob.
      await this.contract.transfer(bob, 100, { from: alice });
      // Alice sends another 1000 tokens. Should fail since Alice only has 900.
      await reverting(this.contract.transfer(bob, 1000, { from: alice }));

      (await this.contract.balanceOf(alice)).should.bignumber.eq(
        new BigNumber(900),
      );
      (await this.contract.balanceOf(bob)).should.bignumber.eq(
        new BigNumber(100),
      );
    });

    it('should only allow valid transferFrom', async () => {
      // Bob tries to withdraw 100 from Alice. Should fail since no approve yet.
      await reverting(
        this.contract.transferFrom(alice, bob, 100, { from: bob }),
      );
      // Alice approves Bob's withdrawal.
      await this.contract.approve(bob, 100, { from: alice });
      // Bob tries to withdraw more than the approved amount.
      await reverting(
        this.contract.transferFrom(alice, bob, 200, { from: bob }),
      );
      // Bob withdraws 100 tokens from Alice successfully now.
      await this.contract.transferFrom(alice, bob, 100, { from: bob });

      (await this.contract.balanceOf(alice)).should.bignumber.eq(
        new BigNumber(900),
      );
      (await this.contract.balanceOf(bob)).should.bignumber.eq(
        new BigNumber(100),
      );
    });
  });

  context(
    'With one year token locking, starting 2019/02, with 3 month cliff',
    async () => {
      beforeEach(async () => {
        // The owner sets Alice's balance to be locked for 1000 tokens,
        // starting from 2019/02/01 for 1 year with 3 months cliff.
        await this.contract.setTokenLock(alice, 13, 16, 25, 1000, {
          from: owner,
        });
      });

      it('should only allow transfer after the cliff ends', async () => {
        await increaseTo(1550188800); // 2019/02/15 (0.5 months)
        await reverting(this.contract.transfer(bob, 1, { from: alice }));
        await increaseTo(1552608000); // 2019/03/15 (1.5 months)
        await reverting(this.contract.transfer(bob, 1, { from: alice }));
        await increaseTo(1555286400); // 2019/04/15 (2.5 months)
        await reverting(this.contract.transfer(bob, 1, { from: alice }));
        await increaseTo(1557878400); // 2019/05/15 (3.5 months) - 1/4 vested
        (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(
          new BigNumber(250),
        );
        // Alice sends 150 of the vested tokens to Bob.
        await this.contract.transfer(bob, 150, { from: alice });
        (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(
          new BigNumber(100),
        );
        // Sending another 150 should fail as only 250 total is available.
        await reverting(this.contract.transfer(bob, 150, { from: alice }));
        await increaseTo(1579046400); // 2020/01/15 (11.5 months)
        // 11/12 vested - locked balance should be floor(1/12*1000).
        (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(
          new BigNumber(767),
        );
        await increaseTo(1580515200); // 2020/02/01
        // All fully vested. 1000 - 150 = 850 should be available!
        (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(
          new BigNumber(850),
        );
      });
    },
  );
});
