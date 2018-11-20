const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');

const EquationMock = artifacts.require('EquationMock');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('EquationMock', ([_, owner]) => {
  context('Invalid equation', () => {
    it('should fail if an operand is missed: (+) (4)', async () => {
      await reverting(EquationMock.new([4, 1], { from: owner }));
    });

    it('should fail if there is an extra term: (*) (4) (x) (3)', async () => {
      await reverting(EquationMock.new([6, 0, 4, 1, 0, 3], { from: owner }));
    });

    it('should fail if typecheck fails: (*) (>) (x) (5) (3)', async () => {
      await reverting(
        EquationMock.new([6, 12, 1, 0, 5, 0, 3], { from: owner }),
      );
    });
  });

  context('Simple equation f(x) = x + 7', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new([4, 1, 0, 7], { from: owner });
    });

    it('should compute f(5) = 12', async () => {
      const value = await this.contract.getPrice(5);
      value.should.be.bignumber.eq(12);
    });

    it('should compute f(10) = 17', async () => {
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(17);
    });
  });

  context('Quadratic equation f(x) = (x ^ 2) - 3', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new([5, 8, 1, 0, 2, 0, 3], {
        from: owner,
      });
    });

    it('should compute f(10) = 97', async () => {
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(97);
    });

    it('should compute f(56) = 3133', async () => {
      const value = await this.contract.getPrice(56);
      value.should.be.bignumber.eq(3133);
    });

    it('should fail on f(1) < 0', async () => {
      await reverting(this.contract.getPrice(1));
    });
  });

  context(
    'Square root equation f(x) = (((4 * x) * sqrt(x + 3)) + (2 * x)) - 17',
    () => {
      beforeEach(async () => {
        this.contract = await EquationMock.new(
          [5, 4, 6, 6, 0, 4, 1, 2, 4, 1, 0, 3, 6, 0, 2, 1, 0, 17],
          { from: owner },
        );
      });

      it('should compute f(5) = 33', async () => {
        const value = await this.contract.getPrice(5);
        value.should.be.bignumber.eq(33);
      });

      it('should compute f(6) = 67', async () => {
        const value = await this.contract.getPrice(6);
        value.should.be.bignumber.eq(67);
      });
    },
  );

  context('If-else equation f(x) = 2 * x if x < 10 else (x ^ 2) - 90', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new(
        [17, 11, 1, 0, 10, 6, 0, 2, 1, 5, 8, 1, 0, 2, 0, 90],
        { from: owner },
      );
    });

    it('should compute f(8) = 16', async () => {
      const value = await this.contract.getPrice(8);
      value.should.be.bignumber.eq(16);
    });

    it('should compute f(10) = 10', async () => {
      const value = await this.contract.getPrice(10);
      value.should.be.bignumber.eq(10);
    });

    it('should compute f(500) = 249910', async () => {
      const value = await this.contract.getPrice(500);
      value.should.be.bignumber.eq(249910);
    });
  });

  context(
    'If-else equation f(x) = 2 * x if x < 10 or x > 100 else x ^ 2 - 90',
    () => {
      beforeEach(async () => {
        this.contract = await EquationMock.new(
          [
            17,
            16,
            11,
            1,
            0,
            10,
            12,
            1,
            0,
            100,
            6,
            0,
            2,
            1,
            5,
            8,
            1,
            0,
            2,
            0,
            90,
          ],
          { from: owner },
        );
      });

      it('should compute f(8) = 16', async () => {
        const value = await this.contract.getPrice(8);
        value.should.be.bignumber.eq(16);
      });

      it('should compute f(10) = 10', async () => {
        const value = await this.contract.getPrice(10);
        value.should.be.bignumber.eq(10);
      });

      it('should compute f(500) = 1000', async () => {
        const value = await this.contract.getPrice(500);
        value.should.be.bignumber.eq(1000);
      });
    },
  );
});
