pragma solidity 0.5.0;

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

  struct Data {
    uint256 opcode;
    uint256[] constants;
    uint8 equationLength;
  }


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


  function init(Data storage self, uint256[] memory _expressions) internal {
    assert(self.equationLength == 0);
    require(_expressions.length < 32); // For fitting in 1 uint256 opcodes
    uint256 nextConstant = 0;

    for (uint8 idx = 0; idx < _expressions.length; ++idx) {
      // Get the next opcode. Obviously it must be within the opcode range.
      uint256 opcode = _expressions[idx];
      require(opcode < OPCODE_INVALID);

      self.opcode = self.opcode | (opcode << ((31 - idx) * 8));

      // Get the node's value. Only applicable on Integer Constant case.
      if (opcode == OPCODE_CONST) {
        self.constants.push(_expressions[++idx]);
        self.opcode = self.opcode | (nextConstant << ((31 - idx)*8));
        nextConstant++;
      }
    }
    self.equationLength = uint8(_expressions.length);
  }

  /**
   * @dev Calculate the Y position from the X position for this equation.
   */
  function calculate(Data storage self, uint256 xValue)
    internal
    view
    returns (uint256)
  {
    (uint8 end, uint256 val) = solveMath(self.opcode, self.constants, 0, xValue);
    require(end == self.equationLength - 1);
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

  function getOpcodeAt(uint256 opcodes, uint8 index)
    private
    pure
    returns (uint8)
  {
    require(index < 32);
    return uint8((opcodes >> ((31-index) * 8)) & 255);
  }

  function dryRun(uint256 opcodes, uint256[] memory constants, uint8 startIndex)
    private
    view
    returns (uint8)
  {

    require(startIndex < 32);
    uint8 opcode = getOpcodeAt(opcodes, startIndex);
    if (opcode == OPCODE_CONST)
      return startIndex + 1;
    uint8 childrenCount = getChildrenCount(opcode);

    uint8 lastIndex = startIndex;

    for (uint8 idx = 0; idx < childrenCount; ++idx) {
      lastIndex = dryRun(opcodes, constants, lastIndex + 1);
    }

    return lastIndex;
  }


  /**
   * @dev Calculate the arithmetic value of this sub-expression at the given
   * X position.
   */
  function solveMath(uint256 opcodes, uint256[] memory constants, uint8 startIndex, uint256 xValue)
    private
    view
    returns (uint8, uint256)
  {
    require(startIndex < 32);
    uint8 opcode = getOpcodeAt(opcodes, startIndex);

    if (opcode == OPCODE_CONST) {
      return (startIndex + 1, constants[getOpcodeAt(opcodes, startIndex + 1)]);
    } else if (opcode == OPCODE_VAR) {
      return (startIndex, xValue);
    } else if (opcode == OPCODE_SQRT) {
      (uint8 endIndex, uint256 childValue) = solveMath(opcodes, constants, startIndex + 1, xValue);
      uint256 temp = childValue.add(1).div(2);
      uint256 result = childValue;

      while (temp < result) {
        result = temp;
        temp = childValue.div(temp).add(temp).div(2);
      }

      return (endIndex, result);

    } else if (opcode >= OPCODE_ADD && opcode <= OPCODE_EXP) {

      (uint8 leftEndIndex, uint256 leftValue) = solveMath(opcodes, constants, startIndex + 1, xValue);
      (uint8 endIndex, uint256 rightValue) = solveMath(opcodes, constants, leftEndIndex + 1, xValue);

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

      (uint8 condEndIndex, bool condValue) = solveBool(opcodes, constants, startIndex + 1, xValue);
      if (condValue) {
        (uint8 thenEndIndex, uint256 thenValue) = solveMath(opcodes, constants, condEndIndex + 1, xValue);
        return (dryRun(opcodes, constants, thenEndIndex + 1), thenValue);
      } else {
        uint8 thenEndIndex = dryRun(opcodes, constants, condEndIndex + 1);
        return solveMath(opcodes, constants, thenEndIndex + 1, xValue);
      }
    } else if (opcode == OPCODE_BANCOR_POWER) {
      (uint8 multiplerEndIndex, uint256 multipler) = solveMath(opcodes, constants,startIndex + 1, xValue);
      (uint8 baseNEndIndex, uint256 baseN) = solveMath(opcodes, constants, multiplerEndIndex + 1, xValue);
      (uint8 baseDEndIndex, uint256 baseD) = solveMath(opcodes, constants, baseNEndIndex + 1, xValue);
      (uint8 expVEndIndex, uint256 expV) = solveMath(opcodes, constants, baseDEndIndex + 1, xValue);
      require(expV < 1 << 32);
      (uint256 expResult, uint8 precision) = BancorPower.power(baseN, baseD, uint32(expV), 1e6);
      return (expVEndIndex, expResult.mul(multipler) >> precision);
    }
    require(false);
  }

  /**
   * @dev Calculate the arithmetic value of this sub-expression.
   */
  function solveBool(uint256 opcodes, uint256[] memory constants, uint8 startIndex, uint256 xValue)
    private
    view
    returns (uint8, bool)
  {
    require(startIndex < 32);
    uint8 opcode = getOpcodeAt(opcodes, startIndex);

    if (opcode == OPCODE_NOT) {
      (uint8 endIndex, bool value) = solveBool(opcodes, constants, startIndex + 1, xValue);
      return (endIndex, !value);
    } else if (opcode >= OPCODE_EQ && opcode <= OPCODE_GE) {

      (uint8 leftEndIndex, uint256 leftValue) = solveMath(opcodes, constants, startIndex + 1, xValue);
      (uint8 rightEndIndex, uint256 rightValue) = solveMath(opcodes, constants, leftEndIndex + 1, xValue);

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
      (uint8 leftEndIndex, bool leftBoolValue) = solveBool(opcodes, constants, startIndex + 1, xValue);
      if (opcode == OPCODE_AND) {
        if (leftBoolValue)
          return solveBool(opcodes, constants, leftEndIndex + 1, xValue);
        else
          return (dryRun(opcodes, constants, leftEndIndex + 1), false);
      } else if (opcode == OPCODE_OR) {
        if (leftBoolValue)
          return (dryRun(opcodes, constants, leftEndIndex + 1), true);
        else
          return solveBool(opcodes, constants, leftEndIndex + 1, xValue);
      }
    } else if (opcode == OPCODE_IF) {
      (uint8 condEndIndex, bool condValue) = solveBool(opcodes, constants, startIndex + 1, xValue);
      if (condValue) {
        (uint8 thenEndIndex, bool thenValue) = solveBool(opcodes, constants, condEndIndex + 1, xValue);
        return (dryRun(opcodes, constants, thenEndIndex + 1), thenValue);
      } else {
        uint8 thenEndIndex = dryRun(opcodes, constants, condEndIndex + 1);
        return solveBool(opcodes, constants, thenEndIndex + 1, xValue);
      }
    }

    require(false);
  }
}
