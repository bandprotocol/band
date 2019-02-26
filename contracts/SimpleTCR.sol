pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./BandContractBase.sol";
import "./CommunityCore.sol";
import "./ResolveListener.sol";
import "./VotingInterface.sol";
import "./Equation.sol";
import "./Feeless.sol";

/**
 * @title SimpleTCR
 *
 * @dev TCR contract implements Token Curated Registry logic, with reward
 * distribution allocated equally to both winning and losing sides.
 */
contract SimpleTCR is BandContractBase, ERC165, ResolveListener, Feeless {
  using SafeMath for uint256;
  using Equation for Equation.Node[];

  event ApplicationSubmitted(  // A new entry is submitted to the TCR.
    bytes32 data,
    address indexed proposer,
    uint256 listAt,
    uint256 deposit
  );

  event EntryDeposited(  // Someone deposits token to an entry
    bytes32 indexed data,
    uint256 value
  );

  event EntryWithdrawn(  // Someone withdraws token from an entry
    bytes32 indexed data,
    uint256 value
  );

  event EntryExited(  // An entry is exited
    bytes32 indexed data
  );

  event ChallengeInitiated(  // An new challenge is initiated.
    bytes32 indexed data,
    bytes32 reasonData,
    uint256 indexed challengeID,
    address indexed challenger,
    uint256 stake
  );

  event ChallengeSuccess(  // A challenge is successful.
    bytes32 indexed data,
    uint256 indexed challengeID,
    uint256 voterRewardPool,
    uint256 challengerReward
  );

  event ChallengeFailed(  // A challenge has failed.
    bytes32 indexed data,
    uint256 indexed challengeID,
    uint256 voterRewardPool,
    uint256 proposerReward
  );

  event ChallengeInconclusive(  // A challenge is not conclusive
    bytes32 indexed data,
    uint256 indexed challengeID
  );

  event ChallengeRewardClaimed(  // A reward is claimed by a user.
    uint256 indexed challengeID,
    address indexed voter,
    uint256 reward
  );

  Equation.Node[] public depositDecayFunction;

  CommunityToken public token;
  VotingInterface public voting;
  ParametersBase public params;

  // Namespace prefix for all parameters (See Parameters.sol) for usage inside
  // this TCR.
  bytes8 public prefix;

  // A TCR entry is considered to exist in 'entries' map iff its
  // 'listedAt' is nonzero.
  struct Entry {
    address proposer;             // The entry proposer
    uint256 withdrawableDeposit;  // Amount token that is not on challenge stake
    uint256 listedAt;             // Expiration time of entry's 'pending' status
    uint256 challengeID;          // ID of challenge, applicable if not zero
  }

  // A challenge represent a challenge for a TCR entry. All challenges ever
  // existed are stored in 'challenges' map below.
  struct Challenge {
    bytes32 entryData;      // The hash of data that is in question
    bytes32 reasonData;     // The hash of reason for this challenge
    address challenger;     // The challenger
    uint256 rewardPool;     // Remaining reward pool. Relevant after resolved.
    uint256 remainingVotes; // Remaining voting power to claim rewards.

    mapping (address => bool) claims;  // Whether the user has claimed rewards.
  }

  // Mapping of entry to its metadata. An entry is considered exist if its
  // 'listedAt' is nonzero.
  mapping (bytes32 => Entry) public entries;

  // Mapping of all changes ever exist in this contract.
  mapping (uint256 => Challenge) public challenges;

  // The ID of the next challenge.
  uint256 nextChallengeNonce = 1;

  constructor(
    bytes8 _prefix,
    CommunityCore _core,
    VotingInterface _voting,
    uint256[] memory _expressions
  )
    public
  {
    _registerInterface(this.applyEntry.selector);
    _registerInterface(this.deposit.selector);
    _registerInterface(this.initiateChallenge.selector);
    prefix = _prefix;
    token = _core.commToken();
    params = _core.params();
    voting = _voting;
    setExecDelegator(token.execDelegator());
    depositDecayFunction.init(_expressions);
  }

  modifier entryMustExist(bytes32 data) {
    require(entries[data].listedAt > 0);
    _;
  }

  modifier entryMustNotExist(bytes32 data) {
    require(entries[data].listedAt == 0);
    _;
  }

  modifier challengeMustExist(uint256 challengeID) {
    require(challengeID > 0 && challengeID < nextChallengeNonce);
    _;
  }

  /**
   * @dev Return true iff the given entry is considered active in TCR at the
   * moment.
   */
  function isEntryActive(bytes32 data) public view returns (bool) {
    uint256 listedAt = entries[data].listedAt;
    return listedAt > 0 && now >= listedAt;
  }

  /**
   * @dev Return true iff the given voter has claimed reward for the given
   * challenge.
   */
  function hasClaimedReward(uint256 challengeID, address voter)
    public
    view
    returns (bool)
  {
    return challenges[challengeID].claims[voter];
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
   * @dev Get current min_deposit of the entry
   */
  function currentMinDeposit(bytes32 entryData)
    public
    view
    entryMustExist(entryData)
    returns (uint256)
  {
    Entry storage entry = entries[entryData];
    uint256 minDeposit = get("min_deposit");
    if (now < entry.listedAt) {
      return minDeposit;
    } else {
      return (minDeposit.mul(
        depositDecayFunction.calculate(now.sub(entry.listedAt)))
      ).div(DENOMINATOR);
    }
  }

  /**
   * @dev Apply a new entry to the TCR. The applicant must stake token at least
   * 'min_deposit'. Application will get auto-approved if no challenge happens
   * during the first 'apply_stage_length' seconds.
   */
  function applyEntry(address proposer, uint256 deposit, bytes32 data)
    external
    onlyFrom(address(token))
    entryMustNotExist(data)
  {
    require(deposit >= get("min_deposit"));
    Entry storage entry = entries[data];
    entry.proposer = proposer;
    entry.withdrawableDeposit = deposit;
    entry.listedAt = now.add(get("apply_stage_length"));
    emit ApplicationSubmitted(data, proposer, entry.listedAt, deposit);
  }

  /**
   * @dev Deposit more token to the given existing entry. The depositor must
   * be the entry applicant.
   */
  function deposit(address depositor, uint256 amount, bytes32 data)
    external
    onlyFrom(address(token))
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == depositor);
    entry.withdrawableDeposit = entry.withdrawableDeposit.add(amount);
    emit EntryDeposited(data, amount);
  }

  /**
   * @dev Withdraw token from the given existing entry to the applicant.
   */
  function withdraw(address sender, bytes32 data, uint256 amount) public
    feeless(sender)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == sender);
    if (entry.challengeID == 0) {
      require(entry.withdrawableDeposit >= amount.add(currentMinDeposit(data)));
    } else {
      require(entry.withdrawableDeposit >= amount);
    }
    entry.withdrawableDeposit = entry.withdrawableDeposit.sub(amount);
    require(token.transfer(sender, amount));
    emit EntryWithdrawn(data, amount);
  }

  /**
   * @dev Delete the entry and refund everything to entry applicant. The entry
   * must not have an ongoing challenge.
   */
  function exit(address sender, bytes32 data) public
    feeless(sender)
    entryMustExist(data)
  {
    Entry storage entry = entries[data];
    require(entry.proposer == sender);
    require(entry.challengeID == 0);
    deleteEntry(data);
    emit EntryExited(data);
  }

  /**
   * @dev Initiate a new challenge to the given existing entry. The entry must
   * not already have ongoing challenge. If entry's deposit is less than
   * 'min_deposit', it is automatically deleted.
   */
  function initiateChallenge(
    address challenger,
    uint256 challengeDeposit,
    bytes32 data,
    bytes32 reasonData
  )
    public
    onlyFrom(address(token))
    entryMustExist(data)
    returns (uint256)
  {
    Entry storage entry = entries[data];
    require(entry.challengeID == 0);

    uint256 stake = Math.min(entry.withdrawableDeposit, currentMinDeposit(data));
    require(challengeDeposit >= stake);

    if (challengeDeposit != stake) {
      require(token.transfer(challenger, challengeDeposit.sub(stake)));
    }

    entry.withdrawableDeposit = entry.withdrawableDeposit.sub(stake);
    uint256 challengeID = nextChallengeNonce;
    entry.challengeID = challengeID;
    challenges[challengeID].entryData = data;
    challenges[challengeID].reasonData = reasonData;
    challenges[challengeID].challenger = challenger;
    challenges[challengeID].rewardPool = stake.mul(2);
    // Increment the nonce for the next challenge.
    nextChallengeNonce = challengeID.add(1);
    emit ChallengeInitiated(data, reasonData, challengeID, challenger, stake.mul(2));
    require(
      voting.startPoll(
        token,
        challengeID,
        prefix,
        params
      )
    );
    return challengeID;
  }

  /**
   * @dev Resolve TCR challenge. If the challenge succeeds, the entry will be
   * removed and the challenger gets the reward. Otherwise, the entry's
   * 'withdrawableDeposit' gets bumped by the reward.
   */
  function onResolved(uint256 challengeID, PollState pollState)
    public
    onlyFrom(address(voting))
    challengeMustExist(challengeID)
    returns (bool)
  {
    Challenge storage challenge = challenges[challengeID];
    bytes32 data = challenge.entryData;
    Entry storage entry = entries[data];
    assert(entry.challengeID == challengeID);
    // After the challenge is resolved, this entry won't have ongoing challenge.
    entry.challengeID = 0;

    (uint256 yesCount, uint256 noCount) =
      voting.getPollTotalVote(address(this), challengeID);
    // We call the following two functions prior to checking `pollState` to avoid 
    // "Stack too deep" error due to Solidity/EVM's limitation of DUPn opcodes.
    (uint256 challengerYesCount, ) = 
      voting.getPollUserVote(address(this), challengeID, challenge.challenger);
    (, uint256 proposerNoCount) = 
      voting.getPollUserVote(address(this), challengeID, entry.proposer);

    uint256 rewardPool = challenge.rewardPool;
    uint256 dispensationPercentage = get("dispensation_percentage");
    require(dispensationPercentage >= 0 && dispensationPercentage <= ONE_HUNDRED_PERCENT);

    // The reward for winning side leader (challenger/entry owner) is the
    // specified percentage of total reward pool.
    // (dispensationPercentage + ONE_HUNDRED_PERCENT)/(TWO_HUNDRED_PERCENT)
    uint256 leaderReward = rewardPool.mul(
      dispensationPercentage.add(ONE_HUNDRED_PERCENT)
    ).div(ONE_HUNDRED_PERCENT.mul(2));

    if (pollState == PollState.Yes) {
      // Automatically claim reward for challenger
      leaderReward = leaderReward.add(
        rewardPool.sub(leaderReward).mul(challengerYesCount).div(yesCount)
      );
      // Challenge succeeds. Challenger gets reward. Entry gets removed.
      require(token.transfer(challenge.challenger, leaderReward));
      deleteEntry(data);
      // The remaining reward is distributed among Yes voters.
      challenge.rewardPool = rewardPool.sub(leaderReward);
      challenge.remainingVotes = yesCount.sub(challengerYesCount);
      challenge.claims[challenge.challenger] = true;

      emit ChallengeSuccess(data, challengeID, challenge.rewardPool, leaderReward);
    } else if (pollState == PollState.No) {
      // Automatically claim reward for the entry
      leaderReward = leaderReward.add(
        rewardPool.sub(leaderReward).mul(proposerNoCount).div(noCount)
      );
      // Challenge fails. Entry deposit is added by reward.
      entry.withdrawableDeposit = entry.withdrawableDeposit.add(leaderReward);
      // The remaining reward is distributed among No voters.
      challenge.rewardPool = rewardPool.sub(leaderReward);
      challenge.remainingVotes = noCount.sub(proposerNoCount);
      challenge.claims[entry.proposer] = true;

      emit ChallengeFailed(data, challengeID, challenge.rewardPool, leaderReward);
    } else if (pollState == PollState.Inconclusive) {
      // Inconclusive. Both challenger and entry owner get half of the pool
      // back. The reward pool then becomes zero. Too bad for voters.
      uint256 halfRewardPool = rewardPool.div(2);
      require(token.transfer(challenge.challenger, halfRewardPool));
      entry.withdrawableDeposit = entry.withdrawableDeposit.add(halfRewardPool);
      challenge.rewardPool = 0;

      emit ChallengeInconclusive(data, challengeID);
    } else {
      revert();
    }

    return true;
  }

  /**
   * @dev Claim reward for the given challenge. The claimer must already reveal
   * the vote that is consistent with vote result.
   */
  function claimReward(address rewardOwner, uint256 challengeID)
    public
    challengeMustExist(challengeID)
  {
    Challenge storage challenge = challenges[challengeID];
    // A challenge must already be resolved with reward pending to be withdrawn
    require(challenge.remainingVotes > 0);
    require(!challenge.claims[rewardOwner]);

    challenge.claims[rewardOwner] = true;

    PollState pollState = voting.getPollState(address(this), challengeID);
    require(pollState == PollState.Yes || pollState == PollState.No);

    (uint256 yesCount, uint256 noCount) =
      voting.getPollUserVote(address(this), challengeID, rewardOwner);

    uint256 claimableCount = (pollState == PollState.Yes) ? yesCount : noCount;
    uint256 rewardPool = challenge.rewardPool;
    uint256 remainingVotes = challenge.remainingVotes;
    uint256 reward = rewardPool.mul(claimableCount).div(remainingVotes);

    challenge.remainingVotes = remainingVotes.sub(claimableCount);
    challenge.rewardPool = rewardPool.sub(reward);

    // Send reward to the claimer.
    require(token.transfer(rewardOwner, reward));
    emit ChallengeRewardClaimed(challengeID, rewardOwner, reward);
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
    delete entries[data];
  }
}
