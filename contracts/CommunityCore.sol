pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./bonding-curve/ParameterizedBondingCurve.sol";
import "./token/ERC20Interface.sol";

import "./BandContractBase.sol";
import "./BandToken.sol";
import "./CommunityToken.sol";
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
contract CommunityCore is BandContractBase {
  using SafeMath for uint256;
  using Proof for bytes32;

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

  BandToken public bandToken;
  CommunityToken public commToken;
  ParametersBase public params;
  ParameterizedBondingCurve public bondingCurve;

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
    bandToken = _bandToken;
    commToken = _commToken;
    params = _params;
    bondingCurve = new ParameterizedBondingCurve(
      ERC20Interface(address(_bandToken)),
      ERC20Interface(address(_commToken)),
      _expressions,
      _params
    );
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
    // onlyAdmin
  {
    uint256 rewardPeriod = params.get("core:reward_period");
    require(now >= lastRewardTime.add(rewardPeriod));

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
    // onlyAdmin
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
}
