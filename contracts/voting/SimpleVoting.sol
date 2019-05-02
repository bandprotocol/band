pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./VotingInterface.sol";
import "../feeless/Feeless.sol";
import "../utils/Fractional.sol";

/**
 * @title SimpleVoting
 */
contract SimpleVoting is VotingInterface, Feeless {
  using SafeMath for uint256;
  using Fractional for uint256;

  event SimplePollCreated(  // A poll is created.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed tokenContract,
    uint256 expirationTime,
    uint256 voteMinParticipation,
    uint256 voteSupportRequired,
    uint256 snapshotNonce
  );

  event SimpleVoteCasted(  // A vote is casted by a user.
    address indexed pollContract,
    uint256 indexed pollID,
    address indexed voter,
    uint256 yesWeight,
    uint256 noWeight
  );

  struct Poll {
    CommunityToken token;
    uint256 snapshotNonce;          // The votingPowerNonce to count voting power
    uint256 expirationTime;         // Expiration timestamp of commit period
    uint256 voteSupportRequiredPct; // Threshold % for detemining poll result
    uint256 voteMinParticipation;   // The minimum # of votes required
    uint256 yesCount;               // The current total number of YES votes
    uint256 noCount;                // The current total number of NO votes
    mapping (address => uint256) yesWeights;    // Each user's yes vote weight
    mapping (address => uint256) noWeights;     // Each user's no vote weight
    ResolveListener.PollState pollState;  // The state of this poll.
  }

  // Mapping of all polls ever existed, for each of the poll creators.
  mapping (address => mapping (uint256 => Poll)) public polls;

  modifier pollMustNotExist(address pollContract, uint256 pollID) {
    require(polls[pollContract][pollID].pollState == ResolveListener.PollState.Invalid);
    _;
  }

  modifier pollMustBeActive(address pollContract, uint256 pollID) {
    require(polls[pollContract][pollID].pollState == ResolveListener.PollState.Active);
    _;
  }

  function getPollState(address pollContract, uint256 pollID)
    public view
    returns (ResolveListener.PollState)
  {
    return polls[pollContract][pollID].pollState;
  }

  function getPollTotalVote(address pollContract, uint256 pollID)
    public view
    returns (uint256 yesCount, uint256 noCount)
  {
    Poll storage poll = polls[pollContract][pollID];
    return (poll.yesCount, poll.noCount);
  }

  function getPollUserVote(address pollContract, uint256 pollID, address voter)
    public view
    returns (uint256 yesWeight, uint256 noWeight)
  {
    Poll storage poll = polls[pollContract][pollID];
    return (poll.yesWeights[voter], poll.noWeights[voter]);
  }

  function startPoll(
    CommunityToken token,
    uint256 pollID,
    bytes8 prefix,
    VotingParameters params
  )
    public
    pollMustNotExist(msg.sender, pollID)
    returns (bool)
  {
    uint256 expirationTime = now.add(get(params, prefix, "expiration_time"));
    uint256 voteMinParticipationPct = get(params, prefix, "min_participation_pct");
    uint256 voteSupportRequiredPct = get(params, prefix, "support_required_pct");

    require(expirationTime < 2 ** 64);
    require(voteMinParticipationPct > 0 && voteMinParticipationPct <= Fractional.getDenominator());
    require(voteSupportRequiredPct > 0 && voteSupportRequiredPct <= Fractional.getDenominator());
    uint256 voteMinParticipation = voteMinParticipationPct.multipliedBy(token.totalSupply());

    uint256 snapshotNonce = token.votingPowerChangeNonce();
    polls[msg.sender][pollID] = Poll({
      token: token,
      snapshotNonce: snapshotNonce,
      expirationTime: expirationTime,
      voteSupportRequiredPct: voteSupportRequiredPct,
      voteMinParticipation: voteMinParticipation,
      yesCount: 0,
      noCount: 0,
      pollState: ResolveListener.PollState.Active
    });

    emit SimplePollCreated(
      msg.sender,
      pollID,
      address(token),
      expirationTime,
      voteMinParticipation,
      voteSupportRequiredPct,
      snapshotNonce
    );
    return true;
  }

  function castVote(
    address sender,
    address pollContract,
    uint256 pollID,
    uint256 yesWeight,
    uint256 noWeight
  )
    public
    feeless(sender)
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];
    require(now < poll.expirationTime);
    uint256 totalWeight = poll.token.historicalVotingPowerAtNonce(
      sender,
      poll.snapshotNonce
    );
    require(yesWeight.add(noWeight) <= totalWeight);
    uint256 previousYesWeight = poll.yesWeights[sender];
    uint256 previousNoWeight = poll.noWeights[sender];
    poll.yesCount = poll.yesCount.sub(previousYesWeight).add(yesWeight);
    poll.noCount = poll.noCount.sub(previousNoWeight).add(noWeight);
    poll.yesWeights[sender] = yesWeight;
    poll.noWeights[sender] = noWeight;
    emit SimpleVoteCasted(pollContract, pollID, sender, yesWeight, noWeight);
  }

  function resolvePoll(address pollContract, uint256 pollID)
    public
    pollMustBeActive(pollContract, pollID)
  {
    Poll storage poll = polls[pollContract][pollID];
    require(now >= poll.expirationTime);

    uint256 yesCount = poll.yesCount;
    uint256 noCount = poll.noCount;
    uint256 totalCount = yesCount.add(noCount);

    ResolveListener.PollState pollState;
    if (totalCount < poll.voteMinParticipation) {
      pollState = ResolveListener.PollState.Inconclusive;
    } else if (yesCount.mul(Fractional.getDenominator()) >= poll.voteSupportRequiredPct.mul(totalCount)) {
      pollState = ResolveListener.PollState.Yes;
    } else {
      pollState = ResolveListener.PollState.No;
    }

    poll.pollState = pollState;
    emit PollResolved(pollContract, pollID, pollState);
    require(ResolveListener(pollContract).onResolved(pollID, pollState));
  }

  function get(VotingParameters params, bytes8 prefix, bytes24 key)
    internal view
    returns (uint256)
  {
    uint8 prefixSize = 0;
    while (prefixSize < 8 && prefix[prefixSize] != byte(0)) {
      ++prefixSize;
    }
    return params.get(bytes32(prefix) | (bytes32(key) >> (8 * prefixSize)));
  }
}
