pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./feeless/Feeless.sol";
import "./utils/Fractional.sol";
import "./utils/KeyUtils.sol";

import "./token/SnapshotToken.sol";

/*
 * @title Parameters
 *
 * @dev Parameter contract is a one-per-community contract that maintains
 * configuration of everything in the community, including inflation rate,
 * vote quorums, proposal expiration timeout, etc.
 */
contract Parameters is Ownable, Feeless {
  using SafeMath for uint256;
  using Fractional for uint256;
  using KeyUtils for bytes8;

  event ProposalProposed(  // A new proposal is proposed.
    uint256 indexed proposalId,
    address indexed proposer,
    bytes32 reasonHash
  );

  event ProposalVoted(  // A vote is casted onp proposal by a user
    uint256 indexed proposalId,
    address indexed voter,
    bool vote,
    uint256 votingPower
  );

  event ProposalAccepted( // A proposol is accepted.
    uint256 indexed proposalId
  );

  event ProposalRejected( // A proposol is rejected.
    uint256 indexed proposalId
  );

  event ParameterChanged(  // A parameter is changed.
    bytes32 indexed key,
    uint256 value
  );

  event ParameterProposed(  // A parameter change is proposed.
    uint256 indexed proposalId,
    bytes32 indexed key,
    uint256 value
  );

  struct ExistedValue {
    bool existed;
    uint256 value;
  }

  SnapshotToken public token;
  mapping (bytes32 => ExistedValue) public params;

  enum ProposalState { Invalid, Active, Yes, No, Inconclusive }

  struct KeyValue {
    bytes32 key;
    uint256 value;
  }

  struct Proposal {
    uint256 changesCount;               // The number of parameter changes
    mapping (uint256 => KeyValue) changes;  // The list of parameter changes in proposal
    uint256 snapshotNonce;              // The votingPowerNonce to count voting power
    uint256 expirationTime;             // Expiration timestamp of commit period
    uint256 voteSupportRequiredPct;     // Threshold % for detemining poll result
    uint256 voteMinParticipation;       // The minimum # of votes required
    uint256 totalVotingPower;           // The total voting power at this snapshotNonce
    uint256 yesCount;                   // The current total number of YES votes
    uint256 noCount;                    // The current total number of NO votes
    mapping (address => bool) isVoted;  // Mapping for check who already voted
    ProposalState proposalState;                // The state of this proposal.
  }

  Proposal[] public proposals;

  modifier proposalMustBeActive(uint256 proposalId) {
    require(proposals[proposalId].proposalState == ProposalState.Active);
    _;
  }

  constructor(SnapshotToken _token) public {
    token = _token;
  }

  /**
   * @dev Return the value at the given key. Revert if the value is not set.
   */
  function get(bytes32 key) public view returns (uint256) {
    ExistedValue storage param = params[key];
    require(param.existed);
    return param.value;
  }

  function getProposalChange(uint256 proposalId, uint256 changeIndex)
    public view
    returns (bytes32, uint256)
  {
    KeyValue memory keyValue = proposals[proposalId].changes[changeIndex];
    return (keyValue.key, keyValue.value);
  }

  function set(bytes32 key, uint256 value)
    public
    onlyOwner
    returns (bool)
  {
    if (params[key].existed) {
      return value == params[key].value;
    }
    params[key].existed = true;
    params[key].value = value;
    emit ParameterChanged(key, value);
    return true;
  }

  /**
   * @dev Propose a set of new key-value changes.
   */
  function propose(address sender, bytes32 reasonHash, bytes32[] calldata keys, uint256[] calldata values)
    external
    feeless(sender)
    returns (uint256)
  {
    require(keys.length == values.length);
    uint256 proposalId = proposals.length;

    proposals.push(Proposal({
      changesCount: keys.length,
      snapshotNonce: token.votingPowerChangeNonce(),
      expirationTime: now.add(get("params:expiration_time")),
      voteSupportRequiredPct: get( "params:support_required_pct"),
      voteMinParticipation: get("params:min_participation_pct").mulFrac(token.totalSupply()),
      totalVotingPower: token.totalSupply(),
      yesCount: 0,
      noCount: 0,
      proposalState: ProposalState.Active
    }));

    emit ProposalProposed(
      proposalId,
      sender,
      reasonHash
    );

    for (uint256 index = 0; index < keys.length; ++index) {
      bytes32 key = keys[index];
      uint256 value = values[index];
      emit ParameterProposed(proposalId, key, value);
      proposals[proposalId].changes[index] = (KeyValue({key: key, value: value}));
    }


    return proposalId;
  }

  function voteOnProposal(
    address sender,
    uint256 proposalId,
    bool accepted
  )
    public
    feeless(sender)
    proposalMustBeActive(proposalId)
  {
    Proposal storage proposal = proposals[proposalId];
    require(now < proposal.expirationTime);
    require(!proposal.isVoted[sender]);
    uint256 votingPower = token.historicalVotingPowerAtNonce(
      sender,
      proposal.snapshotNonce
    );
    require(votingPower > 0);
    if (accepted) {
      proposal.yesCount = proposal.yesCount.add(votingPower);
    } else {
      proposal.noCount = proposal.noCount.add(votingPower);
    }
    proposal.isVoted[sender] = true;
    emit ProposalVoted(proposalId, sender, accepted, votingPower);

    // Auto resolve
    // Check yesVote more than totalVotingPower * voteSupportRequiredPct
    uint256 minVoteToAccepted = proposal.voteSupportRequiredPct.mulFrac(proposal.totalVotingPower);
    if (proposal.yesCount >= minVoteToAccepted) {
      _acceptProposal(proposalId);
      return;
    }
    uint256 minVoteToRejected = proposal.totalVotingPower.sub(minVoteToAccepted);
    if (proposal.noCount > minVoteToRejected) {
      _rejectProposal(proposalId);
    }
  }

  /**
   * @dev Call to resolve a proposal
   */
  function resolve(uint256 proposalId)
    public
    proposalMustBeActive(proposalId)
  {
    Proposal storage proposal = proposals[proposalId];
    require(now >= proposal.expirationTime);

    uint256 yesCount = proposal.yesCount;
    uint256 noCount = proposal.noCount;
    uint256 totalCount = yesCount.add(noCount);

    if (totalCount >= proposal.voteMinParticipation) {
      if (yesCount.mul(Fractional.getDenominator()) >= proposal.voteSupportRequiredPct.mul(totalCount)) {
        _acceptProposal(proposalId);
      } else {
        _rejectProposal(proposalId);
      }
    } else {
      _rejectProposal(proposalId);
    }
  }

  function _acceptProposal(uint256 proposalId) internal {
    Proposal storage proposal = proposals[proposalId];
    proposal.proposalState = ProposalState.Yes;
    for (uint256 index = 0; index < proposal.changesCount; ++index) {
      bytes32 key = proposal.changes[index].key;
      uint256 value = proposal.changes[index].value;
      params[key].existed = true;
      params[key].value = value;
      emit ParameterChanged(key, value);
    }
    emit ProposalAccepted(proposalId);
  }

  function _rejectProposal(uint256 proposalId) internal {
    Proposal storage proposal = proposals[proposalId];
    proposal.proposalState = ProposalState.No;
    emit ProposalRejected(proposalId);
  }
}
