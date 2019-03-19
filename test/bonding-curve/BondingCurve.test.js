const { shouldFail, time } = require('openzeppelin-test-helpers');

const BondingCurve = artifacts.require('BondingCurve');
const ERC20Base = artifacts.require('ERC20Base');

require('chai').should();

contract('BondingCurve', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    this.collateralToken = await ERC20Base.new({ from: owner });
    this.bondedToken = await ERC20Base.new({ from: owner });
    this.curve = await BondingCurve.new(
      this.collateralToken.address,
      this.bondedToken.address,
      [8, 1, 0, 2],
      { from: owner },
    );
    await this.collateralToken.mint(alice, '100000', { from: owner });
    await this.collateralToken.mint(bob, '100000', { from: owner });
    await this.bondedToken.transferOwnership(this.curve.address, {
      from: owner,
    });
  });

  context('Basic functionalities', () => {
    it('should allow alice to buy 100 tokens with proper change', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.collateralToken.transferAndCall(
        alice,
        this.curve.address,
        50000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.collateralToken.balanceOf(this.curve.address))
        .toString()
        .should.eq('10000');
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('90000');
      (await this.bondedToken.balanceOf(this.curve.address))
        .toString()
        .should.eq('0');
      (await this.bondedToken.balanceOf(alice)).toString().should.eq('100');
      (await this.curve.currentMintedTokens()).toString().should.eq('100');
      (await this.curve.currentCollateral()).toString().should.eq('10000');
    });

    it('should not allow alice to buy 100 tokens with insufficient funds', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await shouldFail.reverting(
        this.bondedToken.transferAndCall(
          alice,
          this.curve.address,
          9000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should not allow non-owner to set parameters', async () => {
      await shouldFail.reverting(
        this.curve.setInflationRate('38580246914', { from: alice }),
      );
    });
  });

  context('Alice buys 100 tokens', () => {
    beforeEach(async () => {
      await this.collateralToken.approve(this.curve.address, 10000, {
        from: alice,
      });
      await this.curve.buy(alice, 10000, 100, { from: alice });
    });

    it('should allow Alice to sell 20 tokens with price limit 10', async () => {
      const calldata = this.curve.contract.methods.sell(_, 0, 10).encodeABI();
      await this.bondedToken.transferAndCall(
        alice,
        this.curve.address,
        20,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );

      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('93600');
      (await this.bondedToken.balanceOf(alice)).toString().should.eq('80');
      (await this.curve.currentMintedTokens()).toString().should.eq('80');
      (await this.curve.currentCollateral()).toString().should.eq('6400');
    });

    it('should not allow Alice to sell 20 tokens with price limit 4000', async () => {
      const calldata = this.curve.contract.methods.sell(_, 0, 4000).encodeABI();
      await shouldFail.reverting(
        this.bondedToken.transferAndCall(
          alice,
          this.curve.address,
          20,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
          { from: alice },
        ),
      );
    });

    it('should allow Bob to buy 10 tokens after Alice', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.collateralToken.transferAndCall(
        bob,
        this.curve.address,
        50000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.collateralToken.balanceOf(bob)).toString().should.eq('97900');
      (await this.bondedToken.balanceOf(bob)).toString().should.eq('10');
      (await this.curve.currentMintedTokens()).toString().should.eq('110');
      (await this.curve.currentCollateral()).toString().should.eq('12100');
    });
  });

  context('Alice buys 100 tokens and sets inflation to 10% per month', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.collateralToken.transferAndCall(
        alice,
        this.curve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      await this.curve.setInflationRate('38580246914', { from: owner });
    });

    it('should inflate 10 tokens to owner after 1 month', async () => {
      await time.increase(time.duration.days(30));
      const calldata = this.curve.contract.methods.buy(_, 0, 50).encodeABI();
      await this.collateralToken.transferAndCall(
        bob,
        this.curve.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.collateralToken.balanceOf(owner)).toString().should.eq('0');
      (await this.bondedToken.balanceOf(owner)).toString().should.eq('10');
      (await this.curve.currentMintedTokens()).toString().should.eq('160');
      (await this.curve.currentCollateral()).toString().should.eq('21157');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('826446280991735537');
    });

    it('should inflate 20 tokens after 2 month', async () => {
      await time.increase(time.duration.days(60));
      const calldata = this.curve.contract.methods.buy(_, 0, 50).encodeABI();
      await this.collateralToken.transferAndCall(
        bob,
        this.curve.address,
        100000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: bob },
      );
      (await this.collateralToken.balanceOf(owner)).toString().should.eq('0');
      (await this.bondedToken.balanceOf(owner)).toString().should.eq('20');
    });
  });

  context('Alice buys 100 tokens and sets liquidation fee to 10%', () => {
    beforeEach(async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.collateralToken.transferAndCall(
        alice,
        this.curve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      await this.curve.setLiquidityFee('100000000000000000', { from: owner });
    });

    it('should collect revenue of 1 token if Alice buys 10 more tokens', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.collateralToken.transferAndCall(
        alice,
        this.curve.address,
        90000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('87679');
      (await this.bondedToken.balanceOf(alice)).toString().should.eq('110');
      (await this.curve.currentMintedTokens()).toString().should.eq('111');
      (await this.curve.currentCollateral()).toString().should.eq('12321');
    });
  });
});
