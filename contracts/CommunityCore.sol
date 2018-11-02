pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./IAdminTCR.sol";
import "./IBondingCurve.sol";
import "./IParameters.sol";
import "./Proof.sol";


/**
 * @title CommunityCore
 *
 * @dev TODO
 */
contract CommunityCore {
  using SafeMath for uint256;
  using Proof for bytes32;

  IAdminTCR public admin;
  IBondingCurve public curve;
  IERC20 public bandToken;
  IERC20 public commToken;
  IParameters public params;

  uint256 public currentRewardTime;
  bytes32 public currentRewardHash;
  mapping (address => uint256) public claimedRewards;

  // Denominator for max reward below
  uint256 public constant DENOMINATOR = 1e9;

  constructor(
    IAdminTCR _admin,
    IBondingCurve _curve,
    IParameters _params
  )
    public
  {
    admin = _admin;
    curve = _curve;
    bandToken = _curve.getBandToken();
    commToken = _curve.getCommToken();
    params = _params;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyAdmin() {
    require(admin.isAdmin(msg.sender));
    _;
  }

  function distributeReward(bytes32 rewardHash, uint256 inflatedTokens)
    external
    onlyAdmin
  {
    uint256 rewardPeriod = params.get("core:reward_period");
    uint256 maxReward = params.get("core:max_reward_times_1e9");

    require(now >= currentRewardTime.add(rewardPeriod));
    require(
      inflatedTokens <= commToken.totalSupply().mul(maxReward).div(DENOMINATOR)
    );

    curve.inflate(inflatedTokens, this);
    currentRewardTime += rewardPeriod;
    currentRewardHash = rewardHash;
  }

  function claimReward(uint256 totalReward, bytes32[] proof) external {
    address beneficiary = msg.sender;
    require(currentRewardHash.verify(beneficiary, bytes32(totalReward), proof));
    uint256 claimedReward = claimedRewards[beneficiary];
    require(claimedReward < totalReward);
    claimedRewards[beneficiary] = totalReward;
    commToken.transfer(beneficiary, totalReward - claimedReward);
  }
}
