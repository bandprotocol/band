const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow');
const { increaseTimeTo } = require('openzeppelin-solidity/test/helpers/increaseTime');
const { latestTime } = require('openzeppelin-solidity/test/helpers/latestTime');

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
    it('should only allow valid token transfer', async() => {
      await this.contract.transfer(bob, 100, { from: alice });
      await expectThrow(this.contract.transfer(bob, 1000, { from: alice }));

      (await this.contract.balanceOf(alice)).should.bignumber.eq(new BigNumber(900));
      (await this.contract.balanceOf(bob)).should.bignumber.eq(new BigNumber(100));
    });

    it('should only allow valid transferFrom', async() => {
      await expectThrow(this.contract.transferFrom(alice, bob, 100, { from: bob }));
      await this.contract.approve(bob, 100, { from: alice });

      await expectThrow(this.contract.transferFrom(alice, bob, 200, { from: bob }));
      await this.contract.transferFrom(alice, bob, 100, { from: bob });

      (await this.contract.balanceOf(alice)).should.bignumber.eq(new BigNumber(900));
      (await this.contract.balanceOf(bob)).should.bignumber.eq(new BigNumber(100));
    });
  });

  context('With one year token locking, starting 2019/02, with 3 month cliff', async () => {
    beforeEach(async () => {
      await this.contract.setTokenLock(alice, 13, 16, 25, 1000, { from: owner });
    });

    it('should only allow transfer after the cliff ends', async() => {
      await increaseTimeTo(1550188800);  // 2019/02/15
      await expectThrow(this.contract.transfer(bob, 1, { from: alice }));
      await increaseTimeTo(1552608000);  // 2019/03/15
      await expectThrow(this.contract.transfer(bob, 1, { from: alice }));
      await increaseTimeTo(1555286400);  // 2019/04/15
      await expectThrow(this.contract.transfer(bob, 1, { from: alice }));
      await increaseTimeTo(1557878400);  // 2019/05/15
      (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(new BigNumber(250));
      await this.contract.transfer(bob, 150, { from: alice });
      (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(new BigNumber(100));
      await expectThrow(this.contract.transfer(bob, 150, { from: alice }));
      await increaseTimeTo(1579046400);  // 2020/01/15
      (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(new BigNumber(767));
      await increaseTimeTo(1580515200);  // 2020/02/01
      (await this.contract.unlockedBalanceOf(alice)).should.bignumber.eq(new BigNumber(850));
    });
  });
});
