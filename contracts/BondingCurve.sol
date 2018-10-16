pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./BandToken.sol";
import "./CommunityToken.sol";
import "./Equation.sol";


/**
 * @title BondingCurve
 *
 * @dev TODO
 */
contract BondingCurve is Pausable {
  using Equation for Equation.Data;
  using SafeMath for uint256;

  //
  Equation.Data equation;

  //
  BandToken public bandToken;

  //
  CommunityToken public commToken;

  //
  uint256 public constant DENOMINATOR = 1e9;

  //
  uint256 public inflationRatio = DENOMINATOR;


  /**
   * @dev TODO
   * @param _bandToken TODO
   * @param _commToken TODO
   * @param _expressions TODO
   */
  constructor(address _bandToken, address _commToken, uint256[] _expressions)
    public
  {
    bandToken = BandToken(_bandToken);
    commToken = CommunityToken(_commToken);
    equation.init(_expressions);

    require(commToken.totalSupply() == 0);
  }

  /**
   * @dev TODO
   */
  function buy(uint256 _amount, uint256 _priceLimit) public {
    uint256 startSupply = commToken.totalSupply();
    uint256 endSupply = startSupply.add(_amount);

    // The raw price as calculated from the difference between the starting and
    // ending positions.
    uint256 rawPrice =
      equation.calculate(endSupply).sub(equation.calculate(startSupply));

    // Price after adjusting inflation in.
    uint256 adjustedPrice = rawPrice.mul(inflationRatio).div(DENOMINATOR);

    // Make sure that the sender does not overpay due to slow block / frontrun.
    require(adjustedPrice <= _priceLimit);

    // Get Band tokens from sender and mint community tokens for sender.
    bandToken.transferFrom(msg.sender, this, adjustedPrice);
    commToken.mint(msg.sender, _amount);
  }

  /**
   * @dev TODO
   */
  function sell(uint256 _amount, uint256 _priceLimit) public
  {
    uint256 startSupply = commToken.totalSupply();
    uint256 endSupply = startSupply.sub(_amount);

    // The raw price as calcuated from the difference between the starting and
    // ending positions.
    uint256 rawPrice =
      equation.calculate(startSupply).sub(equation.calculate(endSupply));

    // Price after adjusting inflation in.
    uint256 adjustedPrice = rawPrice.mul(inflationRatio).div(DENOMINATOR);

    // Make sure that the sender receive not less than his/her desired minimum.
    require(adjustedPrice >= _priceLimit);

    // Burn community tokens of sender and send Band tokens to sender.
    commToken.burn(msg.sender, _amount);
    bandToken.transfer(msg.sender, adjustedPrice);
  }

  /**
   * @dev TODO
   */
  function inflate(uint256 _value, address _dest) public onlyOwner {
    _adjustInflationRatio(commToken.totalSupply().add(_value));
    commToken.mint(_dest, _value);
  }

  /**
   * @dev TODO
   */
  function deflate(uint256 _value, address _src) public onlyOwner {
    _adjustInflationRatio(commToken.totalSupply().sub(_value));
    commToken.burn(_src, _value);
  }

  /**
   * @dev TODO
   */
  function _adjustInflationRatio(uint256 _newSupply) private {
    uint256 realCollateral = bandToken.balanceOf(this);
    uint256 eqCollateral = equation.calculate(_newSupply);

    inflationRatio = DENOMINATOR.mul(realCollateral).div(eqCollateral);
    assert(eqCollateral.mul(inflationRatio).div(DENOMINATOR) <= realCollateral);
  }
}
