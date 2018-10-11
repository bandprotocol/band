const Counter = artifacts.require('Counter');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Counter', ([_, owner]) => {
  beforeEach(async () => {
    this.contract = await Counter.new({ from: owner });
  });

  it('should return 1 for the first time', async () => {
    const value = await this.contract.count();
    value.should.be.bignumber.eq(1);
  });

  it('should return one more for after calling increase', async () => {
    await this.contract.increase();

    const value = await this.contract.count();
    value.should.be.bignumber.eq(2);
  });
});
