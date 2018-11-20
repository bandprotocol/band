pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


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
   * +--------+----------------------------------------+------+------------+
   *  2. children: the list of node indices of this node's sub-expressions.
   *  Different opcode nodes will have different number of children.
   *  3. value: the value inside the node. Currently this is only relevant for
   *  Integer Constant (Opcode 00).
   *
   * An equation's data is a list of nodes. The nodes will link against
   * each other using index as pointer. The root node of the expression tree
   * is the first node in the list
   */
  struct Node {
    uint8 opcode;
    uint8 child0;
    uint8 child1;
    uint8 child2;
    uint256 value;
  }

  /**
   * @dev An internal struct to keep track of expression type. This is to make
   * sure than the given equation type-checks.
   */
  enum ExprType {
    Invalid,
    Math,
    Boolean
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
  uint8 constant OPCODE_INVALID = 18;

  /**
   * @dev Initialize equation by array of opcodes/values in prefix order. Array
   * is read as if it is the *pre-order* traversal of the expression tree.
   * For instance, expression x^2 - 3 is encoded as: [5, 8, 1, 0, 2, 0, 3]
   *
   *                 5 (Opcode -)
   *                    /  \
   *                   /     \
   *                /          \
   *         8 (Opcode **)       \
   *             /   \             \
   *           /       \             \
   *         /           \             \
   *  1 (Opcode X)  0 (Opcode c)  0 (Opcode c)
   *                     |              |
   *                     |              |
   *                 2 (Value)     3 (Value)
   *
   * @param self storage pointer to equation data to initialize.
   * @param _expressions array of opcodes/values to initialize.
   */
  function init(Node[] storage self, uint256[] _expressions) internal {
    // Init should only be called when the equation is not yet initialized.
    assert(self.length == 0);

    // Limit expression length to < 256 to make sure gas cost is managable.
    require(_expressions.length < 256);

    for (uint8 idx = 0; idx < _expressions.length; ++idx) {
      // Get the next opcode. Obviously it must be within the opcode range.
      uint256 opcode = _expressions[idx];
      require(opcode < OPCODE_INVALID);

      Node memory node;
      node.opcode = uint8(opcode);

      // Get the node's value. Only applicable on Integer Constant case.
      if (opcode == OPCODE_CONST) {
        node.value = _expressions[++idx];
      }

      self.push(node);
    }

    // Actual code to create the tree. We also assert and the end that all
    // of the provided expressions are exhausted.
    (uint8 lastNodeIndex,) = populateTree(self, 0);
    require(lastNodeIndex == self.length - 1);
  }

  /**
   * @dev Clear the existing equation. Must be called prior to init of the tree
   * has already been initialized.
   */
  function clear(Node[] storage self) internal {
    assert(self.length < 256);

    for (uint8 idx = 0; idx < self.length; ++idx) {
      delete self[idx];
    }

    self.length = 0;
  }

  /**
   * @dev Calculate the Y position from the X position for this equation.
   */
  function calculate(Node[] storage self, uint256 xValue)
    internal
    view
    returns (uint256)
  {
    return solveMath(self, 0, xValue);
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
    } else {
      assert(false);
    }
  }

  /**
   * @dev Check whether the given opcode and list of expression types match.
   * Execute revert EVM opcode on failure.
   * @return The type of this expression itself.
   */
  function checkExprType(uint8 opcode, ExprType[] types)
    private
    pure
    returns (ExprType)
  {
    if (opcode <= OPCODE_VAR) {
      return ExprType.Math;

    } else if (opcode == OPCODE_SQRT) {
      require(types[0] == ExprType.Math);
      return ExprType.Math;

    } else if (opcode == OPCODE_NOT) {
      require(types[0] == ExprType.Boolean);
      return ExprType.Boolean;

    } else if (opcode >= OPCODE_ADD && opcode <= OPCODE_EXP) {
      require(types[0] == ExprType.Math);
      require(types[1] == ExprType.Math);
      return ExprType.Math;

    } else if (opcode >= OPCODE_EQ && opcode <= OPCODE_GE) {
      require(types[0] == ExprType.Math);
      require(types[1] == ExprType.Math);
      return ExprType.Boolean;

    } else if (opcode >= OPCODE_AND && opcode <= OPCODE_OR) {
      require(types[0] == ExprType.Boolean);
      require(types[1] == ExprType.Boolean);
      return ExprType.Boolean;

    } else if (opcode == OPCODE_IF) {
      require(types[0] == ExprType.Boolean);
      require(types[1] != ExprType.Invalid);
      require(types[1] == types[2]);
      return types[1];

    }
  }

  /**
   * @dev Helper function to recursively populate node information following
   * the given pre-order node list. It inspects the opcode and recursively
   * call populateTree(s) accordingly.
   *
   * @param self storage pointer to equation data to build tree.
   * @param currentNodeIndex the index of the current node to populate info.
   * @return An (uint8, bool). The first value represents the last
   * (highest/rightmost) node ndex of the current subtree. The second value
   * indicates the type that one would get from evaluating this subtree.
   */
  function populateTree(Node[] storage self, uint8 currentNodeIndex)
    private
    returns (uint8, ExprType)
  {
    require(currentNodeIndex < self.length);
    Node storage node = self[currentNodeIndex];

    uint8 opcode = node.opcode;
    uint8 childrenCount = getChildrenCount(opcode);

    ExprType[] memory childrenTypes = new ExprType[](childrenCount);
    uint8 lastNodeIndex = currentNodeIndex;

    for (uint8 idx = 0; idx < childrenCount; ++idx) {
      if (idx == 0) {
        node.child0 = lastNodeIndex + 1;
      } else if (idx == 1) {
        node.child1 = lastNodeIndex + 1;
      } else if (idx == 2) {
        node.child2 = lastNodeIndex + 1;
      } else {
        assert(false);
      }

      (lastNodeIndex, childrenTypes[idx]) = populateTree(self, lastNodeIndex + 1);
    }

    ExprType exprType = checkExprType(opcode, childrenTypes);
    return (lastNodeIndex, exprType);
  }


  /**
   * @dev Calculate the arithmetic value of this sub-expression at the given
   * X position.
   */
  function solveMath(Node[] storage self, uint8 nodeIdx, uint256 xValue)
    private
    view
    returns (uint256)
  {
    Node storage node = self[nodeIdx];
    uint8 opcode = node.opcode;

    if (opcode == OPCODE_CONST) {
      return node.value;
    } else if (opcode == OPCODE_VAR) {
      return xValue;
    } else if (opcode == OPCODE_SQRT) {
      uint256 childValue = solveMath(self, node.child0, xValue);
      uint256 temp = childValue.add(1).div(2);
      uint256 result = childValue;

      while (temp < result) {
        result = temp;
        temp = childValue.div(temp).add(temp).div(2);
      }

      return result;

    } else if (opcode >= OPCODE_ADD && opcode <= OPCODE_EXP) {

      uint256 leftValue = solveMath(self, node.child0, xValue);
      uint256 rightValue = solveMath(self, node.child1, xValue);

      if (opcode == OPCODE_ADD) {
        return leftValue.add(rightValue);
      } else if (opcode == OPCODE_SUB) {
        return leftValue.sub(rightValue);
      } else if (opcode == OPCODE_MUL) {
        return leftValue.mul(rightValue);
      } else if (opcode == OPCODE_DIV) {
        return leftValue.div(rightValue);
      } else if (opcode == OPCODE_EXP) {
        uint256 power = rightValue;
        uint256 expResult = 1;
        for (uint256 idx = 0; idx < power; ++idx) {
          expResult = expResult.mul(leftValue);
        }
        return expResult;
      }
    } else if (opcode == OPCODE_IF) {
      bool condValue = solveBool(self, node.child0, xValue);
      if (condValue) {
        return solveMath(self, node.child1, xValue);
      } else {
        return solveMath(self, node.child2, xValue);
      }
    }

    assert(false);
  }

  /**
   * @dev Calculate the arithmetic value of this sub-expression.
   */
  function solveBool(Node[] storage self, uint8 nodeIdx, uint256 xValue)
    private
    view
    returns (bool)
  {
    Node storage node = self[nodeIdx];
    uint8 opcode = node.opcode;

    if (opcode == OPCODE_NOT) {
      return !solveBool(self, node.child0, xValue);
    } else if (opcode >= OPCODE_EQ && opcode <= OPCODE_GE) {

      uint256 leftValue = solveMath(self, node.child0, xValue);
      uint256 rightValue = solveMath(self, node.child1, xValue);

      if (opcode == OPCODE_EQ) {
        return leftValue == rightValue;
      } else if (opcode == OPCODE_NE) {
        return leftValue != rightValue;
      } else if (opcode == OPCODE_LT) {
        return leftValue < rightValue;
      } else if (opcode == OPCODE_GT) {
        return leftValue > rightValue;
      } else if (opcode == OPCODE_LE) {
        return leftValue <= rightValue;
      } else if (opcode == OPCODE_GE) {
        return leftValue >= rightValue;
      }
    } else if (opcode >= OPCODE_AND && opcode <= OPCODE_OR) {

      bool leftBoolValue = solveBool(self, node.child0, xValue);
      bool rightBoolValue = solveBool(self, node.child1, xValue);

      if (opcode == OPCODE_AND) {
        return leftBoolValue && rightBoolValue;
      } else if (opcode == OPCODE_OR) {
        return leftBoolValue || rightBoolValue;
      }
    } else if (opcode == OPCODE_IF) {
      bool condValue = solveBool(self, node.child0, xValue);
      if (condValue) {
        return solveBool(self, node.child1, xValue);
      } else {
        return solveBool(self, node.child2, xValue);
      }
    }

    assert(false);
  }
}
