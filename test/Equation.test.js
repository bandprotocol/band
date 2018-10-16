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
      await this.contract.init([4, 1, 0, 7]);
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
      await this.contract.init([5, 8, 1, 0, 2, 0, 3]);
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
      await expectThrow(this.contract.init([4, 1]));
    });
  });

  context('Incomplete equation 4 * x 3', () => {
    it('should throw if operand exceed', async () => {
      await expectThrow(this.contract.init([6, 0, 4, 1, 0, 3]));
    });
  });

  context('Square root equation 4x(sqrt(x+3)) + 2x - 17', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new({ from: owner });
      await this.contract.init([5, 4, 6, 6, 0, 4, 1, 2, 4, 1, 0, 3, 6, 0, 2, 1, 0, 17]);
    });

    it('should return 49 if x equal 5', async () => {
      const value = await this.contract.getPrice(5);
      value.should.be.bignumber.eq(49);
    });

    it('should return 67 if x equal 6', async () => {
      const value = await this.contract.getPrice(6);
      value.should.be.bignumber.eq(67);
    });
  });

  context('If-else equation y = 2*x if x < 10 else x^2 - 90', () => {
    beforeEach(async () =>{
      this.contract = await EquationMock.new({from: owner});
      await this.contract.init([17, 11, 1, 0, 10, 6, 0, 2, 1, 5, 8, 1, 0, 2, 0, 90]);
    });

    it('should return 16 if x equal 8', async () =>{
      const value = await this.contract.getPrice(8);
      value.should.be.bignumber.eq(16);
    });

    it('should return 10 if x equal 10', async () =>{
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(10);
    });

    it('should return 249910 if x equal 500', async () =>{
      const value = await this.contract.getPrice(500);
      value.should.be.bignumber.eq(249910);
    });
  });

  context('If-else equation y = 2*x if x < 10 or x > 100 else x^2 - 90', () => {
    beforeEach(async () =>{
      this.contract = await EquationMock.new({from: owner});
      await this.contract.init([17, 16, 11, 1, 0, 10, 12, 1, 0, 100, 6, 0, 2, 1, 5, 8, 1, 0, 2, 0, 90]);
    });

    it('should return 16 if x equal 8', async () =>{
      const value = await this.contract.getPrice(8);
      value.should.be.bignumber.eq(16);
    });

    it('should return 10 if x equal 10', async () =>{
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(10);
    });

    it('should return 1000 if x equal 500', async () =>{
      const value = await this.contract.getPrice(500);
      value.should.be.bignumber.eq(1000);
    });
  });

  context('Wrong operator type ex. (x > 5) * 3', () => {
    it('should throw if use arithmetic operator on bool', async () => {
      await expectThrow(this.contract.init([6, 12, 1, 0, 5, 0, 3]));
    });
  });
});
