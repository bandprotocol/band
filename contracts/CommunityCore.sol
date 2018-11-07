pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./AdminTCR.sol";
import "./IBondingCurve.sol";
import "./Parameters.sol";
import "./Proof.sol";


/**
 * @title CommunityCore
 *
 * @dev Community Core contract keeps custody of community reward pool. It
 * allows community admins to report per period reward distribution. Anyone
 * can send transaction here to withdraw rewards.
 */
contract CommunityCore {
  using SafeMath for uint256;
  using Proof for bytes32;

  AdminTCR public admin;
  IBondingCurve public curve;
  IERC20 public commToken;
  Parameters public params;

  uint256 public lastRewardTime = 0;
  uint256 public unwithdrawnReward = 0;
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
   * @dev Create community core contract with the given addresses of admin TCR
   * contract, bonding curve contract, and global parameters contract.
   */
  constructor(
    AdminTCR _admin,
    IBondingCurve _curve,
    Parameters _params
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

  /**
   * @dev Destroy the given amount of tokens from the given source. Bonding
   * curve will get deflated appropriately, effectively bumping token price
   * of all existing holders. Only to be called by admins.
   */
  function burnToken(uint256 amount, address source) external onlyAdmin {
    require(commToken.transferFrom(source, this, amount));
    curve.deflate(amount);
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
    nextRewardNonce = nonce + 1;

    uint256 currentBalance = commToken.balanceOf(this);
    rewards[nonce].totalReward = currentBalance.sub(unwithdrawnReward);
    rewards[nonce].totalPortion = totalPortion;
    rewards[nonce].rewardPortionRootHash = rewardPortionHash;

    lastRewardTime = now;
    unwithdrawnReward = currentBalance;
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
}
