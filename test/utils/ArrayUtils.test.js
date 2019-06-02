const { shouldFail } = require('openzeppelin-test-helpers');
const ArrayUtilsMock = artifacts.require('ArrayUtilsMock');

contract('ArrayUtilsMock', ([owner]) => {
  beforeEach(async () => {
    this.contract = await ArrayUtilsMock.new({ from: owner });
  });

  context('Check getMedian functionality', () => {
    it('should revert on empty array', async () => {
      await shouldFail.reverting(this.contract.getMedian([]));
    });

    it('should compute median correctly on odd-length array', async () => {
      (await this.contract.getMedian([10, 20, 30, 40, 50]))
        .toString()
        .should.eq('30');
      (await this.contract.getMedian([30, 10, 50, 20, 40]))
        .toString()
        .should.eq('30');
      (await this.contract.getMedian([50, 50, 30, 20, 10]))
        .toString()
        .should.eq('30');
    });

    it('should compute median correctly on even-length array', async () => {
      (await this.contract.getMedian([10, 20, 30, 40]))
        .toString()
        .should.eq('25');
      (await this.contract.getMedian([30, 10, 20, 40]))
        .toString()
        .should.eq('25');
      (await this.contract.getMedian([50, 50, 10, 10]))
        .toString()
        .should.eq('30');
      (await this.contract.getMedian([1, 2])).toString().should.eq('1');
    });
  });

  context('Check getMajority functionality', () => {
    it('should revert on empty array', async () => {
      await shouldFail.reverting(this.contract.getMajority([]));
    });

    it('should revert if there is no clear majority', async () => {
      await shouldFail.reverting(this.contract.getMajority([10, 20]));
      await shouldFail.reverting(this.contract.getMajority([10, 20, 30]));
      await shouldFail.reverting(this.contract.getMajority([10, 20, 30, 40]));
      await shouldFail.reverting(this.contract.getMajority([20, 10, 20, 10]));
      await shouldFail.reverting(
        this.contract.getMajority([5, 20, 10, 20, 10]),
      );
    });

    it('should correctly return majority if one exists', async () => {
      (await this.contract.getMajority([10])).toString().should.eq('10');
      (await this.contract.getMajority([10, 10])).toString().should.eq('10');
      (await this.contract.getMajority([5, 10, 10])).toString().should.eq('10');
      (await this.contract.getMajority([10, 5, 10])).toString().should.eq('10');
      (await this.contract.getMajority([1, 10, 5, 10, 10]))
        .toString()
        .should.eq('10');
    });
  });
});
