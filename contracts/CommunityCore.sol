pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./AdminTCR.sol";
import "./BandToken.sol";
import "./CommunityToken.sol";
import "./Equation.sol";
import "./Parameters.sol";
import "./Proof.sol";


/**
 * @title CommunityCore
 *
 * @dev Community Core contract keeps custody of community reward pool. It
 * allows community admins to report per period reward distribution. Anyone
 * can send transaction here to withdraw rewards. Community Core contract also
 * acts as the automated market maker, allowing anyone to buy/sell community
 * token with itself.
 */
contract CommunityCore {
  using Equation for Equation.Data;
  using SafeMath for uint256;
  using Proof for bytes32;

  event Buy(  // Someone buys community token.
    address indexed buyer,
    uint256 amount,
    uint256 price
  );

  event Sell(  // Someone sells community token.
    address indexed seller,
    uint256 amount,
    uint256 price
  );

  Equation.Data equation;

  AdminTCR public admin;
  BandToken public bandToken;
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

  // Amount of Band that is currently collatoralized. Note that this may be
  // different from 'bandToken.balanceOf(this)' since someboday can arbitrarily
  // send Band to this contract. We don't want that to affect token price.
  uint256 public currentBandCollatoralized = 0;

  // Most recent time that reward allocation was submitted to the contract.
  uint256 public lastRewardTime = 0;

  // Amount of token that is in this community core account, but is already
  // entitled to some users as reward.
  uint256 public unwithdrawnReward = 0;

  // ID of the next reward.
  uint256 public nextRewardNonce = 1;

  /**
   * @dev Reward struct to keep track of reward distribution/withdrawal for
   * a particular time period.
   */
  struct Reward {
    uint256 totalReward;
    uint256 totalPortion;
    bytes32 rewardPortionRootHash;
    mapping (address => bool) claims;
  }

  mapping (uint256 => Reward) public rewards;

  /**
   * @dev Create community core contract.
   */
  constructor(
    AdminTCR _admin,
    BandToken _bandToken,
    Parameters _params,
    uint256[] _expressions
  ) public {
    admin = _admin;
    bandToken = _bandToken;
    commToken = _params.token();
    params = _params;

    equation.init(_expressions);
    lastInflationTime = now;

    require(commToken.totalSupply() == 0);
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyAdmin() {
    require(admin.isAdmin(msg.sender));
    _;
  }

  /**
   * @dev Calculate buy price for some amounts of tokens in Band
   */
  function getBuyPrice(uint256 amount) public view returns (uint256) {
    uint256 startSupply = commToken.totalSupply();
    uint256 endSupply = startSupply.add(amount);

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
  function getSellPrice(uint256 amount) public view returns (uint256) {
    uint256 startSupply = commToken.totalSupply();
    uint256 endSupply = startSupply.sub(amount);

    // The raw price as calcuated from the difference between the starting and
    // ending positions.
    uint256 rawPrice =
      equation.calculate(startSupply).sub(equation.calculate(endSupply));

    // Price after adjusting inflation in.
    return rawPrice.mul(curveMultiplier).div(DENOMINATOR);
  }

  /**
   * @dev Called by admins to report reward distribution over the past period.
   * @param rewardPortionHash Merkle root of the distribution tree.
   * @param totalPortion Total value of portion assignments (Merkle leaves)
   * of all community participants.
   */
  function distributeReward(bytes32 rewardPortionHash, uint256 totalPortion)
    external
    onlyAdmin
  {
    uint256 rewardPeriod = params.get("core:reward_period");
    require(now >= lastRewardTime.add(rewardPeriod));

    uint256 nonce = nextRewardNonce;
    nextRewardNonce = nonce.add(1);

    uint256 currentBalance = commToken.balanceOf(this);
    rewards[nonce].totalReward = currentBalance.sub(unwithdrawnReward);
    rewards[nonce].totalPortion = totalPortion;
    rewards[nonce].rewardPortionRootHash = rewardPortionHash;

    lastRewardTime = now;
    unwithdrawnReward = currentBalance;
  }

  /**
   * @dev Deflate the community token by burning tokens from the given admin.
   * curveMultiplier will adjust up to make sure the equation is consistent.
   */
  function deflate(uint256 amount) public onlyAdmin {
    _adjustcurveMultiplier(commToken.totalSupply().sub(amount));
    require(commToken.burn(msg.sender, amount));
  }

  /**
   * @dev Called by anyone in the community to withdraw rewards.
   * @param rewardNonce The reward to withdraw.
   * @param rewardPortion The value at the leaf node of the sender.
   * @param proof Merkle proof consistent with the reward's root hash.
   */
  function claimReward(
    uint256 rewardNonce,
    uint256 rewardPortion,
    bytes32[] proof
  )
    external
  {
    require(rewardNonce > 0 && rewardNonce < nextRewardNonce);
    Reward storage reward = rewards[rewardNonce];

    require(!reward.claims[msg.sender]);
    reward.claims[msg.sender] = true;

    require(reward.rewardPortionRootHash.verify(
      msg.sender,
      bytes32(rewardPortion),
      proof
    ));

    uint256 userReward =
      reward.totalReward.mul(rewardPortion).div(reward.totalPortion);

    unwithdrawnReward = unwithdrawnReward.sub(userReward);
    require(commToken.transfer(msg.sender, userReward));
  }

  /**
   * @dev Buy some amount of tokens with Band. Revert if sender must pay more
   * than price limit in order to make purchase.
   */
  function buy(uint256 amount, uint256 priceLimit) public {
    _adjustAutoInflation();
    uint256 adjustedPrice = getBuyPrice(amount);
    // Make sure that the sender does not overpay due to slow block / frontrun.
    require(adjustedPrice <= priceLimit);
    // Get Band tokens from sender and mint community tokens for sender.
    require(bandToken.transferFrom(msg.sender, this, adjustedPrice));
    require(commToken.mint(msg.sender, amount));

    currentBandCollatoralized = currentBandCollatoralized.add(adjustedPrice);
    emit Buy(msg.sender, amount, adjustedPrice);
  }

  /**
   * @dev Sell some amount of tokens for Band. Revert if sender will receive
   * less than price limit if the transaction go through.
   */
  function sell(uint256 amount, uint256 priceLimit) public {
    _adjustAutoInflation();
    uint256 salesTax = params.getZeroable("core:sales_tax");
    uint256 taxedAmount = amount.mul(salesTax).div(DENOMINATOR);
    uint256 adjustedPrice = getSellPrice(amount.sub(taxedAmount));
    // Make sure that the sender receive not less than his/her desired minimum.
    require(adjustedPrice >= priceLimit);
    // Burn community tokens of sender and send Band tokens to sender.
    require(commToken.burn(msg.sender, amount));
    require(bandToken.transfer(msg.sender, adjustedPrice));

    if (taxedAmount > 0) {
      require(commToken.mint(this, taxedAmount));
    }

    currentBandCollatoralized = currentBandCollatoralized.sub(adjustedPrice);
    emit Sell(msg.sender, amount, adjustedPrice);
  }

  /**
   * @dev Auto inflate token supply per `inflation_ratio` parameter. This
   * function is expected to be called prior to any buy/sll.
   */
  function _adjustAutoInflation() private {
    uint256 currentSupply = commToken.totalSupply();

    if (currentSupply != 0) {
      uint256 inflationRatio = params.getZeroable("core:inflation_ratio");
      uint256 pastSeconds = now.sub(lastInflationTime);
      uint256 inflatedSupply =
        currentSupply.mul(pastSeconds).mul(inflationRatio).div(DENOMINATOR);

      _adjustcurveMultiplier(currentSupply.add(inflatedSupply));
      require(commToken.mint(this, inflatedSupply));
    }

    lastInflationTime = now;
  }

  /**
   * @dev Adjust the inflation ratio to match the new supply.
   */
  function _adjustcurveMultiplier(uint256 newSupply) private {
    uint256 eqCollateral = equation.calculate(newSupply);

    require(currentBandCollatoralized != 0);
    require(eqCollateral != 0);

    curveMultiplier =
      DENOMINATOR.mul(currentBandCollatoralized).div(eqCollateral);

    assert(
      eqCollateral.mul(curveMultiplier).div(DENOMINATOR) <=
      currentBandCollatoralized
    );
  }
}
