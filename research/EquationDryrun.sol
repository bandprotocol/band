pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./thirdparty/BancorPower.sol";


/**
 * @title Equation
 *
 * @dev Equation library abstracts the representation of mathematics equation.
 * As of current, an equation is basically an expression tree of constants,
 * one variable (X), and operators.
 */
library Equation {
  using SafeMath for uint256;

  /**
   * @dev An expression tree is encoded as a set of nodes, with root node having
   * index zero. Each node consists of 3 values:
   *  1. opcode: the expression that the node represents. See table below.
   * +--------+----------------------------------------+------+------------+
   * | Opcode |              Description               | i.e. | # children |
   * +--------+----------------------------------------+------+------------+
   * |   00   | Integer Constant                       |   c  |      0     |
   * |   01   | Variable                               |   X  |      0     |
   * |   02   | Arithmetic Square Root                 |   √  |      1     |
   * |   03   | Boolean Not Condition                  |   !  |      1     |
   * |   04   | Arithmetic Addition                    |   +  |      2     |
   * |   05   | Arithmetic Subtraction                 |   -  |      2     |
   * |   06   | Arithmetic Multiplication              |   *  |      2     |
   * |   07   | Arithmetic Division                    |   /  |      2     |
   * |   08   | Arithmetic Exponentiation              |  **  |      2     |
   * |   09   | Arithmetic Equal Comparison            |  ==  |      2     |
   * |   10   | Arithmetic Non-Equal Comparison        |  !=  |      2     |
   * |   11   | Arithmetic Less-Than Comparison        |  <   |      2     |
   * |   12   | Arithmetic Greater-Than Comparison     |  >   |      2     |
   * |   13   | Arithmetic Non-Greater-Than Comparison |  <=  |      2     |
   * |   14   | Arithmetic Non-Less-Than Comparison    |  >=  |      2     |
   * |   15   | Boolean And Condition                  |  &&  |      2     |
   * |   16   | Boolean Or Condition                   |  ||  |      2     |
   * |   17   | Ternary Operation                      |  ?:  |      3     |
   * |   18   | Bancor's power* (see below)            |      |      4     |
   * +--------+----------------------------------------+------+------------+
   *  2. children: the list of node indices of this node's sub-expressions.
   *  Different opcode nodes will have different number of children.
   *  3. value: the value inside the node. Currently this is only relevant for
   *  Integer Constant (Opcode 00).
   *
   * An equation's data is a list of nodes. The nodes will link against
   * each other using index as pointer. The root node of the expression tree
   * is the first node in the list
   *
   * (*) Using BancorFomula, the opcode computes exponential of fractional
   * numbers. The opcode takes 4 children (c,baseN,baseD,expV), and computes
   * (c * ((baseN / baseD) ^ (expV / 1e6))). See implementation for the limitation
   * of the each value's domain. The end result must be in uint256 range.
   */


  uint8 constant OPCODE_CONST = 0;
  uint8 constant OPCODE_VAR = 1;
  uint8 constant OPCODE_SQRT = 2;
  uint8 constant OPCODE_NOT = 3;
  uint8 constant OPCODE_ADD = 4;
  uint8 constant OPCODE_SUB = 5;
  uint8 constant OPCODE_MUL = 6;
  uint8 constant OPCODE_DIV = 7;
  uint8 constant OPCODE_EXP = 8;
  uint8 constant OPCODE_EQ = 9;
  uint8 constant OPCODE_NE = 10;
  uint8 constant OPCODE_LT = 11;
  uint8 constant OPCODE_GT = 12;
  uint8 constant OPCODE_LE = 13;
  uint8 constant OPCODE_GE = 14;
  uint8 constant OPCODE_AND = 15;
  uint8 constant OPCODE_OR = 16;
  uint8 constant OPCODE_IF = 17;
  uint8 constant OPCODE_BANCOR_POWER = 18;
  uint8 constant OPCODE_INVALID = 19;



  /**
   * @dev Calculate the Y position from the X position for this equation.
   */
  function calculate(uint256[] storage self, uint256 xValue)
    internal
    view
    returns (uint256)
  {
    (uint8 end, uint256 val) = solveMath(self, 0, xValue);
    require(end == self.length - 1);
    return val;
  }

  /**
   * @dev Return the number of children the given opcode node has.
   */
  function getChildrenCount(uint8 opcode) private pure returns (uint8) {
    if (opcode <= OPCODE_VAR) {
      return 0;
    } else if (opcode <= OPCODE_NOT) {
      return 1;
    } else if (opcode <= OPCODE_OR) {
      return 2;
    } else if (opcode <= OPCODE_IF) {
      return 3;
    } else if (opcode <= OPCODE_BANCOR_POWER) {
      return 4;
    } else {
      assert(false);
    }
  }

  function dryRun(uint256[] storage self, uint8 startIndex)
    private
    view
    returns (uint8)
  {
    require(startIndex < self.length);
    uint8 opcode = uint8(self[startIndex]);
    if (opcode == OPCODE_CONST)
      return startIndex + 1;
    uint8 childrenCount = getChildrenCount(opcode);

    uint8 lastIndex = startIndex;

    for (uint8 idx = 0; idx < childrenCount; ++idx) {
      lastIndex = dryRun(self, lastIndex + 1);
    }

    return lastIndex;
  }


  /**
   * @dev Calculate the arithmetic value of this sub-expression at the given
   * X position.
   */
  function solveMath(uint256[] storage self, uint8 startIndex, uint256 xValue)
    private
    view
    returns (uint8, uint256)
  {
    require(startIndex < self.length);
    uint8 opcode = uint8(self[startIndex]);

    if (opcode == OPCODE_CONST) {
      return (startIndex + 1, self[startIndex+1]);
    } else if (opcode == OPCODE_VAR) {
      return (startIndex, xValue);
    } else if (opcode == OPCODE_SQRT) {
      (uint8 endIndex, uint256 childValue) = solveMath(self, startIndex + 1, xValue);
      uint256 temp = childValue.add(1).div(2);
      uint256 result = childValue;

      while (temp < result) {
        result = temp;
        temp = childValue.div(temp).add(temp).div(2);
      }

      return (endIndex, result);

    } else if (opcode >= OPCODE_ADD && opcode <= OPCODE_EXP) {

      (uint8 leftEndIndex, uint256 leftValue) = solveMath(self, startIndex + 1, xValue);
      (uint8 endIndex, uint256 rightValue) = solveMath(self, leftEndIndex + 1, xValue);

      if (opcode == OPCODE_ADD) {
        return (endIndex, leftValue.add(rightValue));
      } else if (opcode == OPCODE_SUB) {
        return (endIndex, leftValue.sub(rightValue));
      } else if (opcode == OPCODE_MUL) {
        return (endIndex, leftValue.mul(rightValue));
      } else if (opcode == OPCODE_DIV) {
        return (endIndex, leftValue.div(rightValue));
      } else if (opcode == OPCODE_EXP) {
        uint256 power = rightValue;
        uint256 expResult = 1;
        for (uint256 idx = 0; idx < power; ++idx) {
          expResult = expResult.mul(leftValue);
        }
        return (endIndex, expResult);
      }
    } else if (opcode == OPCODE_IF) {

      (uint8 condEndIndex, bool condValue) = solveBool(self, startIndex + 1, xValue);
      if (condValue) {
        (uint8 thenEndIndex, uint256 thenValue) = solveMath(self, condEndIndex + 1, xValue);
        return (dryRun(self, thenEndIndex + 1), thenValue);
      } else {
        uint8 thenEndIndex = dryRun(self, condEndIndex + 1);
        return solveMath(self, thenEndIndex + 1, xValue);
      }
    } else if (opcode == OPCODE_BANCOR_POWER) {
      (uint8 multiplerEndIndex, uint256 multipler) = solveMath(self,startIndex + 1, xValue);
      (uint8 baseNEndIndex, uint256 baseN) = solveMath(self, multiplerEndIndex + 1, xValue);
      (uint8 baseDEndIndex, uint256 baseD) = solveMath(self, baseNEndIndex + 1, xValue);
      (uint8 expVEndIndex, uint256 expV) = solveMath(self, baseDEndIndex + 1, xValue);
      require(expV < 1 << 32);
      (uint256 expResult, uint8 precision) = BancorPower.power(baseN, baseD, uint32(expV), 1e6);
      return (expVEndIndex, expResult.mul(multipler) >> precision);
    }
    require(false);
  }

  /**
   * @dev Calculate the arithmetic value of this sub-expression.
   */
  function solveBool(uint256[] storage self, uint8 startIndex, uint256 xValue)
    private
    view
    returns (uint8, bool)
  {
    require(startIndex < self.length);
    uint8 opcode = uint8(self[startIndex]);

    if (opcode == OPCODE_NOT) {
      (uint8 endIndex, bool value) = solveBool(self, startIndex + 1, xValue);
      return (endIndex, !value);
    } else if (opcode >= OPCODE_EQ && opcode <= OPCODE_GE) {

      (uint8 leftEndIndex, uint256 leftValue) = solveMath(self, startIndex + 1, xValue);
      (uint8 rightEndIndex, uint256 rightValue) = solveMath(self, leftEndIndex + 1, xValue);

      if (opcode == OPCODE_EQ) {
        return (rightEndIndex, leftValue == rightValue);
      } else if (opcode == OPCODE_NE) {
        return (rightEndIndex, leftValue != rightValue);
      } else if (opcode == OPCODE_LT) {
        return (rightEndIndex, leftValue < rightValue);
      } else if (opcode == OPCODE_GT) {
        return (rightEndIndex, leftValue > rightValue);
      } else if (opcode == OPCODE_LE) {
        return (rightEndIndex, leftValue <= rightValue);
      } else if (opcode == OPCODE_GE) {
        return (rightEndIndex, leftValue >= rightValue);
      }
    } else if (opcode >= OPCODE_AND && opcode <= OPCODE_OR) {
      (uint8 leftEndIndex, bool leftBoolValue) = solveBool(self, startIndex + 1, xValue);
      if (opcode == OPCODE_AND) {
        if (leftBoolValue)
          return solveBool(self, leftEndIndex + 1, xValue);
        else
          return (dryRun(self, leftEndIndex + 1), false);
      } else if (opcode == OPCODE_OR) {
        if (leftBoolValue)
          return (dryRun(self, leftEndIndex + 1), true);
        else
          return solveBool(self, leftEndIndex + 1, xValue);
      }
    } else if (opcode == OPCODE_IF) {
      (uint8 condEndIndex, bool condValue) = solveBool(self, startIndex + 1, xValue);
      if (condValue) {
        (uint8 thenEndIndex, bool thenValue) = solveBool(self, condEndIndex + 1, xValue);
        return (dryRun(self, thenEndIndex + 1), thenValue);
      } else {
        uint8 thenEndIndex = dryRun(self, condEndIndex + 1);
        return solveBool(self, thenEndIndex + 1, xValue);
      }
    }

    require(false);
  }
}
