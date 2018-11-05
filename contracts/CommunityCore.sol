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
  IERC20 public commToken;
  IParameters public params;

  uint256 public lastRewardTime;
  uint256 public unwithdrawnReward;
  uint256 public nextRewardNonce = 1;

  struct Reward {
    uint256 totalReward;
    uint256 totalPortion;
    bytes32 rewardPortionRootHash;
    mapping (address => bool) claims;
  }

  //
  mapping (uint256 => Reward) public rewards;

  constructor(
    IAdminTCR _admin,
    IBondingCurve _curve,
    IParameters _params
  )
    public
  {
    admin = _admin;
    curve = _curve;
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

  function burnToken(uint256 amount) external onlyAdmin {
    require(commToken.transferFrom(msg.sender, this, amount));
    curve.deflate(amount);
  }

  function distributeReward(bytes32 rewardPortionHash, uint256 totalPortion)
    external
    onlyAdmin
  {
    uint256 rewardPeriod = params.get("core:reward_period");
    require(now >= lastRewardTime.add(rewardPeriod));

    uint256 nonce = nextRewardNonce;
    nextRewardNonce = nonce + 1;

    uint256 currentBalance = commToken.balanceOf(this);
    rewards[nonce].totalReward = currentBalance.sub(unwithdrawnReward);
    rewards[nonce].totalPortion = totalPortion;
    rewards[nonce].rewardPortionRootHash = rewardPortionHash;

    lastRewardTime = now;
    unwithdrawnReward = currentBalance;
  }

  function claimReward(
    uint256 rewardNonce,
    uint256 rewardPortion,
    bytes32[] proof
  )
    external
  {
    address beneficiary = msg.sender;
    Reward storage reward = rewards[rewardNonce];

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
  }
}
