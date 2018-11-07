pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./IParameters.sol";
import "./Voting.sol";


/**
 * @title TCR
 *
 * @dev TCR contract implements Token Curated Registry logic.
 */
contract TCR {
  using SafeMath for uint256;

  event NewApplication(bytes32 data, address indexed proposer);
  event ChallengeResolved(bytes32 data, uint256 challengeID, Voting.VoteResult result);

  IERC20 public token;
  Voting public voting;
  IParameters public params;

  // Namespace prefix for all parameters (See Parameters.sol) for usage inside
  // this TCR.
  bytes8 public prefix;

  // A TCR entry is considered to exist in 'entries' map iff its
  // 'pendingExpiration' is nonzero.
  struct Entry {
    address proposer;
    uint256 withdrawableDeposit;
    uint256 pendingExpiration;
    uint256 challengeID;
  }

  struct Challenge {
    address challenger;
    uint256 rewardPool;
    uint256 remainingVotes;

    Voting.VoteResult result;
    mapping (address => bool) claims;
  }

  mapping (bytes32 => Entry) public entries;
  mapping (uint256 => Challenge) public challenges;

  constructor(
    bytes8 _prefix,
    IERC20 _token,
    Voting _voting,
    IParameters _params
  )
    public
  {
    prefix = _prefix;
    token = _token;
    voting = _voting;
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

  function get(bytes24 key) public view returns (uint256) {
    return params.get(bytes32(prefix) | (bytes32(key) >> 64));
  }

  function hasClaimed(uint256 challengeID, address voter)
    public
    view
    returns (bool)
  {
    return challenges[challengeID].claims[voter];
  }

  function apply(bytes32 data, uint256 stake) public entryMustNotExist(data) {
    require(stake >= get("min_deposit"));
    require(token.transferFrom(msg.sender, this, stake));
    Entry storage entry = entries[data];
    entry.proposer = msg.sender;
    entry.withdrawableDeposit = stake;
    entry.pendingExpiration = now + get("apply_stage_length");
    emit NewApplication(data, msg.sender);
  }

  function deposit(bytes32 data, uint256 amount) public entryMustExist(data) {
    require(token.transferFrom(msg.sender, this, amount));
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    entry.withdrawableDeposit = entry.withdrawableDeposit.add(amount);
  }

  function withdraw(bytes32 data, uint256 amount) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.withdrawableDeposit >= amount);
    entry.withdrawableDeposit -= amount;
    require(token.transfer(msg.sender, amount));
  }

  function exit(bytes32 data) public entryMustExist(data) {
    Entry storage entry = entries[data];
    require(entry.proposer == msg.sender);
    require(entry.challengeID == 0);
    deleteEntry(data);
  }

  function initiateChallenge(bytes32 data) public entryMustExist(data) {
    uint256 stake = get("min_deposit");
    Entry storage entry = entries[data];

    require(entry.challengeID == 0);
    if (entry.withdrawableDeposit < stake) {
      deleteEntry(data);
      return;
    }

    require(token.transferFrom(msg.sender, this, stake));
    entry.withdrawableDeposit -= stake;

    uint256 challengeID = voting.startPoll(
      uint8(get("yes_threshold")),
      uint8(get("no_threshold")),
      get("commit_time"),
      get("reveal_time")
    );

    entry.challengeID = challengeID;
    challenges[challengeID].challenger = msg.sender;
    challenges[challengeID].rewardPool = stake.mul(2);
  }

  function resolveChallenge(bytes32 data) public entryMustExist(data) {
    Entry storage entry = entries[data];

    uint256 challengeID = entry.challengeID;
    require(challengeID != 0);
    entry.challengeID = 0;

    Voting.VoteResult result = voting.getResult(challengeID);
    require(result != Voting.VoteResult.Invalid);

    Challenge storage challenge = challenges[challengeID];

    require(challenge.result == Voting.VoteResult.Invalid);
    challenge.result = result;

    uint256 rewardPool = challenge.rewardPool;

    emit ChallengeResolved(data, challengeID, result);

    if (result == Voting.VoteResult.Inconclusive) {
      // Inconclusive
      require(token.transfer(challenge.challenger, rewardPool.div(2)));
      entry.withdrawableDeposit += rewardPool.div(2);
      challenge.rewardPool = 0;
      return;
    }

    uint256 rewardPercentage = get("reward_percentage");
    require(rewardPercentage <= 100);
    require(rewardPercentage >= 50);


    uint256 reward = rewardPool.mul(rewardPercentage).div(100);

    if (result == Voting.VoteResult.Yes) {
      // Challenge success
      require(token.transfer(challenge.challenger, reward));
      deleteEntry(data);
    } else if (result == Voting.VoteResult.No) {
      // Challenge fail
      entry.withdrawableDeposit += reward;
    } else {
      assert(false);
    }

    challenge.rewardPool -= reward;
    challenge.remainingVotes = voting.getTotalVotes(challengeID, result);
  }

  function claimReward(uint256 challengeID) public {
    Challenge storage challenge = challenges[challengeID];

    require(!challenge.claims[msg.sender]);
    challenge.claims[msg.sender] = true;

    uint256 senderVotes =
      voting.getUserVotes(challengeID, msg.sender, challenge.result);
    uint256 reward =
      challenge.rewardPool.mul(senderVotes).div(challenge.remainingVotes);

    challenge.remainingVotes -= senderVotes;
    challenge.rewardPool -= reward;
    require(token.transfer(msg.sender, reward));
  }

  function isEntryValid(bytes32 data) internal view returns (bool) {
    return entries[data].pendingExpiration >= now;
  }

  function deleteEntry(bytes32 data) internal {
    uint256 withdrawableDeposit = entries[data].withdrawableDeposit;
    if (withdrawableDeposit > 0) {
      require(token.transfer(entries[data].proposer, withdrawableDeposit));
    }
    delete entries[data];
  }
}
