const Decimal = require('decimal.js');

const OPCODE_CONST = 0;
const OPCODE_VAR = 1;
const OPCODE_SQRT = 2;
const OPCODE_NOT = 3;
const OPCODE_ADD = 4;
const OPCODE_SUB = 5;
const OPCODE_MUL = 6;
const OPCODE_DIV = 7;
const OPCODE_EXP = 8;
const OPCODE_PCT = 9;
const OPCODE_EQ = 10;
const OPCODE_NE = 11;
const OPCODE_LT = 12;
const OPCODE_GT = 13;
const OPCODE_LE = 14;
const OPCODE_GE = 15;
const OPCODE_AND = 16;
const OPCODE_OR = 17;
const OPCODE_IF = 18;
const OPCODE_BANCOR_LOG = 19;
const OPCODE_BANCOR_POWER = 20;
const OPCODE_INVALID = 21;

// export this function
module.exports.calculate = (self, value) => {
  const xValue = new Decimal(value);
  const [end, val] = solveMath(self, 0, xValue);
  if (end !== self.length - 1) throw new Error('WTFFF');
  // require(end === self.length - 1);
  return val;
};

function getChildrenCount(opcode) {
  if (opcode <= OPCODE_VAR) {
    return 0;
  } else if (opcode <= OPCODE_NOT) {
    return 1;
  } else if (opcode <= OPCODE_OR) {
    return 2;
  } else if (opcode <= OPCODE_BANCOR_LOG) {
    return 3;
  } else if (opcode <= OPCODE_BANCOR_POWER) {
    return 4;
  } else {
  }
}

function dryRun(self, startIndex) {
  if (startIndex >= self.length) throw new Error('startIndex < self.length');
  // require(startIndex < self.length);
  const opcode = self[startIndex];
  if (opcode === OPCODE_CONST) return startIndex + 1;
  const childrenCount = getChildrenCount(opcode);

  let lastIndex = startIndex;

  for (let idx = 0; idx < childrenCount; ++idx) {
    lastIndex = dryRun(self, lastIndex + 1);
  }
  return lastIndex;
}

function solveMath(self, startIndex, xValue) {
  if (startIndex >= self.length) throw new Error('startIndex < self.length');
  // require(startIndex < self.length);
  const opcode = self[startIndex];

  if (opcode === OPCODE_CONST) {
    return [startIndex + 1, new Decimal(self[startIndex + 1])];
  } else if (opcode === OPCODE_VAR) {
    return [startIndex, xValue];
  } else if (opcode === OPCODE_SQRT) {
    [endIndex, childValue] = solveMath(self, startIndex + 1, xValue);
    let temp = childValue.plus(1).dividedBy(2);
    let result = childValue;

    while (temp < result) {
      result = temp;
      temp = childValue
        .dividedBy(temp)
        .plus(temp)
        .dividedBy(2);
    }

    return [endIndex, result];
  } else if (opcode >= OPCODE_ADD && opcode <= OPCODE_PCT) {
    [leftEndIndex, leftValue] = solveMath(self, startIndex + 1, xValue);
    [endIndex, rightValue] = solveMath(self, leftEndIndex + 1, xValue);

    if (opcode === OPCODE_ADD) {
      return [endIndex, leftValue.plus(rightValue)];
    } else if (opcode === OPCODE_SUB) {
      return [endIndex, leftValue.minus(rightValue)];
    } else if (opcode === OPCODE_MUL) {
      return [endIndex, leftValue.mul(rightValue)];
    } else if (opcode === OPCODE_DIV) {
      return [endIndex, leftValue.dividedBy(rightValue)];
    } else if (opcode === OPCODE_EXP) {
      const expResult = leftValue.pow(rightValue);
      return [endIndex, expResult];
    } else if (opcode === OPCODE_PCT) {
      return [
        endIndex,
        leftValue.mul(rightValue).dividedBy(new Decimal(1000000000000000000)),
      ];
    }
  } else if (opcode === OPCODE_IF) {
    [condEndIndex, condValue] = solveBool(self, startIndex + 1, xValue);
    if (condValue) {
      [thenEndIndex, thenValue] = solveMath(self, condEndIndex + 1, xValue);
      return [dryRun(self, thenEndIndex + 1), thenValue];
    } else {
      const thenEndIndex = dryRun(self, condEndIndex + 1);
      return solveMath(self, thenEndIndex + 1, xValue);
    }
  } else if (opcode == OPCODE_BANCOR_LOG) {
    [multiplierEndIndex, multiplier] = solveMath(self, startIndex + 1, xValue);
    [baseNEndIndex, baseN] = solveMath(self, multiplierEndIndex + 1, xValue);
    [baseDEndIndex, baseD] = solveMath(self, baseNEndIndex + 1, xValue);
    return [
      baseDEndIndex,
      baseN
        .dividedBy(baseD)
        .ln()
        .mul(multiplier),
    ];
  } else if (opcode === OPCODE_BANCOR_POWER) {
    [multiplierEndIndex, multiplier] = solveMath(self, startIndex + 1, xValue);
    [baseNEndIndex, baseN] = solveMath(self, multiplierEndIndex + 1, xValue);
    [baseDEndIndex, baseD] = solveMath(self, baseNEndIndex + 1, xValue);
    [expVEndIndex, expV] = solveMath(self, baseDEndIndex + 1, xValue);
    if (expV.lt(new Decimal(0))) throw new Error('exp should more than 0');
    const expDividedByM = expV.dividedBy(new Decimal(1000000)); // dividedBy 10^6
    return [
      expVEndIndex,
      baseN
        .dividedBy(baseD)
        .pow(expDividedByM)
        .mul(multiplier),
    ];
  }
}

function solveBool(self, startIndex, xValue) {
  // require(startIndex < self.length);
  const opcode = self[startIndex];

  if (opcode === OPCODE_NOT) {
    [endIndex, value] = solveBool(self, startIndex + 1, xValue);
    return [endIndex, !value];
  } else if (opcode >= OPCODE_EQ && opcode <= OPCODE_GE) {
    [leftEndIndex, leftValue] = solveMath(self, startIndex + 1, xValue);
    [rightEndIndex, rightValue] = solveMath(self, leftEndIndex + 1, xValue);

    if (opcode === OPCODE_EQ) {
      return [rightEndIndex, leftValue === rightValue];
    } else if (opcode === OPCODE_NE) {
      return [rightEndIndex, leftValue !== rightValue];
    } else if (opcode === OPCODE_LT) {
      return [rightEndIndex, leftValue < rightValue];
    } else if (opcode === OPCODE_GT) {
      return [rightEndIndex, leftValue > rightValue];
    } else if (opcode === OPCODE_LE) {
      return [rightEndIndex, leftValue <= rightValue];
    } else if (opcode === OPCODE_GE) {
      return [rightEndIndex, leftValue >= rightValue];
    }
  } else if (opcode >= OPCODE_AND && opcode <= OPCODE_OR) {
    [leftEndIndex, leftBoolValue] = solveBool(self, startIndex + 1, xValue);
    if (opcode === OPCODE_AND) {
      if (leftBoolValue) return solveBool(self, leftEndIndex + 1, xValue);
      else return dryRun(self, leftEndIndex + 1), false;
    } else if (opcode === OPCODE_OR) {
      if (leftBoolValue) return dryRun(self, leftEndIndex + 1), true;
      else return solveBool(self, leftEndIndex + 1, xValue);
    }
  } else if (opcode === OPCODE_IF) {
    [condEndIndex, condValue] = solveBool(self, startIndex + 1, xValue);
    if (condValue) {
      [thenEndIndex, thenValue] = solveBool(self, condEndIndex + 1, xValue);
      return dryRun(self, thenEndIndex + 1), thenValue;
    } else {
      const thenEndIndex = dryRun(self, condEndIndex + 1);
      return solveBool(self, thenEndIndex + 1, xValue);
    }
  }
}
