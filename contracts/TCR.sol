pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./CommunityToken.sol";
import "./Parameters.sol";


/**
 * @title TCR
 *
 * @dev TCR contract implements Token Curated Registry logic.
 */
contract TCR {
  using SafeMath for uint256;

  event NewApplication(  // A new entry is submitted to the TCR.
    bytes32 indexed data,
    address indexed proposer
  );

  event NewChallenge(  // An new challenge is initiated.
    bytes32 indexed data,
    uint256 indexed challengeID,
    address indexed challenger
  );

  event EntryDeleted(  // An entry is removed from the TCR
    bytes32 indexed data,
    address indexed proposer
  );

  event ChallengeResolved(  // A challenge is resolved.
    bytes32 indexed data,
    uint256 indexed challengeID,
    Vote indexed result,
    uint256 rewardPool
  );

  event RewardClaimed(  // A reward is claimed by a user.
    uint256 indexed challengeID,
    address indexed voter,
    uint256 reward
  );

  event VoteCommited(  // A vote is commited by a user.
    uint256 indexed challengeID,
    address indexed voter
  );

  event VoteRevealed(  // A vote is revealed by a user.
    uint256 indexed challengeID,
    address indexed voter,
    bool indexed isYes,
    uint256 weight,
    uint256 salt
  );

  event Deposit(  // Someone deposits token to an entry
    bytes32 indexed data,
    address indexed proposer,
    uint256 value
  );

  event Withdraw(  // Someone withdraws token from an entry
    bytes32 indexed data,
    address indexed proposer,
    uint256 value
  );

  event Exit(  // Someone exits call an entry
    bytes32 indexed data,
    address indexed proposer
  );


  CommunityToken public token;
  Parameters public params;

  // Namespace prefix for all parameters (See Parameters.sol) for usage inside
  // this TCR.
  bytes8 public prefix;

  // A TCR entry is considered to exist in 'entries' map iff its
  // 'pendingExpiration' is nonzero.
  struct Entry {
    address proposer;             // The entry proposer
    uint256 withdrawableDeposit;  // Amount token that is not on challenge stake
    uint256 pendingExpiration;    // Expiration time of entry's 'pending' status
    uint256 challengeID;          // ID of challenge, applicable if not zero
  }

  enum Vote {
    Invalid,      // Invalid, default value
    Yes,          // Vote Yes (agree on the side of challenger)
    No,           // Vote No (agree on the side of entry proposer)
    Inconclusive, // Vote result to be Inconclusive
    YesClaimed,   // Vote Yes and already claim reward
    NoClaimed     // Vote No and already claim reward
  }

  // A challenge represent a challenge for a TCR entry. All challenges ever
  // existed are stored in 'challenges' map below.
  struct Challenge {
    address challenger;     // The challenger
    uint256 rewardPool;     // Remaining reward pool. Relevant after resolved.
    uint256 remainingVotes; // Remaining voting power that not yet claims reward

    uint256 commitEndTime;  // Expiration timestamp of commit period
    uint256 revealEndTime;  // Expiration timestamp of reveal period

    uint256 yesCount;       // The current total number of YES votes
    uint256 noCount;        // The current total number of NO votes

    mapping (address => bytes32) commits; // Each user's commited vote
    mapping (address => uint256) weights; // Each user's vote weight

    // Each user's vote opinion. Becomes Yes or No after the user reveals the
    // vote, but not yet claims the reward. Becomes YesClaimed or NoClaimed
    // after user claims the reward back.
    mapping (address => Vote) opinions;

    // Vote result. Relevant after this challenge is resolved.
    // Can be Yes, No, or Inconclusive.
    Vote result;
  }

  // Mapping of entry to its metadata. An entry is considered exist if its
  // 'pendingExpiration' is nonzero.
  mapping (bytes32 => Entry) public entries;

  // Mapping of all changes ever exist in this contract.
  mapping (uint256 => Challenge) public challenges;

  // The ID of the next challenge.
  uint256 nextChallengeNonce = 1;


  constructor(bytes8 _prefix, Parameters _params) public {
    prefix = _prefix;
    token = _params.token();
    params = _params;
  }

  modifier entryMustExist(bytes32 data) {
    require(entries[data].pendingExpiration > 0);
    _;
  }

  modifier entryMustNotExist(bytes32 data) {
    require(entries[data].pendingExpiration == 0);
    _;
  }

  modifier challengeMustExist(uint256 challengeID) {
    require(challengeID > 0 && challengeID < nextChallengeNonce);
    _;
  }

  /**
   * @dev Get parameter config on the given key. Note that it prepend the key
   * with this contract's prefix to get the absolute key.
   */
  function get(bytes24 key) public view returns (uint256) {
    uint8 prefixSize = 0;
    while (prefixSize < 8 && prefix[prefixSize] != byte(0)) {
      ++prefixSize;
    }
    return params.get(bytes32(prefix) | (bytes32(key) >> (8 * prefixSize)));
  }

  /**
   * @dev Return the commited value of the given user on the given challenge.
   * or bytes32(0) if the user did not commit.
   */
  function commitedValue(uint256 challengeID, address voter)
    public
    view
    challengeMustExist(challengeID)
    returns (bytes32)
  {
    require(challengeID > 0 && challengeID < nextChallengeNonce);
    return challenges[challengeID].commits[voter];
  }

  /**
   * @dev Return the vote the user reveals. Or Invalid if the user has not
   * yet done so. The result will be the 'Claimed' version if user already
   * claims the reward.
   */
  function revealValue(uint256 challengeID, address voter)
    public
    view
    challengeMustExist(challengeID)
    returns (Vote)
  {
    return challenges[challengeID].opinions[voter];
  }

  /**
   * @dev Apply a new entry to the TCR. The applicant must stake token at least
   * 'min_deposit'. Application will get auto-approved if no challenge happens
   * during the first 'apply_stage_length' seconds.
   */
  function apply(bytes32 data, uint256 stake) public entryMustNotExist(data) {
    require(token.transferFrom(msg.sender, this, stake));
    require(stake >= get("min_deposit"));

    Entry storage entry = entries[data];
    entry.proposer = msg.sender;
    entry.withdrawableDeposit = stake;
    entry.pendingExpiration = now.add(get("apply_stage_length"));

    emit NewApplication(data, msg.sender);
  }

  /**
   * @dev Deposit more token to the given existing entry. The depositor must
   * be the entry applicant.
   */
  function deposit(bytes32 data, uint256 amount) public entryMustExist(data) {
    require(token.transferFrom(msg.sender, this, amount));
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    entry.withdrawableDeposit = entry.withdrawableDeposit.add(amount);
    emit Deposit(data, msg.sender, amount);
  }

  /**
   * @dev Withdraw token from the given existing entry to the applicant.
   */
  function withdraw(bytes32 data, uint256 amount) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.withdrawableDeposit >= amount);
    entry.withdrawableDeposit -= amount;
    require(token.transfer(msg.sender, amount));
    emit Withdraw(data, msg.sender, amount);
  }

  /**
   * @dev Delete the entry and refund everything to entry applicant. The entry
   * must not have an ongoing challenge.
   */
  function exit(bytes32 data) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.challengeID == 0);
    deleteEntry(data);
    emit Exit(data, msg.sender);
  }

  /**
   * @dev Initiate a new challenge to the given existing entry. The entry must
   * not already have ongoing challenge. If entry's deposit is less than
   * 'min_deposit', it is automatically deleted.
   */
  function initiateChallenge(bytes32 data) public entryMustExist(data) {
    uint256 stake = get("min_deposit");
    Entry storage entry = entries[data];

    // There must not already be an ongoing challenge.
    require(entry.challengeID == 0);

    if (entry.withdrawableDeposit < stake) {
      // If the deposit is too low, the entry is auto-removed.
      deleteEntry(data);
      return;
    }

    // Take 'stake' tokens from both entry owner and challenger.
    require(token.transferFrom(msg.sender, this, stake));
    entry.withdrawableDeposit -= stake;

    uint256 challengeID = nextChallengeNonce;
    uint256 commitTime = get("commit_time");
    uint256 revealTime = get("reveal_time");

    entry.challengeID = challengeID;
    challenges[challengeID].challenger = msg.sender;
    challenges[challengeID].rewardPool = stake.mul(2);
    challenges[challengeID].commitEndTime = now.add(commitTime);
    challenges[challengeID].revealEndTime = now.add(commitTime).add(revealTime);

    // Increment the nonce for the next challenge.
    nextChallengeNonce = challengeID.add(1);

    emit NewChallenge(data, challengeID, msg.sender);
  }

  /**
   * @dev Commit vote to a particular challenge, with commitValue. commitVote
   * can be called repeatedly until the commit period ends.
   */
  function commitVote(uint256 challengeID, bytes32 commitValue)
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];
    require(now < challenge.commitEndTime);
    challenge.commits[msg.sender] = commitValue;
    emit VoteCommited(challengeID, msg.sender);
  }

  /**
   * @dev Reveal vote with choice and secret salt used in generating commit
   * earlier during the commit period.
   */
  function revealVote(
    uint256 challengeID,
    bool isYes,
    uint256 salt,
    uint256 tokenBalanceNonce
  )
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];
    // Must in reveal period.
    require(now >= challenge.commitEndTime && now < challenge.revealEndTime);
    // Must not already be revealed.
    require(challenge.opinions[msg.sender] == Vote.Invalid);
    // Must be consistent with prior commit value.
    require(
      keccak256(abi.encodePacked(isYes, salt)) == challenge.commits[msg.sender]
    );

    // Get the weight, which is the token balance at the end of commit time.
    uint256 weight = token.historicalBalanceAtTime(
      msg.sender,
      challenge.commitEndTime,
      tokenBalanceNonce
    );

    challenge.weights[msg.sender] = weight;

    if (isYes) {
      challenge.opinions[msg.sender] = Vote.Yes;
      challenge.yesCount = challenge.yesCount.add(weight);
    } else {
      challenge.opinions[msg.sender] = Vote.No;
      challenge.noCount = challenge.noCount.add(weight);
    }

    emit VoteRevealed(challengeID, msg.sender, isYes, weight, salt);
  }

  /**
   * @dev Resolve TCR challenge. If the challenge succeeds, the entry will be
   * removed and the challenger gets the reward. Otherwise, the entry's
   * 'withdrawableDeposit' gets bumped by the reward.
   */
  function resolveChallenge(bytes32 data) public entryMustExist(data) {
    Entry storage entry = entries[data];

    uint256 challengeID = entry.challengeID;
    // Entry must have an ongoing challenge.
    require(challengeID != 0);
    // After the challenge is resolved, this entry won't have ongoing challenge.
    entry.challengeID = 0;

    Challenge storage challenge = challenges[challengeID];
    require(challenge.result == Vote.Invalid);
    require(now >= challenge.revealEndTime);

    uint256 yesCount = challenge.yesCount;
    uint256 noCount = challenge.noCount;
    uint256 totalCount = yesCount.add(noCount);

    bool isYes = yesCount.mul(100) >= totalCount.mul(get("yes_threshold"));
    bool isNo = noCount.mul(100) >= totalCount.mul(get("no_threshold"));

    uint256 rewardPool = challenge.rewardPool;
    uint256 rewardPercentage = get("reward_percentage");
    require(rewardPercentage <= 100);
    require(rewardPercentage >= 50);

    // The reward for winning side leader (challenger/entry owner) is the
    // specified percentage of total reward pool.
    uint256 leaderReward = rewardPool.mul(rewardPercentage).div(100);

    if (isYes && !isNo) {
      challenge.result = Vote.Yes;
      // Challenge succeeds. Challenger gets reward. Entry gets removed.
      require(token.transfer(challenge.challenger, leaderReward));
      deleteEntry(data);
      // The remaining reward is distributed among Yes voters.
      challenge.rewardPool = rewardPool.sub(leaderReward);
      challenge.remainingVotes = yesCount;
    } else if (!isYes && isNo) {
      challenge.result = Vote.No;
      // Challenge fails. Entry deposit is added by reward.
      entry.withdrawableDeposit = entry.withdrawableDeposit.add(leaderReward);
      // The remaining reward is distributed among No voters.
      challenge.rewardPool = rewardPool.sub(leaderReward);
      challenge.remainingVotes = noCount;
    } else {
      challenge.result = Vote.Inconclusive;
      // Inconclusive. Both challenger and entry owner get half of the pool
      // back. The reward pool then becomes zero. Too bad for voters.
      uint256 halfRewardPool = rewardPool.div(2);
      require(token.transfer(challenge.challenger, halfRewardPool));
      entry.withdrawableDeposit = entry.withdrawableDeposit.add(halfRewardPool);
      challenge.rewardPool = 0;
    }

    emit ChallengeResolved(data, challengeID, challenge.result, rewardPool);
  }

  /**
   * @dev Claim reward for the given challenge. The claimer must already reveal
   * the vote that is consistent with vote result.
   */
  function claimReward(uint256 challengeID)
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];

    Vote result = challenge.result;
    Vote vote = challenge.opinions[msg.sender];

    if (vote == Vote.Yes) {
      // User that votes Yes can claim iff poll result is Yes.
      require(result == Vote.Yes);
      // Change user vote status to 'claimed' now that he/she already claims
      challenge.opinions[msg.sender] = Vote.YesClaimed;
    } else if (vote == Vote.No) {
      // User that votes No can claim iff poll result is No.
      require(result == Vote.No);
      // Change user vote status to 'claimed' now that he/she already claims
      challenge.opinions[msg.sender] = Vote.NoClaimed;
    } else {
      // If this hits, either user does not reveal or already claims. In either
      // case, there's no reward to claim.
      revert();
    }

    uint256 rewardPool = challenge.rewardPool;
    uint256 claimerVotes = challenge.weights[msg.sender];
    uint256 remainingVotes = challenge.remainingVotes;

    // User reward is the portion of remaining reward based on the vote count
    // of this user.
    uint256 reward = rewardPool.mul(claimerVotes).div(remainingVotes);

    challenge.remainingVotes = remainingVotes.sub(claimerVotes);
    challenge.rewardPool = rewardPool.sub(reward);

    // Send reward to the claimer.
    require(token.transfer(msg.sender, reward));

    emit RewardClaimed(challengeID, msg.sender, reward);
  }

  /**
   * @dev Delete the given TCR entry and refund the token to entry owner
   */
  function deleteEntry(bytes32 data) internal {
    uint256 withdrawableDeposit = entries[data].withdrawableDeposit;
    address proposer = entries[data].proposer;

    if (withdrawableDeposit > 0) {
      require(token.transfer(proposer, withdrawableDeposit));
    }

    emit EntryDeleted(data, proposer);
    delete entries[data];
  }
}
