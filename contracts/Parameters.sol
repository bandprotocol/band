pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./token/SnapshotToken.sol";
import "./utils/Fractional.sol";


contract Parameters is Ownable {
  using SafeMath for uint256;
  using Fractional for uint256;

  event ProposalProposed(uint256 indexed proposalId, address indexed proposer, bytes32 reasonHash);
  event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool vote, uint256 votingPower);
  event ProposalAccepted(uint256 indexed proposalId);
  event ProposalRejected(uint256 indexed proposalId);
  event ParameterChanged(bytes32 indexed key, uint256 value);
  event ParameterProposed(uint256 indexed proposalId, bytes32 indexed key, uint256 value);

  struct ParameterValue { bool existed; uint256 value; }
  struct KeyValue { bytes32 key; uint256 value; }
  enum ProposalState { Invalid, Active, Yes, No, Inconclusive }

  struct Proposal {
    uint256 changesCount;                   /// The number of parameter changes
    mapping (uint256 => KeyValue) changes;  /// The list of parameter changes in proposal
    uint256 snapshotNonce;                  /// The votingPowerNonce to count voting power
    uint256 expirationTime;                 /// Expiration timestamp of commit period
    uint256 voteSupportRequiredPct;         /// Threshold % for detemining poll result
    uint256 voteMinParticipation;           /// The minimum # of votes required
    uint256 totalVotingPower;               /// The total voting power at this snapshotNonce
    uint256 yesCount;                       /// The current total number of YES votes
    uint256 noCount;                        /// The current total number of NO votes
    mapping (address => bool) isVoted;      /// Mapping for check who already voted
    ProposalState proposalState;            /// The state of this proposal.
  }

  SnapshotToken public token;
  Proposal[] public proposals;
  mapping (bytes32 => ParameterValue) public params;

  constructor(SnapshotToken _token) public {
    token = _token;
  }

  function get(bytes8 namespace, bytes24 key) public view returns (uint256) {
    uint8 namespaceSize = 0;
    while (namespaceSize < 8 && namespace[namespaceSize] != byte(0)) ++namespaceSize;
    return getRaw(bytes32(namespace) | (bytes32(key) >> (8 * namespaceSize)));
  }

  function getRaw(bytes32 rawKey) public view returns (uint256) {
    ParameterValue storage param = params[rawKey];
    require(param.existed);
    return param.value;
  }

  function set(bytes8 namespace, bytes24[] memory keys, uint256[] memory values) public onlyOwner {
    require(keys.length == values.length);
    bytes32[] memory rawKeys = new bytes32[](keys.length);
    uint8 namespaceSize = 0;
    while (namespaceSize < 8 && namespace[namespaceSize] != byte(0)) {
      ++namespaceSize;
    }
    for (uint256 i = 0; i < keys.length; i++) {
      rawKeys[i] = bytes32(namespace) | bytes32(keys[i]) >> (8 * namespaceSize);
    }
    setRaw(rawKeys, values);
  }

  function setRaw(bytes32[] memory rawKeys, uint256[] memory values) public onlyOwner {
    require(rawKeys.length == values.length);
    for (uint256 i = 0; i < rawKeys.length; i++) {
      params[rawKeys[i]].existed = true;
      params[rawKeys[i]].value = values[i];
      emit ParameterChanged(rawKeys[i], values[i]);
    }
  }

  function getProposalChange(uint256 proposalId, uint256 changeIndex)
    public view
    returns (bytes32, uint256)
  {
    KeyValue memory keyValue = proposals[proposalId].changes[changeIndex];
    return (keyValue.key, keyValue.value);
  }

  function propose(bytes32 reasonHash, bytes32[] calldata keys, uint256[] calldata values)
    external
  {
    require(keys.length == values.length);
    uint256 proposalId = proposals.length;
    proposals.push(Proposal({
      changesCount: keys.length,
      snapshotNonce: token.votingPowerChangeNonce(),
      expirationTime: now.add(getRaw("params:expiration_time")),
      voteSupportRequiredPct: getRaw("params:support_required_pct"),
      voteMinParticipation: getRaw("params:min_participation_pct").mulFrac(token.totalSupply()),
      totalVotingPower: token.totalSupply(),
      yesCount: 0,
      noCount: 0,
      proposalState: ProposalState.Active
    }));
    emit ProposalProposed(proposalId, msg.sender, reasonHash);
    for (uint256 index = 0; index < keys.length; ++index) {
      bytes32 key = keys[index];
      uint256 value = values[index];
      emit ParameterProposed(proposalId, key, value);
      proposals[proposalId].changes[index] = KeyValue({key: key, value: value});
    }
  }

  function voteOnProposal( uint256 proposalId, bool accepted) public {
    Proposal storage proposal = proposals[proposalId];
    require(proposal.proposalState == ProposalState.Active);
    require(now < proposal.expirationTime);
    require(!proposal.isVoted[msg.sender]);
    uint256 votingPower = token.historicalVotingPowerAtNonce(msg.sender, proposal.snapshotNonce);
    require(votingPower > 0);
    if (accepted) {
      proposal.yesCount = proposal.yesCount.add(votingPower);
    } else {
      proposal.noCount = proposal.noCount.add(votingPower);
    }
    proposal.isVoted[msg.sender] = true;
    emit ProposalVoted(proposalId, msg.sender, accepted, votingPower);
    /// Auto-resolve if the proposal is unanimous
    uint256 minVoteToAccepted = proposal.voteSupportRequiredPct.mulFrac(proposal.totalVotingPower);
    uint256 minVoteToRejected = proposal.totalVotingPower.sub(minVoteToAccepted);
    if (proposal.yesCount >= minVoteToAccepted) {
      _acceptProposal(proposalId);
    } else if (proposal.noCount > minVoteToRejected) {
      _rejectProposal(proposalId);
    }
  }

  function resolve(uint256 proposalId) public {
    Proposal storage proposal = proposals[proposalId];
    require(proposal.proposalState == ProposalState.Active);
    require(now >= proposal.expirationTime);
    uint256 yesCount = proposal.yesCount;
    uint256 noCount = proposal.noCount;
    uint256 totalCount = yesCount.add(noCount);
    if (totalCount >= proposal.voteMinParticipation &&
        yesCount.mul(Fractional.getDenominator()) >= proposal.voteSupportRequiredPct.mul(totalCount)) {
      _acceptProposal(proposalId);
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
