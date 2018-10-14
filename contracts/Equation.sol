pragma solidity ^0.4.24;

import "./ApproxMath.sol";

/**
 * @title Equation library
 *
 * @dev Implementation of equation is represented by expression tree.
 */
library Equation{

  using ApproxMath for ApproxMath.Data;

  uint8 constant noOpcode = 19;
  uint8 constant op0 = 2;
  uint8 constant op1 = 4;
  uint8 constant op2 = 18;

  struct Node{
    uint8 opcode;
    uint256 value;
    uint8[] children;
  }

  struct Data{
    Node[] tree;
  }

  /**
   * @dev Initialize equation by array of opcode in prefix order.
   * @param data storage pointer to Data.
   * @param expressions array of opcode in prefix order. 
   */
  function init(Data storage data, uint256[] expressions) internal {
    for (uint8 i = 0; i < data.tree.length; i++)
    {
      delete data.tree[i];
    }
    data.tree.length = 0;
    Node memory node;
    for (i = 0; i < expressions.length; i++)
    {
      node.value = 0;
      require(expressions[i] < noOpcode);
      node.opcode = uint8(expressions[i]);
      if (expressions[i] == 0)
      {
        i++;
        node.value = expressions[i];
      }
      data.tree.push(node);
    }
    (uint8 noNode,) = createTree(data, 0);
    require(noNode == data.tree.length-1);
  }

  /**
   * @dev Recursively generate tree following prefix expression order.
   * @param data storage pointer to Data.
   * @param currentNode position of the current node.
   * @return An (uint8, bool) representing the last node id of this subtree and expected result type true if it return value. 
   */
  function createTree(Data storage data, uint8 currentNode) private returns (uint8, bool){
    Node storage node = data.tree[currentNode];
    uint8 nodeId;
    bool isMath;
    if (node.opcode < op0){
      return (currentNode, true);
    }
    else if (node.opcode < op1)
    {
      node.children.push(currentNode+1);
      (nodeId, isMath) = createTree(data, currentNode+1);
      if (node.opcode == 2) {
        require(isMath, "Expect a real value.");
        return (nodeId, isMath);
      }
      else if (node.opcode == 3){
        require(!isMath, "Expect a bool value");
        return (nodeId, isMath);
      }
    }
    else if (node.opcode < op2){
      node.children.push(currentNode + 1);
      (nodeId, isMath) = createTree(data, currentNode + 1);
      if(node.opcode == 16 || node.opcode == 17) {
        require(!isMath, "Expect a bool value");
      }
      else {
        require(isMath, "Expect a real value.");
      }
      node.children.push(nodeId + 1);
      (nodeId, isMath) = createTree(data, nodeId + 1);
      if(node.opcode == 16 || node.opcode == 17) {
        require(!isMath, "Expect a bool value");
      }
      else {
        require(isMath, "Expect a real value.");
      }

      // Arithmetic operator
      if (node.opcode < 10) {
        return (nodeId, true);
      }
      // Logical operator
      else {
        return (nodeId, false);
      }
    }
    else{
      node.children.push(currentNode + 1);
      (nodeId, ) = createTree(data, currentNode + 1);
      node.children.push(nodeId + 1);
      (nodeId, ) = createTree(data, nodeId + 1);
      node.children.push(nodeId + 1);
      return createTree(data, nodeId + 1);
    }
  }

  /**
   * @dev Calculate equation receive x from caller.
   * @param data storage pointer to Data.
   * @param x input variable in equation. 
   */
  function calculate(Data storage data, uint256 x) internal view returns (uint256){
    return solveMath(data, 0, ApproxMath.encode(x)).decode();
  }

  /**
   * @dev Calculate value of this subtree.
   * @param data storage pointer to Data.
   * @param currentNode position of the current node.
   * @param x input variable in ApproxMath format.
   * @return An ApproxMath.Data the result of calculation. 
   */
  function solveMath(Data storage data, uint8 currentNode, ApproxMath.Data x) private view returns (ApproxMath.Data){
    Node storage node = data.tree[currentNode];
    if (node.opcode == 0) {
      return ApproxMath.encode(node.value);
    }
    else if (node.opcode == 1) {
      return x;
    }
    else if (node.opcode == 2) {
      return solveMath(data, node.children[0], x).sqrt();
    }
    else if (node.opcode == 4) {
      return solveMath(data, node.children[0], x).add(solveMath(data, node.children[1], x));
    }
    else if (node.opcode == 5) {
      return solveMath(data, node.children[0], x).sub(solveMath(data, node.children[1], x));
    }
    else if (node.opcode == 6) {
      return solveMath(data, node.children[0], x).mul(solveMath(data, node.children[1], x));
    }
    else if (node.opcode == 7) {
      return solveMath(data, node.children[0], x).div(solveMath(data, node.children[1], x));
    }
    else if (node.opcode == 9) {
      return exp(solveMath(data, node.children[0], x), solveMath(data, node.children[1], x).decode());
    }
    else if (node.opcode == 18) {
      return (solveBool(data, node.children[0], x)) ? 
        solveMath(data, node.children[1], x) : solveMath(data, node.children[2], x);
    }
    else{
      assert(false);
    }
  }

  /**
   * @dev Calculate value(true/false) of this subtree.
   * @param data storage pointer to Data.
   * @param currentNode position of the current node.
   * @param x input variable in ApproxMath format.
   * @return A bool the result of subtree. 
   */
  function solveBool(Data storage data, uint8 currentNode, ApproxMath.Data x) private view returns (bool){
    Node storage node = data.tree[currentNode];
    if (node.opcode == 3) {
      return !solveBool(data, node.children[0], x);
    }
    else if (node.opcode == 10) {
      return solveMath(data, node.children[0], x).decode() == solveMath(data, node.children[1], x).decode();
    }
    else if (node.opcode == 11) {
      return solveMath(data, node.children[0], x).decode() != solveMath(data, node.children[1], x).decode();
    }
    else if (node.opcode == 12) {
      return solveMath(data, node.children[0], x).decode() < solveMath(data, node.children[1], x).decode();
    }
    else if (node.opcode == 13) {
      return solveMath(data, node.children[0], x).decode() > solveMath(data, node.children[1], x).decode();
    }
    else if (node.opcode == 14) {
      return solveMath(data, node.children[0], x).decode() <= solveMath(data, node.children[1], x).decode();
    }
    else if (node.opcode == 15) {
      return solveMath(data, node.children[0], x).decode() >= solveMath(data, node.children[1], x).decode();
    }
    else if (node.opcode == 16) {
      return solveBool(data, node.children[0], x) && solveBool(data, node.children[1], x);
    }
    else if (node.opcode == 17) {
      return solveBool(data, node.children[0], x) || solveBool(data, node.children[1], x);
    }
    else if (node.opcode == 18) {
      return solveBool(data, node.children[0], x) ? 
        solveBool(data, node.children[1], x) : solveBool(data, node.children[2], x);
    }
    else{
      assert(false);
    }
  }

  /**
   * @dev Exponential function.
   * @param a uint256 base number.
   * @param b uint256 power.
   * @return An uint256 result of a^b. 
   */
  function exp(ApproxMath.Data a, uint256 b) internal pure returns (ApproxMath.Data){
    require(a.decode() != 0 || b != 0);
    if ( b == 0 ){
      return ApproxMath.encode(1);
    }
    ApproxMath.Data memory ans = a;
    for (uint256 i = 0; i < b - 1; i++)
    {
      ans = ans.mul(a);
    }
    return ans;
  }
}
