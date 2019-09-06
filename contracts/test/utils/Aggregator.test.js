const { shouldFail } = require('openzeppelin-test-helpers');
const MedianAggregator = artifacts.require('MedianAggregator');
const MajorityAggregator = artifacts.require('MajorityAggregator');

contract('Aggregator', ([owner]) => {
  beforeEach(async () => {
    this.median = await MedianAggregator.new({ from: owner });
    this.majority = await MajorityAggregator.new({ from: owner });
  });

  context('Check getMedian functionality', () => {
    it('should revert on empty array', async () => {
      expect((await this.median.aggregate([], 0))[1]).to.eq(false);
    });

    it('should compute median correctly on odd-length array', async () => {
      expect(
        (await this.median.aggregate([10, 20, 30, 40, 50], 5))[0].toString(),
      ).to.eq('30');
      expect(
        (await this.median.aggregate([30, 10, 50, 20, 40], 5))[0].toString(),
      ).to.eq('30');
      expect(
        (await this.median.aggregate([50, 50, 30, 20, 10], 5))[0].toString(),
      ).to.eq('30');
    });

    it('should compute median correctly on even-length array', async () => {
      expect(
        (await this.median.aggregate([10, 20, 30, 40], 4))[0].toString(),
      ).to.eq('25');
      expect(
        (await this.median.aggregate([30, 10, 20, 40], 4))[0].toString(),
      ).to.eq('25');
      expect(
        (await this.median.aggregate([50, 50, 10, 10], 4))[0].toString(),
      ).to.eq('30');
      expect((await this.median.aggregate([1, 2], 2))[0].toString()).to.eq('1');
    });
  });

  context('Check getMajority functionality', () => {
    it('should revert on empty array', async () => {
      expect((await this.majority.aggregate([], 0))[1]).to.eq(false);
    });

    it('should revert if there is no clear majority', async () => {
      expect((await this.majority.aggregate([10, 20], 2))[1]).to.eq(false);
      expect((await this.majority.aggregate([10, 20, 30], 3))[1]).to.eq(false);
      expect((await this.majority.aggregate([10, 20, 30, 40], 4))[1]).to.eq(
        false,
      );
      expect((await this.majority.aggregate([20, 10, 20, 10], 4))[1]).to.eq(
        false,
      );
      expect((await this.majority.aggregate([5, 20, 10, 20, 10], 5))[1]).to.eq(
        false,
      );
    });

    it('should correctly return majority if one exists', async () => {
      expect((await this.majority.aggregate([10], 1))[0].toString()).to.eq(
        '10',
      );
      expect((await this.majority.aggregate([10, 10], 2))[0].toString()).to.eq(
        '10',
      );
      expect(
        (await this.majority.aggregate([5, 10, 10], 3))[0].toString(),
      ).to.eq('10');
      expect(
        (await this.majority.aggregate([10, 5, 10], 3))[0].toString(),
      ).to.eq('10');
      expect(
        (await this.majority.aggregate([1, 10, 5, 10, 10], 5))[0].toString(),
      ).to.eq('10');
    });
  });
});
