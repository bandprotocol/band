const { shouldFail, time } = require('openzeppelin-test-helpers');

const BondingCurveMock = artifacts.require('BondingCurveMock');
const ParameterizedBondingCurve = artifacts.require(
  'ParameterizedBondingCurve',
);
const BandMockExchange = artifacts.require('BandMockExchange');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const CommunityToken = artifacts.require('CommunityToken');
const Equation = artifacts.require('Equation');
const ERC20Base = artifacts.require('ERC20Base');
const Parameters = artifacts.require('Parameters');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');

require('chai').should();

contract('BondingCurveMock', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    await BondingCurveMock.link(Equation, await Equation.deployed());
    this.band = await BandToken.new({ from: owner });
    await this.band.mint(owner, 100000000, { from: owner });
    this.exchange = await BandMockExchange.new(this.band.address, {
      from: owner,
    });
    this.factory = await BandRegistry.new(
      this.band.address,
      this.exchange.address,
      { from: owner },
    );
    this.tcdFactory = await CommunityFactory.new(this.factory.address, {
      from: owner,
    });
    this.collateralToken = await ERC20Base.new('CollateralToken', 'CLT', {
      from: owner,
    });
    this.bondedToken = await ERC20Base.new('BondedToken', 'BDT', {
      from: owner,
    });
    this.expression = await BondingCurveExpression.new([8, 1, 0, 2]);
    const data = await this.tcdFactory.create(
      'CoinHatcher',
      'CHT',
      this.expression.address,
      '0',
      '60',
      '200000000000000000',
      '500000000000000000',
      { from: owner },
    );
    this.params = await Parameters.at(data.receipt.logs[2].args.params);
    this.token = await CommunityToken.at(data.receipt.logs[2].args.token);
    this.commCurve = await ParameterizedBondingCurve.at(
      data.receipt.logs[2].args.bondingCurve,
    );
    this.curve = await BondingCurveMock.new(
      this.collateralToken.address,
      this.bondedToken.address,
      this.expression.address,
      { from: owner },
    );
    await this.collateralToken.mint(alice, '100000', { from: owner });
    await this.collateralToken.mint(bob, '100000', { from: owner });
    await this.bondedToken.addMinter(this.curve.address, {
      from: owner,
    });
  });

  context('Basic functionalities', () => {
    it('should allow alice to buy 100 tokens with proper change', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.collateralToken.transferAndCall(
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
        .should.eq('826445312500000000');
    });

    it('should inflate 20 tokens after 2 month', async () => {
      await time.increase(time.duration.days(60));
      const calldata = this.curve.contract.methods.buy(_, 0, 50).encodeABI();
      await this.collateralToken.transferAndCall(
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
        this.curve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      await this.curve.setLiquiditySpread('100000000000000000', {
        from: owner,
      });
    });

    it('should collect revenue of 1 token if Alice buys 10 more tokens', async () => {
      const calldata = this.curve.contract.methods.buy(_, 0, 10).encodeABI();
      await this.collateralToken.transferAndCall(
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
  context('Curve changing', () => {
    it('Expression should be changeable', async () => {
      (await this.expression.evaluate(10)).toString().should.eq('100');
      this.expression = await BondingCurveExpression.new([8, 1, 0, 3]);
      (await this.expression.evaluate(10)).toString().should.eq('1000');
    });
    it('Should adjust curveMultiplier correctly when curve expression is changed', async () => {
      await this.band.transfer(alice, 1000000, { from: owner });
      await this.band.transfer(bob, 1000000, { from: owner });

      (await this.token.balanceOf(alice)).toString().should.eq('0');
      let calldata = this.commCurve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.commCurve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.token.balanceOf(alice)).toString().should.eq('100');
      (await this.band.balanceOf(alice)).toString().should.eq('990000');

      (await this.commCurve.currentMintedTokens()).toString().should.eq('100');
      (await this.commCurve.currentCollateral()).toString().should.eq('10000');
      (await this.commCurve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');

      this.expression = await BondingCurveExpression.new([8, 1, 0, 1]);
      await this.params.setRaw(
        [web3.utils.fromAscii('bonding:curve_expression')],
        [web3.utils.toBN(this.expression.address)],
        { from: owner },
      );
      (await this.commCurve.curveMultiplier())
        .toString()
        .should.eq('100000000000000000000');

      calldata = this.commCurve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        this.commCurve.address,
        10000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );

      (await this.token.balanceOf(alice)).toString().should.eq('200');
      (await this.band.balanceOf(alice)).toString().should.eq('980000');

      (await this.commCurve.currentMintedTokens()).toString().should.eq('200');
      (await this.commCurve.currentCollateral()).toString().should.eq('20000');

      this.expression = await BondingCurveExpression.new([8, 1, 0, 3]);
      await this.params.setRaw(
        [web3.utils.fromAscii('bonding:curve_expression')],
        [web3.utils.toBN(this.expression.address)],
        { from: owner },
      );
      (await this.commCurve.curveMultiplier())
        .toString()
        .should.eq('2500000000000000');

      calldata = this.commCurve.contract.methods.buy(_, 0, 20).encodeABI();
      await this.band.transferAndCall(
        this.commCurve.address,
        6620,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );

      (await this.token.balanceOf(alice)).toString().should.eq('220');
      (await this.band.balanceOf(alice)).toString().should.eq('973380');

      (await this.commCurve.currentMintedTokens()).toString().should.eq('220');
      (await this.commCurve.currentCollateral()).toString().should.eq('26620');
    });
  });
});
