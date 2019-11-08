const { expectRevert, time } = require('openzeppelin-test-helpers');

const BondingCurveInvertableMock = artifacts.require(
  'BondingCurveInvertableMock',
);
const BandMockExchange = artifacts.require('BandMockExchange');
const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const CommunityToken = artifacts.require('CommunityToken');
const Equation = artifacts.require('Equation');
const ERC20Base = artifacts.require('ERC20Base');
const Parameters = artifacts.require('Parameters');
const ExpressionBinarySearch = artifacts.require('ExpressionBinarySearch');
const CommunityFactory = artifacts.require('CommunityFactory');

require('chai').should();

contract('BondingCurveInvertableMock', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    await BondingCurveInvertableMock.link(Equation, await Equation.deployed());
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
    this.expression = await ExpressionBinarySearch.new();
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
    this.curve = await BondingCurveInvertableMock.new(
      this.collateralToken.address,
      this.bondedToken.address,
      this.expression.address,
      { from: owner },
    );
    // mint 100000 CLT for Alice
    await this.collateralToken.mint(alice, '1000000', {
      from: owner,
    });
    // mint 100000 CLT for Bob
    await this.collateralToken.mint(bob, '1000000', {
      from: owner,
    });
    await this.bondedToken.addMinter(this.curve.address, {
      from: owner,
    });
  });

  context('Basic getter', () => {
    it('should getBuyPric correctly', async () => {
      (await this.curve.getBuyPrice('74187226942141337233439', {
        from: owner,
      }))
        .toString()
        .should.eq('100');
      // test 1e18
      (await this.curve.getBuyPrice('2950509385336918631423076', {
        from: owner,
      }))
        .toString()
        .should.eq('1000000000000000000');
    });
    it('should getBuyPriceByCollateral correctly', async () => {
      (await this.curve.getBuyPriceByCollateral('100', {
        from: owner,
      }))
        .toString()
        .should.eq('74187226942141337233439');
      // test 1e18
      (await this.curve.getBuyPriceByCollateral('1000000000000000000', {
        from: owner,
      }))
        .toString()
        .should.eq('2950509385336918631423076');
    });
  });

  context('Buying on BondingCurveInvertableMock', () => {
    beforeEach(async () => {
      await this.collateralToken.approve(this.curve.address, '1000000', {
        from: alice,
      });
      await this.collateralToken.approve(this.curve.address, '1000000', {
        from: bob,
      });
    });
    it('should be able to buy token', async () => {
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('1000000');
      await this.curve.buy(alice, '100', '74187226942141337233439', {
        from: alice,
      });
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('999900');
      (await this.bondedToken.balanceOf(alice))
        .toString()
        .should.eq('74187226942141337233439');
    });
    it('should be able to buy with specific collateral token amount', async () => {
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('1000000');
      await this.curve.buyWithCollateral(
        alice,
        '74187226942141337233439',
        '100',
        {
          from: alice,
        },
      );
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('999900');
      (await this.bondedToken.balanceOf(alice))
        .toString()
        .should.eq('74187226942141337233439');
    });
    it('should get less tokens than previous buyer with the same amount of collateral token', async () => {
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('1000000');
      await this.curve.buyWithCollateral(
        alice,
        '74187226942141337233439',
        '100',
        {
          from: alice,
        },
      );
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('999900');
      (await this.bondedToken.balanceOf(alice))
        .toString()
        .should.eq('74187226942141337233439');
      (await this.collateralToken.balanceOf(bob))
        .toString()
        .should.eq('1000000');
      await this.curve.buyWithCollateral(bob, '5285223862054238094657', '100', {
        from: bob,
      });
      (await this.collateralToken.balanceOf(bob))
        .toString()
        .should.eq('999900');
      (await this.bondedToken.balanceOf(bob))
        .toString()
        .should.eq('5285223862054238094657');
    });
    it('should fail if amount of bonded token is less than price limmit', async () => {
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('1000000');
      await expectRevert.unspecified(
        // 74187226942141337233440 = 74187226942141337233439 + 1
        this.curve.buyWithCollateral(alice, '74187226942141337233440', '100', {
          from: alice,
        }),
      );
      (await this.collateralToken.balanceOf(alice))
        .toString()
        .should.eq('1000000');
      (await this.bondedToken.balanceOf(alice)).toString().should.eq('0');
    });
  });
});
