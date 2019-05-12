const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');

require('chai').should();

contract('BandToken', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    this.contract = await BandToken.new({ from: owner });
    await this.contract.mint(owner, 1000000000, { from: owner });
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
});
