const { shouldFail } = require('openzeppelin-test-helpers');

const EquationMock = artifacts.require('EquationMock');
const Equation = artifacts.require('Equation');

require('chai').should();

contract('EquationMock', ([_, owner]) => {
  beforeEach(async () => {
    await EquationMock.link(Equation, await Equation.deployed());
  });

  context('Invalid equation', () => {
    it('should fail if an operand is missed: (+) (4)', async () => {
      await shouldFail.reverting(EquationMock.new([4, 1], { from: owner }));
    });

    it('should fail if there is an extra term: (*) (4) (x) (3)', async () => {
      await shouldFail.reverting(
        EquationMock.new([6, 0, 4, 1, 0, 3], { from: owner }),
      );
    });

    it('should fail if typecheck fails: (*) (>) (x) (5) (3)', async () => {
      await shouldFail.reverting(
        EquationMock.new([6, 13, 1, 0, 5, 0, 3], { from: owner }),
      );
    });
  });

  context('Simple equation f(x) = x + 7', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new([4, 1, 0, 7], { from: owner });
    });

    it('should compute f(5) = 12', async () => {
      const value = await this.contract.getCollateralAt(5);
      value.toString().should.eq('12');
    });

    it('should compute f(10) = 17', async () => {
      const value = await this.contract.getCollateralAt(10);
      value.toString().should.be.eq('17');
    });
  });

  context('Bancor exponential equation f(x) = 1e18 * (x / MAGIC) ^ 5', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new(
        [
          20,
          0,
          '1000000000000000000',
          1,
          0,
          '137972966146121475817472',
          0,
          '5000000',
        ],
        { from: owner },
      );
    });

    it('should compute f(1e24) ~ (2e22)', async () => {
      const value = await this.contract.getCollateralAt(
        '1000000000000000000000000',
      );
      value.toString().should.be.eq('20000000000000005378977');
    });

    it('should compute f(2512562e18) ~ (2e24)', async () => {
      const value = await this.contract.getCollateralAt(
        '2512562000000000000000000',
      );
      value.toString().should.be.eq('2002690933659130635756763');
    });

    it('should compute f(15848940e18) ~ (2e28)', async () => {
      const value = await this.contract.getCollateralAt(
        '15848940000000000000000000',
      );
      value.toString().should.be.eq('19454042124038388340035453438');
    });
  });

  context('Bancor logarithm equation f(x) = 1e18 * log(x / 10^18)', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new(
        [19, 0, '1000000000000000000', 1, 0, '1000000000000000000'],
        { from: owner },
      );
    });

    it('should compute f(1e24) ~ (13815510557964274104)', async () => {
      const value = await this.contract.getCollateralAt(
        '1000000000000000000000000',
      );
      value.toString().should.be.eq('13815510557964274104');
    });

    it('should compute f(1.0001 * 1e18) ~ (99995000333308)', async () => {
      const value = await this.contract.getCollateralAt('1000100000000000000');
      value.toString().should.be.eq('99995000333308');
    });
  });

  context('Bancor logarithm equation f(x) = 1e18 * log(x / 1)', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new(
        [19, 0, '1000000000000000000', 1, 0, '1'],
        { from: owner },
      );
    });

    it('should compute f(587747175411143753984368268611122838909) ~ (89269360229428463373)', async () => {
      const value = await this.contract.getCollateralAt(
        '587747175411143753984368268611122838909',
      );
      value.toString().should.be.eq('89269360229428463373');
    });
  });

  context('Quadratic equation f(x) = (x ^ 2) - 3', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new([5, 8, 1, 0, 2, 0, 3], {
        from: owner,
      });
    });

    it('should compute f(10) = 97', async () => {
      const value = await this.contract.getCollateralAt(10);
      value.toString().should.eq('97');
    });

    it('should compute f(56) = 3133', async () => {
      const value = await this.contract.getCollateralAt(56);
      value.toString().should.be.eq('3133');
    });

    it('should fail on f(1) < 0', async () => {
      await shouldFail.reverting(this.contract.getCollateralAt(1));
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
        const value = await this.contract.getCollateralAt(5);
        value.toString().should.eq('33');
      });

      it('should compute f(6) = 67', async () => {
        const value = await this.contract.getCollateralAt(6);
        value.toString().should.eq('67');
      });
    },
  );

  context(
    'Use Pct in equation f(x) = kx; k = a / 10^18; a can less than 1',
    () => {
      beforeEach(async () => {
        // 500000000000 = 0.5 * 1e18
        this.contract = await EquationMock.new(
          [9, 1, 0, '500000000000000000'],
          {
            from: owner,
          },
        );
      });

      it('should compute f(1500000000000000000) = 750000000000000000', async () => {
        const value = await this.contract.getCollateralAt(
          '1500000000000000000',
        );
        value.toString().should.eq('750000000000000000');
      });
    },
  );

  context('If-else equation f(x) = 2 * x if x < 10 else (x ^ 2) - 90', () => {
    beforeEach(async () => {
      this.contract = await EquationMock.new(
        [18, 12, 1, 0, 10, 6, 0, 2, 1, 5, 8, 1, 0, 2, 0, 90],
        { from: owner },
      );
    });

    it('should compute f(8) = 16', async () => {
      const value = await this.contract.getCollateralAt(8);
      value.toString().should.eq('16');
    });

    it('should compute f(10) = 10', async () => {
      const value = await this.contract.getCollateralAt(10);
      value.toString().should.eq('10');
    });

    it('should compute f(500) = 249910', async () => {
      const value = await this.contract.getCollateralAt(500);
      value.toString().should.eq('249910');
    });
  });

  context(
    'If-else equation f(x) = 2 * x if x < 10 or x > 100 else x ^ 2 - 90',
    () => {
      beforeEach(async () => {
        this.contract = await EquationMock.new(
          [
            18,
            17,
            12,
            1,
            0,
            10,
            13,
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
        const value = await this.contract.getCollateralAt(8);
        value.toString().should.eq('16');
      });

      it('should compute f(10) = 10', async () => {
        const value = await this.contract.getCollateralAt(10);
        value.toString().should.eq('10');
      });

      it('should compute f(500) = 1000', async () => {
        const value = await this.contract.getCollateralAt(500);
        value.toString().should.eq('1000');
      });
    },
  );

  context('And test', () => {
    beforeEach(async () => {
      // equation if x < 10 and 10 - x > 3 then 1 else 9
      this.contract = await EquationMock.new([
        18,
        16,
        12,
        1,
        0,
        10,
        13,
        5,
        0,
        10,
        1,
        0,
        3,
        0,
        1,
        0,
        9,
      ]);
    });
    it('should return 1 if x < 10 and 10 - x > 3', async () => {
      (await this.contract.getCollateralAt(3)).toString().should.eq('1');
    });
    it('should return 9 if x < 10 but 10 - x <= 3', async () => {
      (await this.contract.getCollateralAt(9)).toString().should.eq('9');
    });
    it('should return 9 if x >= 10', async () => {
      (await this.contract.getCollateralAt(10)).toString().should.eq('9');
    });
  });

  context('Or test', () => {
    beforeEach(async () => {
      // equation if x == 0 or 1000 / x >= 20 then 12 else 101
      this.contract = await EquationMock.new([
        18,
        17,
        10,
        1,
        0,
        0,
        15,
        7,
        0,
        1000,
        1,
        0,
        20,
        0,
        12,
        0,
        101,
      ]);
    });
    it('should return 12 if x == 0', async () => {
      (await this.contract.getCollateralAt(0)).toString().should.eq('12');
    });
    it('should return 12 if x <= 50', async () => {
      (await this.contract.getCollateralAt(50)).toString().should.eq('12');
    });
    it('should return 101 if x > 50', async () => {
      (await this.contract.getCollateralAt(51)).toString().should.eq('101');
    });
  });
});
