const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow');
const { increaseTimeTo, duration } = require('openzeppelin-solidity/test/helpers/increaseTime');
const { latestTime } = require('openzeppelin-solidity/test/helpers/latestTime');

const AdminTCR = artifacts.require('AdminTCR');
const BandToken = artifacts.require('BandToken');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BigNumber = web3.BigNumber;


require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('CommunityCore', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new(1000000, { from: owner });
    this.comm = await CommunityToken.new(
      'CoinHatcher', 'XCH', 18, { from: owner });
    this.params = await Parameters.new(this.comm.address,
      [
        "params:proposal_expiration_time",
        "params:proposal_pass_percentage",
      ],
      [
        86400,
        80,
      ],
      { from: owner });
    this.admin = await AdminTCR.new(this.params.address, { from: owner });

    // X ^ 2 core
    this.core = await CommunityCore.new(
      this.admin.address,
      this.band.address,
      this.params.address,
      [8, 1, 0, 2], { from: owner });
    await this.comm.transferOwnership(this.core.address, { from: owner });
  });

  it('should auto-inflate properly', async () => {
    await this.band.transfer(bob, 100000, { from: owner });
    await this.band.approve(this.core.address, 50000, { from: bob });
    await this.core.buy(100, 20000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(90000));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(100));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(1000000000000));

    // 10% per month inflation
    await this.params.propose(["core:inflation_ratio"], [38581], { from: bob });
    await this.params.vote(1, 0, { from: bob });

    // One month has passed
    await increaseTimeTo((await latestTime()) + duration.days(30));
    await this.core.buy(10, 20000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(88100));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(110));
    (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(new BigNumber(10));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(826446280991));
  });

  it('should collect tax properly', async () => {
    await this.band.transfer(bob, 100000, { from: owner });
    await this.band.approve(this.core.address, 50000, { from: bob });
    await this.core.buy(100, 20000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(90000));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(100));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(1000000000000));

    // 20% sales tax
    await this.params.propose(["core:sales_tax"], [200000000000], { from: bob });
    await this.params.vote(1, 0, { from: bob });

    await this.core.sell(15, 1000, { from: bob });
    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(92256));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(85));
    (await this.comm.balanceOf(this.core.address)).should.bignumber.eq(new BigNumber(3));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(1000000000000));
  });

  it('should allow anyone to buy and sell community tokens', async () => {
    await expectThrow(this.core.buy(100,  9000, { from: bob }));
    await expectThrow(this.core.buy(100, 11000, { from: bob }));

    await this.band.transfer(bob, 100000, { from: owner });
    await expectThrow(this.core.buy(100,  9000, { from: bob }));
    await expectThrow(this.core.buy(100, 11000, { from: bob }));

    await this.band.approve(this.core.address, 100000, { from: bob });
    await expectThrow(this.core.buy(100,  9000, { from: bob }));
    await this.core.buy(100, 11000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(90000));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(100));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(1000000000000));

    await this.core.buy(1, 10000, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(89799));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(101));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(1000000000000));

    await expectThrow(this.core.sell(10, 1900, { from: carol }));
    await expectThrow(this.core.sell(10, 2000, { from: bob }));
    await this.core.sell(10, 1900, { from: bob });

    (await this.band.balanceOf(bob)).should.bignumber.eq(new BigNumber(91719));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(91));
  });

  it('should allow only admin to deflate the system', async () => {
    await this.band.transfer(bob, 50000, { from: owner });
    this.band.approve(this.core.address, 100000, { from: owner });
    this.band.approve(this.core.address, 100000, { from: bob });
    await this.core.buy(50, 10000, { from: owner });
    await this.core.buy(50, 10000, { from: bob });

    (await this.comm.balanceOf(owner)).should.bignumber.eq(new BigNumber(50));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(50));

    await expectThrow(this.core.deflate(200, { from: owner }));
    await expectThrow(this.core.deflate(5, { from: bob }));
    await this.core.deflate(5, { from: owner });

    (await this.comm.balanceOf(owner)).should.bignumber.eq(new BigNumber(45));
    (await this.comm.balanceOf(bob)).should.bignumber.eq(new BigNumber(50));
    (await this.core.curveMultiplier()).should.bignumber.eq(new BigNumber(1108033240997));
  });
});
