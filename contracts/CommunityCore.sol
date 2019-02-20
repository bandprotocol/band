pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./AdminInterface.sol";
import "./BandContractBase.sol";
import "./BandToken.sol";
import "./CommunityToken.sol";
import "./Equation.sol";
import "./ParametersBase.sol";
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
contract CommunityCore is BandContractBase, ERC165 {
  using Equation for Equation.Node[];
  using SafeMath for uint256;
  using Proof for bytes32;

  event Buy(  // Someone buys community token
    address indexed buyer,
    uint256 amount,
    uint256 price
  );

  event Sell(  // Someone sells community token
    address indexed seller,
    uint256 amount,
    uint256 price,
    uint256 commissionCost
  );

  event Deflate(  // An admin burns community token to deflate the system
    address indexed admin,
    uint256 amount
  );

  event RewardDistributionSubmitted(  // A new reward distribution is submitted
    uint256 indexed rewardID,
    address indexed submitter,
    uint256 totalReward,
    uint256 totalPortion,
    bytes32 rewardPortionRootHash,
    uint256 activeAt
  );

  event RewardDistributionEditted( // An existing reward is modified
    uint256 indexed rewardID,
    address indexed editor,
    uint256 totalReward,
    uint256 totalPortion,
    bytes32 rewardPortionRootHash,
    uint256 activeAt
  );

  event RewardClaimed(  // Someone claims reward
    uint256 indexed rewardID,
    address indexed member,
    uint256 rewardPortion,
    uint256 amount
  );

  event CurveMultiplierChanged(
    uint256 curveMultiplier
  );

  Equation.Node[] public equation;

  BandToken public bandToken;
  CommunityToken public commToken;
  ParametersBase public params;

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
  // EIP-777, if finalized, will help with this.
  uint256 public currentBandCollatoralized = 0;

  // Most recent time that reward allocation was submitted to the contract.
  uint256 public lastRewardTime = 0;

  // Amount of token that is in this community core account, but is already
  // entitled to some users as reward.
  uint256 public unwithdrawnReward = 0;

  // ID of the next reward.
  uint256 public nextRewardID = 1;

  /**
   * @dev Reward struct to keep track of reward distribution/withdrawal for
   * a particular time period.
   */
  struct Reward {
    uint256 totalReward;
    uint256 totalPortion;
    bytes32 rewardPortionRootHash;
    uint256 activeAt;
    mapping (address => bool) claims;
  }

  mapping (uint256 => Reward) public rewards;

  /**
   * @dev Create community core contract.
   */
  constructor(
    BandToken _bandToken,
    CommunityToken _commToken,
    ParametersBase _params,
    uint256[] memory _expressions
  )
    public
  {
    _registerInterface(this.buy.selector);
    _registerInterface(this.sell.selector);
    bandToken = _bandToken;
    commToken = _commToken;
    params = _params;
    equation.init(_expressions);
    lastInflationTime = now;

    emit CurveMultiplierChanged(curveMultiplier);
  }

  /**
   * @dev Throws if called by any account other than the admin.
   */
  modifier onlyAdmin() {
    AdminInterface admin = AdminInterface(params.get("core:admin_contract"));
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
   * @param rewardPortionRootHash Merkle root of the distribution tree.
   * @param totalPortion Total value of portion assignments (Merkle leaves)
   * of all community participants.
   */
  function addRewardDistribution(
    bytes32 rewardPortionRootHash,
    uint256 totalPortion
  )
    public
    onlyAdmin
  {
    uint256 rewardPeriod = params.get("core:reward_period");
    require(now >= lastRewardTime.add(rewardPeriod));

    _adjustAutoInflation();

    uint256 nonce = nextRewardID;
    nextRewardID = nonce.add(1);

    uint256 currentBalance = commToken.balanceOf(address(this));
    uint256 totalReward = currentBalance.sub(unwithdrawnReward);
    uint256 activeAt = now.add(params.get("core:reward_edit_period"));

    rewards[nonce] = Reward({
      totalReward: totalReward,
      totalPortion: totalPortion,
      rewardPortionRootHash: rewardPortionRootHash,
      activeAt: activeAt
    });

    lastRewardTime = now;
    unwithdrawnReward = currentBalance;

    emit RewardDistributionSubmitted(
      nonce,
      msg.sender,
      totalReward,
      totalPortion,
      rewardPortionRootHash,
      activeAt
    );
  }

  /**
   * @dev Called by admin to edit a not-yet-active reward distribution. After
   * being editted, the distribution active time will get pushed back by
   * 'reward_edit_period'.
   */
  function editRewardDistribution(
    uint256 rewardID,
    bytes32 rewardPortionRootHash,
    uint256 totalPortion
  )
    public
    onlyAdmin
  {
    require(rewardID > 0 && rewardID < nextRewardID);
    Reward storage reward = rewards[rewardID];
    require(now < reward.activeAt);
    uint256 activeAt = now.add(params.get("core:reward_edit_period"));
    reward.totalPortion = totalPortion;
    reward.rewardPortionRootHash = rewardPortionRootHash;
    reward.activeAt = activeAt;

    emit RewardDistributionSubmitted(
      rewardID,
      msg.sender,
      reward.totalReward,
      totalPortion,
      rewardPortionRootHash,
      activeAt
    );
  }

  /**
   * @dev Called by anyone in the community to withdraw rewards.
   * @param beneficiary The address to receive the rewards.
   * @param rewardID The reward to withdraw.
   * @param rewardPortion The value at the leaf node of the sender.
   * @param proof Merkle proof consistent with the reward's root hash.
   */
  function claimReward(
    address beneficiary,
    uint256 rewardID,
    uint256 rewardPortion,
    bytes32[] calldata proof
  )
    external
  {
    require(rewardID > 0 && rewardID < nextRewardID);
    Reward storage reward = rewards[rewardID];
    require(now >= reward.activeAt);
    require(!reward.claims[beneficiary]);
    reward.claims[beneficiary] = true;

    require(reward.rewardPortionRootHash.verify(
      beneficiary,
      bytes32(rewardPortion),
      proof
    ));

    uint256 userReward =
      reward.totalReward.mul(rewardPortion).div(reward.totalPortion);

    unwithdrawnReward = unwithdrawnReward.sub(userReward);
    require(commToken.transfer(beneficiary, userReward));
    emit RewardClaimed(rewardID, beneficiary, rewardPortion, userReward);
  }

  /**
   * @dev Deflate the community token by burning tokens from the given admin.
   * curveMultiplier will adjust up to make the equation is consistent.
   */
  function deflate(uint256 amount) public onlyAdmin {
    require(commToken.burn(msg.sender, amount));
    _adjustcurveMultiplier();
    emit Deflate(msg.sender, amount);
  }

  /**
   * @dev Buy some amount of tokens with Band. Must be called by BandToken
   * contract after `bandAmount` BANDs have been transferred to this contract.
   * Revert if bandAmount is not sufficient. Return extra BANDs back to buyer
   * if the buyer pays too much.
   */
  function buy(address buyer, uint256 priceLimit, uint256 commAmount)
    external
    onlyFrom(address(bandToken))
  {
    _adjustAutoInflation();
    uint256 adjustedPrice = getBuyPrice(commAmount);
    require(adjustedPrice != 0 && adjustedPrice <= priceLimit);
    require(commToken.mint(buyer, commAmount));
    if (priceLimit > adjustedPrice) {
      require(bandToken.transfer(buyer, priceLimit.sub(adjustedPrice)));
    }
    currentBandCollatoralized = currentBandCollatoralized.add(adjustedPrice);
    emit Buy(buyer, commAmount, adjustedPrice);
  }

  /**
   * @dev Sell some amount of tokens for Band. Must be called by CommToken
   * contract after `commAmount` tokens have been transferred to this contract.
   * Revert if sell price is less than `priceLimit`. Some tokens are treated
   * as `commissions` and stay with this contract; the remaining get burnt.
   */
  function sell(address seller, uint256 commAmount, uint256 priceLimit)
    external
    onlyFrom(address(commToken))
  {
    _adjustAutoInflation();
    uint256 salesCommission = params.getZeroable("core:sales_commission");
    require(salesCommission <= DENOMINATOR);
    uint256 commissionCost = commAmount.mul(salesCommission).div(DENOMINATOR);
    uint256 adjustedPrice = getSellPrice(commAmount.sub(commissionCost));
    require(adjustedPrice != 0 && adjustedPrice >= priceLimit);
    if (commissionCost != commAmount) {
      require(commToken.burn(address(this), commAmount.sub(commissionCost)));
    }
    require(bandToken.transfer(seller, adjustedPrice));
    currentBandCollatoralized = currentBandCollatoralized.sub(adjustedPrice);
    emit Sell(seller, commAmount, adjustedPrice, commissionCost);
  }

  /**
   * @dev Auto inflate token supply per `inflation_ratio` parameter. This
   * function is expected to be called prior to any buy/sell/rewardDistribution.
   */
  function _adjustAutoInflation() private {
    uint256 currentSupply = commToken.totalSupply();
    if (currentSupply != 0) {
      uint256 inflationRatio = params.getZeroable("core:inflation_ratio");
      uint256 pastSeconds = now.sub(lastInflationTime);
      uint256 inflatedSupply =
        currentSupply.mul(pastSeconds).mul(inflationRatio).div(DENOMINATOR);

      if (inflatedSupply != 0) {
        require(commToken.mint(address(this), inflatedSupply));
        _adjustcurveMultiplier();
      }
    }
    lastInflationTime = now;
  }

  /**
   * @dev Adjust the inflation ratio to match the new comm token supply.
   */
  function _adjustcurveMultiplier() private {
    uint256 eqCollateral = equation.calculate(commToken.totalSupply());
    require(currentBandCollatoralized != 0);
    require(eqCollateral != 0);
    curveMultiplier =
      DENOMINATOR.mul(currentBandCollatoralized).div(eqCollateral);
    assert(
      eqCollateral.mul(curveMultiplier).div(DENOMINATOR) <=
      currentBandCollatoralized
    );
    emit CurveMultiplierChanged(curveMultiplier);
  }
}
