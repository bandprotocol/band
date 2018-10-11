pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Equation library
 *
 * @dev Implementation of equation is represented by expression tree.
 */
library Equation{

  using SafeMath for uint256;

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
      require(expressions[i] < 9);
      node.opcode = uint8(expressions[i]);
      if (expressions[i] == 0)
      {
        i++;
        node.value = expressions[i];
      }
      data.tree.push(node);
    }
    require(createTree(data, 0) == data.tree.length-1);
  }

  /**
   * @dev Calculate equation receive x from caller.
   * @param data storage pointer to Data.
   * @param x input variable in equation. 
   */
  function calculate(Data storage data, uint256 x) internal view returns (uint256){
    return solveValueAtNode(data, 0, x);
  }

  /**
   * @dev Calculate value of this subtree.
   * @param data storage pointer to Data.
   * @param currentNode position of the current node.
   * @param x input variable in equation.
   * @return An uint8 representing the last node id of this subtree. 
   */
  function solveValueAtNode(Data storage data, uint8 currentNode, uint256 x) private view returns (uint256){
    Node storage node = data.tree[currentNode];
    assert(node.opcode < 9);
    if (node.opcode == 0) {
      return node.value;
    }
    else if(node.opcode == 1) {
      return x;
    }
    else if(node.opcode == 2) {
      return sqrt(solveValueAtNode(data, node.children[0], x));
    }
    else if(node.opcode == 3) {
      return solveValueAtNode(data, node.children[0], x).add(solveValueAtNode(data, node.children[1], x));
    }
    else if(node.opcode == 4) {
      return solveValueAtNode(data, node.children[0], x).sub(solveValueAtNode(data, node.children[1], x));
    }
    else if(node.opcode == 5) {
      return solveValueAtNode(data, node.children[0], x).mul(solveValueAtNode(data, node.children[1], x));
    }
    else if(node.opcode == 6) {
      return solveValueAtNode(data, node.children[0], x).div(solveValueAtNode(data, node.children[1], x));
    }
    else if(node.opcode == 8) {
      return exp(solveValueAtNode(data, node.children[0], x), solveValueAtNode(data, node.children[1], x));
    }
  }

  /**
   * @dev Recursively generate tree following prefix expression order.
   * @param data storage pointer to Data.
   * @param currentNode position of the current node.
   * @return An uint8 representing the last node id of this subtree. 
   */
  function createTree(Data storage data, uint8 currentNode) private returns (uint8){
    Node storage node = data.tree[currentNode];
    if (node.opcode < 2){
      return currentNode;
    }
    else if (node.opcode == 2 )
    {
      node.children.push(currentNode+1);
      return createTree(data, currentNode+1);
    }
    else{
      node.children.push(currentNode+1);
      uint8 lastLeft = createTree(data, currentNode+1);
      node.children.push(lastLeft+1);
      return createTree(data, lastLeft+1);
    }
  }

  /**
   * @dev Square root function will be moved to other library.
   * @param x uint256 input x.
   * @return An uint256 result of sqrt(x). 
   */
  function sqrt(uint256 x) internal pure returns (uint256) {
    uint256 z = x.add(1).div(2);
    uint256 y = x;
    while (z < y) {
      y = z;
      z = x.div(z).add(z).div(2);
    }
    return y;
  }

  /**
   * @dev Exponential function will be moved to other library.
   * @param a uint256 base number.
   * @param b uint256 power.
   * @return An uint256 result of a^b. 
   */
  function exp(uint256 a, uint256 b) internal pure returns (uint256){
    require(a != 0 || b != 0);
    if ( b == 0 ){
      return 1;
    }
    uint256 ans = a;
    for (uint256 i = 0; i < b - 1; i++)
    {
      ans = ans.mul(a);
    }
    return ans;
  }
}
