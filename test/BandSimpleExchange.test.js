const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BandSimpleExchange = artifacts.require('BandSimpleExchange');

require('chai').should();

contract('BandSimpleExchange', ([owner, alice]) => {
  beforeEach(async () => {
    this.band = await BandToken.new({ from: owner });
    this.bse = await BandSimpleExchange.new(this.band.address, { from: owner });
    await this.bse.setExchangeRate('10000000000000000000', { from: owner });
    await this.band.mint(owner, 100000000, { from: owner });
    await this.band.transfer(alice, 10000000, { from: owner });
  });

  context('Exchange Basic Functionality', () => {
    it('check owner of the exchange', async () => {
      (await this.bse.owner()).toString().should.eq(owner);
    });
    it('Owner should be able to add BandToken to exchange', async () => {
      const ownerPrevBalance = await this.band.balanceOf(owner);

      await this.band.transfer(this.bse.address, 50000, { from: owner });

      (await this.band.balanceOf(owner))
        .toNumber()
        .should.eq(ownerPrevBalance - 50000);
      (await this.band.balanceOf(this.bse.address)).toNumber().should.eq(50000);
    });
    it('Owner can set exchange rate', async () => {
      (await this.bse.exchangeRate())
        .toString()
        .should.eq('10000000000000000000');
      await this.bse.setExchangeRate('5000000000000000000', { from: owner });
      (await this.bse.exchangeRate())
        .toString()
        .should.eq('5000000000000000000');
    });
    it('ExchangeRate cant be set by none owner address', async () => {
      await shouldFail.reverting(
        this.bse.setExchangeRate('5000000000000000000', { from: alice }),
      );
    });
    it('Can convert ETH to BandToken', async () => {
      await this.bse.setExchangeRate('1000000000000000000000', { from: owner });
      await this.band.transfer(this.bse.address, 10000000, { from: owner });

      (await this.band.balanceOf(owner)).toString().should.eq('80000000');
      (await this.band.balanceOf(this.bse.address))
        .toString()
        .should.eq('10000000');

      await this.bse.convertFromEthToBand({ from: owner, value: 9000 });

      (await this.band.balanceOf(owner)).toString().should.eq('89000000');
      (await this.band.balanceOf(this.bse.address))
        .toString()
        .should.eq('1000000');
    });
  });
});
