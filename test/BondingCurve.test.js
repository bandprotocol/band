const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow');

const BandToken = artifacts.require('BandToken');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BigNumber = web3.BigNumber;


require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('BondingCurve', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new(1000000, { from: owner });
    this.comm = await CommunityToken.new(
      'CoinHatcher', 'XCH', 18, { from: owner });
    // X ^ 2 curve
    this.curve = await BondingCurve.new(
      this.band.address, this.comm.address, [8, 1, 0, 2], { from: owner });

    await this.comm.transferOwnership(this.curve.address, { from: owner });
  });

  it('should allow anyone to buy and sell community tokens', async () => {
    await expectThrow(this.curve.buy(100,  9000, { from: bob }));
    await expectThrow(this.curve.buy(100, 11000, { from: bob }));

    await this.band.transfer(bob, 100000, { from: owner });
    await expectThrow(this.curve.buy(100,  9000, { from: bob }));
    await expectThrow(this.curve.buy(100, 11000, { from: bob }));

    await this.band.approve(this.curve.address, 100000, { from: bob });
    await expectThrow(this.curve.buy(100,  9000, { from: bob }));
    await this.curve.buy(100, 11000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(90000));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(100));
    (await this.curve.inflationRatio()).should.bignumber.eq(new BigNumber(1000000000));

    await this.curve.buy(1, 10000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(89799));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(101));
    (await this.curve.inflationRatio()).should.bignumber.eq(new BigNumber(1000000000));

    await expectThrow(this.curve.sell(10, 1900, { from: carol }));
    await expectThrow(this.curve.sell(10, 2000, { from: bob }));
    await this.curve.sell(10, 1900, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(91719));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(91));
  });

  it('should allow only owner to inflate and deflate the system', async () => {
    this.band.approve(this.curve.address, 100000, { from: owner });
    await this.curve.buy(100, 10000, { from: owner });

    (await this.band.balanceOf(owner)).should.bignumber.eq(new BigNumber(990000));
    (await this.comm.balanceOf(owner)).should.bignumber.eq(new BigNumber(100));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(0));

    await expectThrow(this.curve.inflate(10, bob, { from: bob }));
    await this.curve.inflate(10, bob, { from: owner });

    (await this.band.balanceOf(owner)).should.bignumber.eq(new BigNumber(990000));
    (await this.comm.balanceOf(owner)).should.bignumber.eq(new BigNumber(100));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(10));
    (await this.curve.inflationRatio()).should.bignumber.eq(new BigNumber(826446280));

    await expectThrow(this.curve.deflate(1, bob, { from: bob }));
    await expectThrow(this.curve.deflate(100, bob, { from: owner }));
    await this.curve.deflate(5, bob, { from: owner });

    (await this.band.balanceOf(owner)).should.bignumber.eq(new BigNumber(990000));
    (await this.comm.balanceOf(owner)).should.bignumber.eq(new BigNumber(100));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(5));
    (await this.curve.inflationRatio()).should.bignumber.eq(new BigNumber(907029478));

    await this.curve.sell(50, 0, { from: owner });
    (await this.band.balanceOf(owner)).should.bignumber.eq(new BigNumber(997256));
    (await this.comm.balanceOf(owner)).should.bignumber.eq(new BigNumber(50));
  });
});
