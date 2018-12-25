pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./AdminInterface.sol";
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
    bytes32 rewardPortionRootHash
  );

  event RewardDistributionEditted( // An existing reward is modified
    uint256 indexed rewardID,
    address indexed editor,
    uint256 totalReward,
    uint256 totalPortion,
    bytes32 rewardPortionRootHash
  );

  event RewardClaimed(  // Someone claims reward
    uint256 indexed rewardID,
    address indexed member,
    uint256 amount
  );

  Equation.Node[] public equation;

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
  // EIP-777, if finalized, will help with this.
  uint256 public currentBandCollatoralized = 0;

  // Most recent time that reward allocation was submitted to the contract.
  uint256 public lastRewardTime = 0;

  // Amount of token that is in this community core account, but is already
  // entitled to some users as reward.
  uint256 public unwithdrawnReward = 0;

  // ID of the next reward.
  uint256 public nextRewardID = 1;

  // True if the contract is currently active, which is when it is the sole
  // owner of the community token contract. While active, users can buy/sell
  // community tokens through this core contract.
  bool public isActive = false;

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
    Parameters _params,
    uint256[] memory _expressions
  )
    public
  {
    bandToken = _bandToken;
    commToken = _commToken;
    params = _params;
    equation.init(_expressions);
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
   * @dev Throws if this contract is not active. This contract is considered
   * active if it is the owner of the community token contract.
   */
  modifier whenActive() {
    require(isActive);
    _;
  }

  /**
   * @dev Activate this community core contract. Optionally take initialBand
   * parameter to active curve while having nonzero comm token supply.
   */
  function activate(uint256 initialBand) public {
    require(!isActive);
    require(currentBandCollatoralized == 0);
    require(commToken.owner() == address(this));

    if (initialBand != 0) {
      // If initialBand is set, this curve contract takes the tokens from
      // contract activator. The curve is then adjusted to match token supply.
      bandToken.transferFrom(msg.sender, address(this), initialBand);
      currentBandCollatoralized = initialBand;
      _adjustcurveMultiplier();
    } else {
      // Otherwise, it must be the case that the community token does not
      // have any existing supply, e.g. new curve.
      require(commToken.totalSupply() == 0);
    }

    // Set lastInflationTime to the current time. The time period when the
    // contract is not active should be counted as inflation period.
    lastInflationTime = now;

    // Everything is ready. Let's activate this contract.
    isActive = true;
  }

  /**
   * @dev Called by the deactivator to deactivate this community core contract.
   * When that happens, all Band tokens belonging to the curve will be
   * transferred to the deactivator. Buying and selling is forever disabled.
   * The migrator will be entitiled as the community token's owner.
   */
  function deactivate() public whenActive {
    require(uint256(msg.sender) == params.get("core:deactivator"));
    isActive = false;
    if (currentBandCollatoralized != 0) {
      require(bandToken.transfer(msg.sender, currentBandCollatoralized));
      currentBandCollatoralized = 0;
    }
    commToken.transferOwnership(msg.sender);
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

    rewards[nonce].totalReward = totalReward;
    rewards[nonce].totalPortion = totalPortion;
    rewards[nonce].rewardPortionRootHash = rewardPortionRootHash;
    rewards[nonce].activeAt = now.add(params.get("core:reward_edit_period"));

    lastRewardTime = now;
    unwithdrawnReward = currentBalance;

    emit RewardDistributionSubmitted(
      nonce,
      msg.sender,
      totalReward,
      totalPortion,
      rewardPortionRootHash
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
    reward.totalPortion = totalPortion;
    reward.rewardPortionRootHash = rewardPortionRootHash;
    reward.activeAt = now.add(params.get("core:reward_edit_period"));

    emit RewardDistributionSubmitted(
      rewardID,
      msg.sender,
      reward.totalReward,
      totalPortion,
      rewardPortionRootHash
    );
  }

  /**
   * @dev Called by anyone in the community to withdraw rewards.
   * @param rewardID The reward to withdraw.
   * @param rewardPortion The value at the leaf node of the sender.
   * @param proof Merkle proof consistent with the reward's root hash.
   */
  function claimReward(
    uint256 rewardID,
    uint256 rewardPortion,
    bytes32[] calldata proof
  )
    external
  {
    require(rewardID > 0 && rewardID < nextRewardID);

    Reward storage reward = rewards[rewardID];
    require(now >= reward.activeAt);

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

    emit RewardClaimed(rewardID, msg.sender, userReward);
  }

  /**
   * @dev Deflate the community token by burning tokens from the given admin.
   * curveMultiplier will adjust up to make sure the equation is consistent.
   */
  function deflate(uint256 amount) public onlyAdmin whenActive {
    require(commToken.burn(msg.sender, amount));
    _adjustcurveMultiplier();
    emit Deflate(msg.sender, amount);
  }

  /**
   * @dev Buy some amount of tokens with Band. Revert if sender must pay more
   * than price limit in order to make purchase.
   */
  function buy(uint256 amount, uint256 priceLimit) public whenActive {
    _adjustAutoInflation();
    uint256 adjustedPrice = getBuyPrice(amount);
    // Make sure that the sender does not overpay due to slow block / frontrun.
    require(adjustedPrice != 0 && adjustedPrice <= priceLimit);
    // Get Band tokens from sender and mint community tokens for sender.
    require(bandToken.transferFrom(msg.sender, address(this), adjustedPrice));
    require(commToken.mint(msg.sender, amount));

    currentBandCollatoralized = currentBandCollatoralized.add(adjustedPrice);
    emit Buy(msg.sender, amount, adjustedPrice);
  }

  /**
   * @dev Sell some amount of tokens for Band. Revert if sender will receive
   * less than price limit if the transaction goes through.
   */
  function sell(uint256 amount, uint256 priceLimit) public whenActive {
    _adjustAutoInflation();
    uint256 salesCommission = params.getZeroable("core:sales_commission");
    uint256 commissionCost = amount.mul(salesCommission).div(DENOMINATOR);
    uint256 adjustedPrice = getSellPrice(amount.sub(commissionCost));
    // Make sure that the sender receive not less than his/her desired minimum.
    require(adjustedPrice != 0 && adjustedPrice >= priceLimit);
    // Burn community tokens of sender and send Band tokens to sender.
    require(commToken.burn(msg.sender, amount));
    require(bandToken.transfer(msg.sender, adjustedPrice));

    if (commissionCost > 0) {
      require(commToken.mint(address(this), commissionCost));
    }

    currentBandCollatoralized = currentBandCollatoralized.sub(adjustedPrice);
    emit Sell(msg.sender, amount, adjustedPrice, commissionCost);
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
  }
}
