pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Proof.sol";
import "../token/ERC20Interface.sol";


contract RewardDistributor is Ownable {
  using SafeMath for uint256;
  using Proof for bytes32;

  event RewardDistributionSubmitted(
    uint256 indexed rewardID,
    address indexed submitter,
    uint256 totalReward,
    uint256 totalPortion,
    bytes32 rewardPortionRootHash
  );

  event RewardClaimed(
    uint256 indexed rewardID,
    address indexed member,
    uint256 rewardPortion,
    uint256 amount
  );

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

  ERC20Interface public token;
  uint256 public unwithdrawnReward = 0;
  uint256 public nextRewardID = 1;
  mapping (uint256 => Reward) public rewards;

  constructor(ERC20Interface _token) public {
    token = _token;
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
    onlyOwner
  {
    uint256 nonce = nextRewardID;
    nextRewardID = nonce.add(1);
    uint256 currentBalance = token.balanceOf(address(this));
    uint256 totalReward = currentBalance.sub(unwithdrawnReward);
    rewards[nonce] = Reward({
      totalReward: totalReward,
      totalPortion: totalPortion,
      rewardPortionRootHash: rewardPortionRootHash
    });
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
    require(!reward.claims[beneficiary]);
    reward.claims[beneficiary] = true;
    require(reward.rewardPortionRootHash.verify(
      beneficiary,
      bytes32(rewardPortion),
      proof
    ));
    uint256 userReward = reward.totalReward.mul(rewardPortion).div(reward.totalPortion);
    unwithdrawnReward = unwithdrawnReward.sub(userReward);
    require(token.transfer(beneficiary, userReward));
    emit RewardClaimed(rewardID, beneficiary, rewardPortion, userReward);
  }
}