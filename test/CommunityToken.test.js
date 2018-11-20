const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const { increase, latest } = require('openzeppelin-solidity/test/helpers/time');

const CommunityToken = artifacts.require('CommunityToken');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('CommunityToken', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    this.contract = await CommunityToken.new('CoinHatcher', 'XCH', 36, {
      from: owner,
    });
  });

  it('should contain correct token detail', async () => {
    const name = await this.contract.name();
    const symbol = await this.contract.symbol();
    const decimals = await this.contract.decimals();

    name.should.eq('CoinHatcher');
    symbol.should.eq('XCH');
    decimals.should.bignumber.eq(36);
  });

  context('ERC-20 mint/burn features', () => {
    it('should start with zero supply', async () => {
      const totalSupply = await this.contract.totalSupply();
      totalSupply.should.bignumber.eq(0);

      const ownerBalance = await this.contract.balanceOf(owner);
      ownerBalance.should.bignumber.eq(0);

      const aliceBalance = await this.contract.balanceOf(alice);
      aliceBalance.should.bignumber.eq(0);
    });

    it('should allow only owner to mint tokens', async () => {
      await reverting(this.contract.mint(alice, 1000000, { from: alice }));
      await this.contract.mint(alice, 1000000, { from: owner });

      const totalSupply = await this.contract.totalSupply();
      totalSupply.should.bignumber.eq(1000000);

      const ownerBalance = await this.contract.balanceOf(owner);
      ownerBalance.should.bignumber.eq(0);

      const aliceBalance = await this.contract.balanceOf(alice);
      aliceBalance.should.bignumber.eq(1000000);
    });

    it('should allow transfer of ownership', async () => {
      await reverting(this.contract.mint(alice, 1000000, { from: alice }));
      await this.contract.transferOwnership(alice, { from: owner });
      await this.contract.mint(alice, 1000000, { from: alice });

      const totalSupply = await this.contract.totalSupply();
      totalSupply.should.bignumber.eq(1000000);

      const aliceBalance = await this.contract.balanceOf(alice);
      aliceBalance.should.bignumber.eq(1000000);
    });

    it('should allow only contract owner to burn tokens', async () => {
      await this.contract.mint(owner, 1000000, { from: owner });

      const owner1stBalance = await this.contract.balanceOf(owner);
      owner1stBalance.should.bignumber.eq(1000000);

      await reverting(this.contract.burn(owner, 10, { from: alice }));
      await this.contract.burn(owner, 10, { from: owner });

      const owner2ndBalance = await this.contract.balanceOf(owner);
      owner2ndBalance.should.bignumber.eq(999990);
    });
  });

  context('Historical balance snapshot features', () => {
    it('should give zero balance if account has no activity', async () => {
      await reverting(this.contract.historicalBalanceAtNonce(alice, 1));
      await reverting(this.contract.historicalBalanceAtNonce(alice, 10));

      (await this.contract.historicalBalanceAtTime(
        alice,
        await latest(),
      )).should.bignumber.eq(0);

      (await this.contract.historicalBalanceAtNonce(
        alice,
        0,
      )).should.bignumber.eq(0);
    });

    it('should give correct historical balance at each time', async () => {
      await this.contract.mint(alice, 100, { from: owner });
      const firstTxTime = await latest();
      await increase(100);
      await this.contract.transfer(bob, 10, { from: alice });
      const secondTxTime = await latest();
      await increase(100);
      await this.contract.transfer(alice, 5, { from: bob });
      const thirdTxTime = await latest();

      (await this.contract.historicalBalanceAtNonce(
        alice,
        0,
      )).should.bignumber.eq(0);

      (await this.contract.historicalBalanceAtNonce(
        alice,
        1,
      )).should.bignumber.eq(100);

      (await this.contract.historicalBalanceAtNonce(
        alice,
        2,
      )).should.bignumber.eq(90);

      (await this.contract.historicalBalanceAtNonce(
        alice,
        3,
      )).should.bignumber.eq(95);

      await reverting(this.contract.historicalBalanceAtNonce(alice, 4));

      (await this.contract.historicalBalanceAtTime(
        alice,
        firstTxTime - 1,
      )).should.bignumber.eq(0);

      (await this.contract.historicalBalanceAtTime(
        alice,
        firstTxTime,
      )).should.bignumber.eq(100);

      (await this.contract.historicalBalanceAtTime(
        alice,
        firstTxTime + 1,
      )).should.bignumber.eq(100);

      (await this.contract.historicalBalanceAtTime(
        alice,
        secondTxTime,
      )).should.bignumber.eq(90);

      (await this.contract.historicalBalanceAtTime(
        alice,
        secondTxTime + 1,
      )).should.bignumber.eq(90);

      (await this.contract.historicalBalanceAtTime(
        alice,
        thirdTxTime,
      )).should.bignumber.eq(95);

      (await this.contract.historicalBalanceAtTime(
        alice,
        thirdTxTime + 1,
      )).should.bignumber.eq(95);
    });
  });
});
