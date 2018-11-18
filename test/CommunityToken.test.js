const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');

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
    decimals.should.bignumber.eq(new BigNumber(36));
  });

  it('should start with zero supply', async () => {
    const totalSupply = await this.contract.totalSupply();
    totalSupply.should.bignumber.eq(new BigNumber(0));

    const ownerBalance = await this.contract.balanceOf(owner);
    ownerBalance.should.bignumber.eq(new BigNumber(0));

    const aliceBalance = await this.contract.balanceOf(alice);
    aliceBalance.should.bignumber.eq(new BigNumber(0));
  });

  it('should allow only minter to mint tokens', async () => {
    await reverting(this.contract.mint(alice, 1000000, { from: alice }));
    await this.contract.mint(alice, 1000000, { from: owner });

    const totalSupply = await this.contract.totalSupply();
    totalSupply.should.bignumber.eq(new BigNumber(1000000));

    const ownerBalance = await this.contract.balanceOf(owner);
    ownerBalance.should.bignumber.eq(new BigNumber(0));

    const aliceBalance = await this.contract.balanceOf(alice);
    aliceBalance.should.bignumber.eq(new BigNumber(1000000));
  });

  it('should allow transfer of minter', async () => {
    await reverting(this.contract.mint(alice, 1000000, { from: alice }));
    await this.contract.transferOwnership(alice, { from: owner });
    await this.contract.mint(alice, 1000000, { from: alice });

    const totalSupply = await this.contract.totalSupply();
    totalSupply.should.bignumber.eq(new BigNumber(1000000));

    const aliceBalance = await this.contract.balanceOf(alice);
    aliceBalance.should.bignumber.eq(new BigNumber(1000000));
  });

  it('should allow only minter to burn tokens', async () => {
    await this.contract.mint(owner, 1000000, { from: owner });

    const owner1stBalance = await this.contract.balanceOf(owner);
    owner1stBalance.should.bignumber.eq(new BigNumber(1000000));

    await reverting(this.contract.burn(owner, 10, { from: alice }));
    await this.contract.burn(owner, 10, { from: owner });

    const owner2ndBalance = await this.contract.balanceOf(owner);
    owner2ndBalance.should.bignumber.eq(new BigNumber(999990));
  });
});
