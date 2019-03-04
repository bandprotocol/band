const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const { increase } = require('openzeppelin-solidity/test/helpers/time');

const CommunityToken = artifacts.require('CommunityToken');
const BandFactory = artifacts.require('BandFactory');

require('chai').should();

contract('CommunityToken', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.contract = await CommunityToken.new('CoinHatcher', 'XCH', 36, {
      from: owner,
    });
    this.factory = await BandFactory.deployed();
  });

  it('should contain correct token detail', async () => {
    const name = await this.contract.name();
    const symbol = await this.contract.symbol();
    const decimals = await this.contract.decimals();

    name.should.eq('CoinHatcher');
    symbol.should.eq('XCH');
    decimals.toString().should.eq('36');
  });

  context('ERC-20 mint/burn features', () => {
    it('should start with zero supply', async () => {
      const totalSupply = await this.contract.totalSupply();
      totalSupply.toString().should.eq('0');

      const ownerBalance = await this.contract.balanceOf(owner);
      ownerBalance.toString().should.eq('0');

      const aliceBalance = await this.contract.balanceOf(alice);
      aliceBalance.toString().should.eq('0');
    });

    it('should allow only owner to mint tokens', async () => {
      await reverting(this.contract.mint(alice, 1000000, { from: alice }));
      await this.contract.mint(alice, 1000000, { from: owner });

      const totalSupply = await this.contract.totalSupply();
      totalSupply.toString().should.eq('1000000');

      const ownerBalance = await this.contract.balanceOf(owner);
      ownerBalance.toString().should.eq('0');

      const aliceBalance = await this.contract.balanceOf(alice);
      aliceBalance.toString().should.eq('1000000');
    });

    it('should allow transfer of ownership', async () => {
      await reverting(this.contract.mint(alice, 1000000, { from: alice }));
      await this.contract.transferOwnership(alice, { from: owner });
      await this.contract.mint(alice, 1000000, { from: alice });

      const totalSupply = await this.contract.totalSupply();
      totalSupply.toString().should.eq('1000000');

      const aliceBalance = await this.contract.balanceOf(alice);
      aliceBalance.toString().should.eq('1000000');
    });

    it('should allow only contract owner to burn tokens', async () => {
      await this.contract.mint(owner, 1000000, { from: owner });

      const owner1stBalance = await this.contract.balanceOf(owner);
      owner1stBalance.toString().should.eq('1000000');

      await reverting(this.contract.burn(owner, 10, { from: alice }));
      await this.contract.burn(owner, 10, { from: owner });

      const owner2ndBalance = await this.contract.balanceOf(owner);
      owner2ndBalance.toString().should.eq('999990');
    });
  });

  it('should be able to transfer feelessly', async () => {
    await this.contract.setExecDelegator(this.factory.address);

    await this.contract.mint(alice, 100, { from: owner });
    await this.contract.mint(bob, 100, { from: owner });
    await this.contract.mint(carol, 100, { from: owner });

    const cap = {
      alice: (await this.contract.balanceOf(alice)).toNumber(),
      bob: (await this.contract.balanceOf(bob)).toNumber(),
      carol: (await this.contract.balanceOf(carol)).toNumber(),
    };
    const nonce = {
      alice: (await this.factory.execNonces(alice)).toNumber(),
      bob: (await this.factory.execNonces(bob)).toNumber(),
      carol: (await this.factory.execNonces(owner)).toNumber(),
    };

    let data = this.contract.contract.methods
      .transferFeeless(alice, carol, 20)
      .encodeABI();
    let dataNoFuncSig = '0x' + data.slice(10 + 64);
    let sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce.alice++, dataNoFuncSig),
      alice,
    );
    await this.factory.sendDelegatedExecution(
      alice,
      this.contract.address,
      '0x' + data.slice(2, 10),
      dataNoFuncSig,
      sig,
      { from: bob },
    );
    (await this.contract.balanceOf(alice))
      .toNumber()
      .should.eq((cap.alice -= 20));
    (await this.contract.balanceOf(carol))
      .toNumber()
      .should.eq((cap.carol += 20));
    (await this.factory.execNonces(alice)).toNumber().should.eq(nonce.alice);

    data = this.contract.contract.methods
      .transferFeeless(bob, carol, 30)
      .encodeABI();
    dataNoFuncSig = '0x' + data.slice(10 + 64);
    sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce.bob++, dataNoFuncSig),
      bob,
    );
    await this.factory.sendDelegatedExecution(
      bob,
      this.contract.address,
      '0x' + data.slice(2, 10),
      dataNoFuncSig,
      sig,
      { from: owner },
    );
    (await this.contract.balanceOf(bob)).toNumber().should.eq((cap.bob -= 30));
    (await this.contract.balanceOf(carol))
      .toNumber()
      .should.eq((cap.carol += 30));
    (await this.factory.execNonces(bob)).toNumber().should.eq(nonce.bob);
  });

  context('Vote delegation feature', async () => {
    beforeEach(async () => {
      await this.contract.mint(alice, 1, { from: owner });
      await this.contract.mint(bob, 10, { from: owner });
      await this.contract.mint(carol, 100, { from: owner });
    });

    it('should delegate vote one level correct', async () => {
      await this.contract.delegateVote(alice, bob, { from: alice });
      (await this.contract.votingPowerOf(alice)).toString().should.eq('0');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('11');

      await this.contract.mint(alice, 2, { from: owner });
      (await this.contract.votingPowerOf(alice)).toString().should.eq('0');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('13');
    });

    it('should not delegate recursively', async () => {
      await this.contract.delegateVote(alice, bob, { from: alice });
      await this.contract.delegateVote(bob, carol, { from: bob });

      (await this.contract.votingPowerOf(alice)).toString().should.eq('0');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('1');
      (await this.contract.votingPowerOf(carol)).toString().should.eq('110');
    });

    it('should change delegated voting power upon balance change', async () => {
      await this.contract.delegateVote(alice, bob, { from: alice });
      await this.contract.transfer(alice, 50, { from: carol });
      await this.contract.transfer(bob, 5, { from: carol });
      await this.contract.transfer(carol, 1, { from: bob });

      (await this.contract.balanceOf(alice)).toString().should.eq('51');
      (await this.contract.balanceOf(bob)).toString().should.eq('14');
      (await this.contract.balanceOf(carol)).toString().should.eq('46');

      (await this.contract.votingPowerOf(alice)).toString().should.eq('0');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('65');
      (await this.contract.votingPowerOf(carol)).toString().should.eq('46');
    });

    it('should revoke delegate vote correctly', async () => {
      await this.contract.delegateVote(alice, bob, { from: alice });
      (await this.contract.votingPowerOf(alice)).toString().should.eq('0');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('11');

      await this.contract.transfer(alice, 50, { from: carol });
      (await this.contract.votingPowerOf(alice)).toString().should.eq('0');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('61');

      await reverting(
        this.contract.revokeDelegateVote(alice, carol, { from: alice }),
      );
      await this.contract.revokeDelegateVote(alice, bob, { from: alice });
      (await this.contract.votingPowerOf(alice)).toString().should.eq('51');
      (await this.contract.votingPowerOf(bob)).toString().should.eq('10');
    });

    it('should be able to delegateVote feelessly', async () => {
      await this.contract.setExecDelegator(this.factory.address);
      const power = {
        alice: (await this.contract.votingPowerOf(alice)).toNumber(),
        bob: (await this.contract.votingPowerOf(bob)).toNumber(),
        carol: (await this.contract.votingPowerOf(carol)).toNumber(),
      };
      const nonce = {
        alice: (await this.factory.execNonces(alice)).toNumber(),
        bob: (await this.factory.execNonces(bob)).toNumber(),
        carol: (await this.factory.execNonces(owner)).toNumber(),
      };
      let data = this.contract.contract.methods
        .delegateVote(alice, carol)
        .encodeABI();
      let dataNoFuncSig = '0x' + data.slice(10 + 64);
      let sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce.alice++, dataNoFuncSig),
        alice,
      );
      await this.factory.sendDelegatedExecution(
        alice,
        this.contract.address,
        '0x' + data.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      );
      data = this.contract.contract.methods
        .delegateVote(bob, carol)
        .encodeABI();
      dataNoFuncSig = '0x' + data.slice(10 + 64);
      sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce.bob++, dataNoFuncSig),
        bob,
      );
      await this.factory.sendDelegatedExecution(
        bob,
        this.contract.address,
        '0x' + data.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: carol },
      );
      (await this.contract.votingPowerOf(carol))
        .toNumber()
        .should.eq(power.alice + power.bob + power.carol);
    });

    it('should be able to revokeDelegateVote feelessly', async () => {
      await this.contract.setExecDelegator(this.factory.address);
      const power = {
        alice: (await this.contract.votingPowerOf(alice)).toNumber(),
        bob: (await this.contract.votingPowerOf(bob)).toNumber(),
        carol: (await this.contract.votingPowerOf(carol)).toNumber(),
      };
      const nonce = {
        alice: (await this.factory.execNonces(alice)).toNumber(),
        bob: (await this.factory.execNonces(bob)).toNumber(),
        carol: (await this.factory.execNonces(owner)).toNumber(),
      };

      await this.contract.delegateVote(alice, carol, { from: alice });
      await this.contract.delegateVote(bob, carol, { from: bob });
      (await this.contract.votingPowerOf(carol))
        .toNumber()
        .should.eq(power.alice + power.bob + power.carol);

      let data = this.contract.contract.methods
        .revokeDelegateVote(alice, carol)
        .encodeABI();
      let dataNoFuncSig = '0x' + data.slice(10 + 64);
      let sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce.alice++, dataNoFuncSig),
        alice,
      );
      await this.factory.sendDelegatedExecution(
        alice,
        this.contract.address,
        '0x' + data.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      );
      data = this.contract.contract.methods
        .revokeDelegateVote(bob, carol)
        .encodeABI();
      dataNoFuncSig = '0x' + data.slice(10 + 64);
      sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce.bob++, dataNoFuncSig),
        bob,
      );
      await this.factory.sendDelegatedExecution(
        bob,
        this.contract.address,
        '0x' + data.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: carol },
      );
      (await this.contract.votingPowerOf(carol))
        .toNumber()
        .should.eq(power.carol);
    });
  });

  context('Historical voting power snapshot features', () => {
    it('should give zero balance if account has no activity', async () => {
      await reverting(this.contract.historicalVotingPowerAtIndex(alice, 1));
      await reverting(this.contract.historicalVotingPowerAtIndex(alice, 10));

      (await this.contract.historicalVotingPowerAtIndex(alice, 0))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtNonce(alice, 0))
        .toString()
        .should.eq('0');

      await reverting(this.contract.historicalVotingPowerAtNonce(alice, 1));
    });

    it('should give correct historical balance at each transfer, mint, and burn', async () => {
      await this.contract.mint(alice, 100, { from: owner });
      await increase(100);
      await this.contract.transfer(bob, 10, { from: alice });
      await increase(100);
      await this.contract.transfer(alice, 5, { from: bob });
      await this.contract.transfer(carol, 8, { from: alice });

      (await this.contract.votingPowerChangeNonce()).toString().should.eq('4');
      (await this.contract.historicalVotingPowerAtIndex(alice, 0))
        .toString()
        .should.eq('0');

      (await this.contract.historicalVotingPowerAtIndex(alice, 1))
        .toString()
        .should.eq('100');

      (await this.contract.historicalVotingPowerAtIndex(alice, 2))
        .toString()
        .should.eq('90');

      (await this.contract.historicalVotingPowerAtIndex(alice, 3))
        .toString()
        .should.eq('95');

      (await this.contract.historicalVotingPowerAtIndex(alice, 4))
        .toString()
        .should.eq('87');

      await reverting(this.contract.historicalVotingPowerAtIndex(alice, 5));

      (await this.contract.historicalVotingPowerAtNonce(alice, 0))
        .toString()
        .should.eq('0');

      (await this.contract.historicalVotingPowerAtNonce(alice, 1))
        .toString()
        .should.eq('100');

      (await this.contract.historicalVotingPowerAtNonce(alice, 2))
        .toString()
        .should.eq('90');

      (await this.contract.historicalVotingPowerAtNonce(alice, 3))
        .toString()
        .should.eq('95');

      (await this.contract.historicalVotingPowerAtNonce(bob, 2))
        .toString()
        .should.eq('10');
      (await this.contract.historicalVotingPowerAtNonce(bob, 3))
        .toString()
        .should.eq('5');
      (await this.contract.historicalVotingPowerAtNonce(bob, 4))
        .toString()
        .should.eq('5');
      await this.contract.mint(alice, 20, { from: owner });

      await this.contract.mint(bob, 10, { from: owner });
      await this.contract.burn(alice, 40, { from: owner });
      await this.contract.burn(bob, 10, { from: owner });

      (await this.contract.historicalVotingPowerAtIndex(alice, 5))
        .toString()
        .should.eq('107');

      (await this.contract.historicalVotingPowerAtIndex(alice, 6))
        .toString()
        .should.eq('67');
      (await this.contract.historicalVotingPowerAtNonce(alice, 5))
        .toString()
        .should.eq('107');
      (await this.contract.historicalVotingPowerAtNonce(alice, 6))
        .toString()
        .should.eq('107');
      (await this.contract.historicalVotingPowerAtNonce(alice, 7))
        .toString()
        .should.eq('67');
      (await this.contract.historicalVotingPowerAtNonce(alice, 8))
        .toString()
        .should.eq('67');
    });

    it('should give correct historical balance when delegate voting power', async () => {
      await this.contract.mint(alice, 100, { from: owner });
      await this.contract.mint(bob, 50, { from: owner });

      await this.contract.delegateVote(bob, alice, { from: bob });

      await this.contract.transfer(carol, 10, { from: alice });

      await this.contract.transfer(carol, 25, { from: bob });

      // Check each item in list
      (await this.contract.historicalVotingPowerAtIndex(alice, 0))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtIndex(alice, 1))
        .toString()
        .should.eq('100');
      (await this.contract.historicalVotingPowerAtIndex(alice, 2))
        .toString()
        .should.eq('150');
      (await this.contract.historicalVotingPowerAtIndex(alice, 3))
        .toString()
        .should.eq('140');
      (await this.contract.historicalVotingPowerAtIndex(alice, 4))
        .toString()
        .should.eq('115');
      await reverting(this.contract.historicalVotingPowerAtIndex(alice, 5));

      (await this.contract.historicalVotingPowerAtIndex(bob, 0))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtIndex(bob, 1))
        .toString()
        .should.eq('50');
      (await this.contract.historicalVotingPowerAtIndex(bob, 2))
        .toString()
        .should.eq('0');
      await reverting(this.contract.historicalVotingPowerAtIndex(bob, 3));

      (await this.contract.historicalVotingPowerAtIndex(carol, 0))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtIndex(carol, 1))
        .toString()
        .should.eq('10');
      (await this.contract.historicalVotingPowerAtIndex(carol, 2))
        .toString()
        .should.eq('35');
      await reverting(this.contract.historicalVotingPowerAtIndex(carol, 3));

      // Find by nonce
      // at nonce 1
      (await this.contract.historicalVotingPowerAtNonce(alice, 1))
        .toString()
        .should.eq('100');
      (await this.contract.historicalVotingPowerAtNonce(bob, 1))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtNonce(carol, 1))
        .toString()
        .should.eq('0');
      // at nonce 2
      (await this.contract.historicalVotingPowerAtNonce(alice, 2))
        .toString()
        .should.eq('100');
      (await this.contract.historicalVotingPowerAtNonce(bob, 2))
        .toString()
        .should.eq('50');
      (await this.contract.historicalVotingPowerAtNonce(carol, 2))
        .toString()
        .should.eq('0');
      // at nonce 3
      (await this.contract.historicalVotingPowerAtNonce(alice, 3))
        .toString()
        .should.eq('150');
      (await this.contract.historicalVotingPowerAtNonce(bob, 3))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtNonce(carol, 3))
        .toString()
        .should.eq('0');
      // at nonce 4
      (await this.contract.historicalVotingPowerAtNonce(alice, 4))
        .toString()
        .should.eq('140');
      (await this.contract.historicalVotingPowerAtNonce(bob, 4))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtNonce(carol, 4))
        .toString()
        .should.eq('10');
      // at nonce 5
      (await this.contract.historicalVotingPowerAtNonce(alice, 5))
        .toString()
        .should.eq('115');
      (await this.contract.historicalVotingPowerAtNonce(bob, 5))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtNonce(carol, 5))
        .toString()
        .should.eq('35');

      // Revoke delegate
      await this.contract.revokeDelegateVote(bob, alice, { from: bob });
      (await this.contract.historicalVotingPowerAtNonce(alice, 6))
        .toString()
        .should.eq('90');
      (await this.contract.historicalVotingPowerAtNonce(bob, 6))
        .toString()
        .should.eq('25');
      (await this.contract.historicalVotingPowerAtNonce(carol, 6))
        .toString()
        .should.eq('35');

      await this.contract.burn(carol, 30, { from: owner });
      (await this.contract.historicalVotingPowerAtNonce(alice, 7))
        .toString()
        .should.eq('90');
      (await this.contract.historicalVotingPowerAtNonce(bob, 7))
        .toString()
        .should.eq('25');
      (await this.contract.historicalVotingPowerAtNonce(carol, 7))
        .toString()
        .should.eq('5');

      // Recheck search on past nonce
      (await this.contract.historicalVotingPowerAtNonce(alice, 4))
        .toString()
        .should.eq('140');
      (await this.contract.historicalVotingPowerAtNonce(bob, 4))
        .toString()
        .should.eq('0');
      (await this.contract.historicalVotingPowerAtNonce(carol, 4))
        .toString()
        .should.eq('10');
    });
  });
});
