pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./CommunityToken.sol";
import "./Equation.sol";
import "./Parameters.sol";
import "./IBondingCurve.sol";


/**
 * @title BondingCurve
 *
 * @dev BondingCurve acts as the automated market maker for a particular
 * community token. It maintains a curve between current coin supply and total
 * band collatoralized. Anyone can buy/sell community tokens through this
 * contract.
 */
contract BondingCurve is IBondingCurve, Ownable {
  using Equation for Equation.Data;
  using SafeMath for uint256;

  Equation.Data equation;
  IERC20 public bandToken;
  CommunityToken public commToken;
  Parameters public params;

  // Denominator for inflation-related ratios and sales tax.
  uint256 public constant DENOMINATOR = 1e12;

  // Last time the auto-inflation was added to system. Auto-inflation happens
  // automatically everytime someone buys or sells tokens through bonding curve.
  uint256 public lastInflationTime;

  // Curve multiplier indicate the coefficient in front of the curve equation.
  // This allows contract to inflate or deflate the community token supply
  // without making the equation inconsistent with the number of collateralized
  // Band tokens.
  uint256 public curveMultiplier = DENOMINATOR;

  /**
   * @dev Create bonding curve contract.
   * @param _bandToken address of Band token contract.
   * @param _commToken address of community token contract.
   * @param _expressions pre-order traversal of equation expression tree.
   */
  constructor(
    IERC20 _bandToken,
    CommunityToken _commToken,
    Parameters _params,
    uint256[] _expressions
  )
    public
  {
    bandToken = _bandToken;
    commToken = _commToken;
    params = _params;
    equation.init(_expressions);
    lastInflationTime = now;

    require(commToken.totalSupply() == 0);
  }

  /**
   * @dev Return band token address, required by IBondingCurve interface.
   */
  function getBandToken() public view returns (IERC20) {
    return bandToken;
  }

  /**
   * @dev Return community token address, required by IBondingCurve interface.
   */
  function getCommToken() public view returns (IERC20) {
    return commToken;
  }

  /**
   * @dev Calculate buy price for some amounts of tokens in Band
   */
  function getBuyPrice(uint256 _amount) public view returns (uint256) {
    uint256 startSupply = commToken.totalSupply();
    uint256 endSupply = startSupply.add(_amount);

    // The raw price as calculated from the difference between the starting and
    // ending positions.
    uint256 rawPrice =
      equation.calculate(endSupply).sub(equation.calculate(startSupply));

    // Price after adjusting inflation in.
    return rawPrice.mul(curveMultiplier).div(DENOMINATOR);
  }

  /**
   * @dev Calculate sell price for some amounts of tokens in Band
   */
  function getSellPrice(uint256 _amount) public view returns (uint256) {
    uint256 startSupply = commToken.totalSupply();
    uint256 endSupply = startSupply.sub(_amount);

    // The raw price as calcuated from the difference between the starting and
    // ending positions.
    uint256 rawPrice =
      equation.calculate(startSupply).sub(equation.calculate(endSupply));

    // Price after adjusting inflation in.
    return rawPrice.mul(curveMultiplier).div(DENOMINATOR);
  }

  /**
   * @dev Buy some amount of tokens with Band. Revert if sender must pay more
   * than price limit in order to make purchase.
   */
  function buy(uint256 _amount, uint256 _priceLimit) public {
    _adjustAutoInflation();
    uint256 adjustedPrice = getBuyPrice(_amount);
    // Make sure that the sender does not overpay due to slow block / frontrun.
    require(adjustedPrice <= _priceLimit);
    // Get Band tokens from sender and mint community tokens for sender.
    require(bandToken.transferFrom(msg.sender, this, adjustedPrice));
    require(commToken.mint(msg.sender, _amount));
  }

  /**
   * @dev Sell some amount of tokens for Band. Revert if sender will receive
   * less than price limit if the transaction go through.
   */
  function sell(uint256 _amount, uint256 _priceLimit) public {
    _adjustAutoInflation();
    uint256 salesTax = params.getZeroable("bonding:sales_tax");
    uint256 taxedAmount = _amount.mul(salesTax).div(DENOMINATOR);
    uint256 adjustedPrice = getSellPrice(_amount.sub(taxedAmount));
    // Make sure that the sender receive not less than his/her desired minimum.
    require(adjustedPrice >= _priceLimit);
    // Burn community tokens of sender and send Band tokens to sender.
    require(commToken.burn(msg.sender, _amount));
    require(bandToken.transfer(msg.sender, adjustedPrice));

    if (taxedAmount > 0) {
      require(commToken.mint(owner(), taxedAmount));
    }
  }

  /**
   * @dev Deflate the community token by burning _value tokens for _dest.
   * curveMultiplier will adjust up to make sure the equation is consistent.
   */
  function deflate(uint256 _value) public onlyOwner {
    _adjustcurveMultiplier(commToken.totalSupply().sub(_value));
    require(commToken.burn(owner(), _value));
  }

  /**
   * @dev Auto inflate token supply per `inflation_ratio` parameter. This
   * function is expected to be called prior to any buy/sll.
   */
  function _adjustAutoInflation() private {
    uint256 currentSupply = commToken.totalSupply();

    if (currentSupply != 0) {
      uint256 inflationRatio = params.getZeroable("bonding:inflation_ratio");
      uint256 pastSeconds = now.sub(lastInflationTime);
      uint256 inflatedSupply =
        currentSupply.mul(pastSeconds).mul(inflationRatio).div(DENOMINATOR);

      _adjustcurveMultiplier(currentSupply.add(inflatedSupply));
      require(commToken.mint(owner(), inflatedSupply));
    }

    lastInflationTime = now;
  }

  /**
   * @dev Adjust the inflation ratio to match the new supply.
   */
  function _adjustcurveMultiplier(uint256 _newSupply) private {
    uint256 realCollateral = bandToken.balanceOf(this);
    uint256 eqCollateral = equation.calculate(_newSupply);

    require(realCollateral != 0);
    require(eqCollateral != 0);

    curveMultiplier = DENOMINATOR.mul(realCollateral).div(eqCollateral);
    assert(eqCollateral.mul(curveMultiplier).div(DENOMINATOR) <= realCollateral);
  }
}
