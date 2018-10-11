const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow');
const EquationMock = artifacts.require('EquationMock');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('EquationMock', ([_, owner]) => {
  context('Simple equation x + 7', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new({ from: owner });
      await this.contract.init([3, 1, 0, 7]);
    });

    it('should return 12 if x equal 5', async () => {
      const value = await this.contract.getPrice(5);
      value.should.be.bignumber.eq(12);
    });

    it('should return 17 if x equal 10', async () => {
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(17);
    });
  });

  context('Quadratic equation x^2 - 3', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new({ from: owner });
      await this.contract.init([4, 8, 1, 0, 2, 0, 3]);
    });

    it('should return 97 if x equal 10', async () => {
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(97);
    });

    it('should return 3133 if x equal 56', async () => {
      const value = await this.contract.getPrice(56);
      value.should.be.bignumber.eq(3133);
    });

    it('should throw if value less than 0', async () => {
      await expectThrow(this.contract.getPrice(1));
    });
  });

  context('Incomplete equation x + ', () => {
    it('should throw if operand miss', async () => {
      await expectThrow(this.contract.init([3, 1]));
    });
  });

  context('Incomplete equation 4 * x 3', () => {
    it('should throw if operand exceed', async () => {
      await expectThrow(this.contract.init([5, 0, 4, 1, 0, 3]));
    });
  });

  context('Square root equation 4x(sqrt(x+3)) + 2x - 17', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new({ from: owner });
      await this.contract.init([4, 3, 5, 5, 0, 4, 1, 2, 3, 1, 0, 3, 5, 0, 2, 1, 0, 17]);
    });

    it('should return 33 if x equal 5', async () => {
      const value = await this.contract.getPrice(5);
      value.should.be.bignumber.eq(33);
    });

    it('should return 67 if x equal 6', async () => {
      const value = await this.contract.getPrice(6);
      value.should.be.bignumber.eq(67);
    });
  });
});
