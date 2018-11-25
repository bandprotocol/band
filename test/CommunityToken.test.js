const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const { increase, latest } = require('openzeppelin-solidity/test/helpers/time');

const CommunityToken = artifacts.require('CommunityToken');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('CommunityToken', ([_, owner, alice, bob, carol]) => {
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

  context('Historical voting power snapshot features', () => {
    it('should give zero balance if account has no activity', async () => {
      await reverting(this.contract.historicalVotingPowerAtNonce(alice, 1));
      await reverting(this.contract.historicalVotingPowerAtNonce(alice, 10));

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        await latest(),
      )).should.bignumber.eq(0);

      (await this.contract.historicalVotingPowerAtNonce(
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

      (await this.contract.historicalVotingPowerAtNonce(
        alice,
        0,
      )).should.bignumber.eq(0);

      (await this.contract.historicalVotingPowerAtNonce(
        alice,
        1,
      )).should.bignumber.eq(100);

      (await this.contract.historicalVotingPowerAtNonce(
        alice,
        2,
      )).should.bignumber.eq(90);

      (await this.contract.historicalVotingPowerAtNonce(
        alice,
        3,
      )).should.bignumber.eq(95);

      await reverting(this.contract.historicalVotingPowerAtNonce(alice, 4));

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        firstTxTime - 1,
      )).should.bignumber.eq(0);

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        firstTxTime,
      )).should.bignumber.eq(100);

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        firstTxTime + 1,
      )).should.bignumber.eq(100);

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        secondTxTime,
      )).should.bignumber.eq(90);

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        secondTxTime + 1,
      )).should.bignumber.eq(90);

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        thirdTxTime,
      )).should.bignumber.eq(95);

      (await this.contract.historicalVotingPowerAtTime(
        alice,
        thirdTxTime + 1,
      )).should.bignumber.eq(95);
    });
  });

  context('Vote delegation feature', async () => {
    beforeEach(async () => {
      await this.contract.mint(alice, 1, { from: owner });
      await this.contract.mint(bob, 10, { from: owner });
      await this.contract.mint(carol, 100, { from: owner });
    });

    it('should delegate vote one level correct', async () => {
      await this.contract.delegateVote(bob, { from: alice });
      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(0);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(11);

      await this.contract.mint(alice, 2, { from: owner });
      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(0);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(13);
    });

    it('should not delegate recursively', async () => {
      await this.contract.delegateVote(bob, { from: alice });
      await this.contract.delegateVote(carol, { from: bob });

      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(0);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(1);
      (await this.contract.votingPowerOf(carol)).should.bignumber.eq(110);
    });

    it('should change delegated voting power upon balance change', async () => {
      await this.contract.delegateVote(bob, { from: alice });
      await this.contract.transfer(alice, 50, { from: carol });
      await this.contract.transfer(bob, 5, { from: carol });
      await this.contract.transfer(carol, 1, { from: bob });

      (await this.contract.balanceOf(alice)).should.bignumber.eq(51);
      (await this.contract.balanceOf(bob)).should.bignumber.eq(14);
      (await this.contract.balanceOf(carol)).should.bignumber.eq(46);

      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(0);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(65);
      (await this.contract.votingPowerOf(carol)).should.bignumber.eq(46);
    });

    it('should revoke delegate vote correctly', async () => {
      await this.contract.delegateVote(bob, { from: alice });
      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(0);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(11);

      await this.contract.transfer(alice, 50, { from: carol });
      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(0);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(61);

      await reverting(this.contract.revokeDelegateVote(carol, { from: alice }));
      await this.contract.revokeDelegateVote(bob, { from: alice });
      (await this.contract.votingPowerOf(alice)).should.bignumber.eq(51);
      (await this.contract.votingPowerOf(bob)).should.bignumber.eq(10);
    });
  });
});
