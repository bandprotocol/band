pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./CommunityToken.sol";


/*
 * @title Parameters
 *
 * @dev Parameter contract is a one-per-community contract that maintains
 * configuration of everything in the community, including inflation rate,
 * vote quorums, proposal expiration timeout, etc.
 */
contract Parameters {
  using SafeMath for uint256;

  event ProposalProposed(  // A new proposal is proposed.
    uint256 indexed proposalID,
    address indexed proposer,
    uint256 expiration,
    uint256 snapshotBlockNo,
    uint256 totalPossibleVoteCount
  );

  event ProposalVoted(  // Someone endorses a proposal.
    uint256 indexed proposalID,
    address indexed voter,
    uint256 yesCount,
    uint256 noCount
  );

  event ProposalResolved( // A proposol is resolved.
    uint256 indexed proposalID
  );

  event ParameterInit(  // A parameter is initiated during contract creation.
    bytes32 indexed key,
    uint256 value
  );

  event ParameterProposed(  // A parameter change is proposed.
    uint256 indexed proposalID,
    bytes32 indexed key,
    uint256 value
  );


  // The address of community token contract used to determine voting power.
  CommunityToken public token;

  // Public map of all active parameters.
  mapping (bytes32 => uint256) public params;

  struct KeyValue {
    bytes32 key;
    uint256 value;
  }

  /**
   * @dev Proposal struct for each of the proposal change that is proposed to
   * this contract.
   */
  struct Proposal {
    mapping (address => bool) voted;

    uint256 snapshotBlockNo;

    // Only proposal with expiration > now is considered valid. Note that this
    // means nonexistent proposal (with experiation default to 0) is never
    // considered.
    uint256 expiration;

    uint256 changeCount;
    mapping (uint256 => KeyValue) changes;

    uint256 currentYesCount;
    uint256 currentNoCount;

    uint256 totalPossibleVoteCount;
  }

  uint256 public nextProposalNonce = 1;
  mapping (uint256 => Proposal) public proposals;

  /**
   * @dev Create parameters contract. Initially set of key-value pairs can be
   * given in this constructor.
   */
  constructor(
    CommunityToken _token,
    bytes32[] memory keys,
    uint256[] memory values
  )
    public
  {
    token = _token;

    require(keys.length == values.length);
    for (uint256 idx = 0; idx < keys.length; ++idx) {
      params[keys[idx]] = values[idx];
      emit ParameterInit(keys[idx], values[idx]);
    }

    require(get("params:proposal_expiration_time") > 0);
    require(get("params:support_required") <= 100);
    require(get("params:minimum_quorum") <= get("params:support_required"));
  }

  /**
   * @dev Return the value at the given key. Throw if the value is not set.
   */
  function get(bytes32 key) public view returns (uint256) {
    uint256 value = params[key];
    require(value != 0);
    return value;
  }

  /**
   * @dev Similar to get function, but returns 0 instead of throwing.
   */
  function getZeroable(bytes32 key) public view returns (uint256) {
    return params[key];
  }

  /**
   * @dev Return whether the given user has voted on the given proposal.
   */
  function hasVoted(uint256 proposalID, address voter)
    public
    view
    returns (bool)
  {
    return proposals[proposalID].voted[voter];
  }

  /**
   * @dev Return the 'changeIndex'^th change of the given proposal.
   */
  function getProposalChange(uint256 proposalID, uint256 changeIndex)
    public
    view
    returns (bytes32, uint256)
  {
    KeyValue memory keyValue = proposals[proposalID].changes[changeIndex];
    return (keyValue.key, keyValue.value);
  }

  /**
   * @dev Propose a set of new key-value changes.
   */
  function propose(bytes32[] calldata keys, uint256[] calldata values) external {
    require(keys.length == values.length);

    uint256 proposalID = nextProposalNonce;
    nextProposalNonce = proposalID.add(1);

    proposals[proposalID].snapshotBlockNo = block.number.sub(1);
    proposals[proposalID].expiration = now.add(get("params:proposal_expiration_time"));
    proposals[proposalID].changeCount = keys.length;

    // NOTE: This could possibliy slightly mismatch with `snapshotBlockNo`
    // if there are be mint/burn transactions in this block prior to
    // this transaction. The effect, however, should be minimal as
    // `minimum_quorum` is primarily used to ensure minimal number of vote
    // participants. The primary decision factor should be `support_required`.
    proposals[proposalID].totalPossibleVoteCount = token.totalSupply();

    emit ProposalProposed(
      proposalID,
      msg.sender,
      proposals[proposalID].expiration,
      proposals[proposalID].snapshotBlockNo,
      proposals[proposalID].totalPossibleVoteCount
    );

    for (uint256 index = 0; index < keys.length; ++index) {
      bytes32 key = keys[index];
      uint256 value = values[index];
      emit ParameterProposed(proposalID, key, value);
      proposals[proposalID].changes[index] = KeyValue(key, value);
    }
  }

  /**
   * @dev Called by token holders to express aggreement with a proposal. See
   * function propose above.
   */
  function vote(uint256 proposalID, uint256 yesCount, uint256 noCount) external {
    Proposal storage proposal = proposals[proposalID];

    require(yesCount > 0 || noCount > 0);

    // Proposal must not yet expired. Note that if the proposal does not exist
    // or is already applied, the expiration will be 0, failing this condition.
    require(proposal.expiration > now);

    // Voter should not have already voted.
    require(!proposal.voted[msg.sender]);
    proposal.voted[msg.sender] = true;

    uint256 totalWeight = token.historicalVotingPowerAtBlock(
      msg.sender,
      proposal.snapshotBlockNo
    );

    require(yesCount.add(noCount) <= totalWeight);

    proposal.currentYesCount = proposal.currentYesCount.add(yesCount);
    proposal.currentNoCount = proposal.currentNoCount.add(noCount);
    emit ProposalVoted(proposalID, msg.sender, yesCount, noCount);
  }

  /**
   * @dev Called by anyone to resolve the parameter proposal. If >=
   * `params:support_required` % of participating voters and >=
   * `params:minimum_quorum` % of all supply vote YES for this proposal,
   * then the change is considered approved.
   */
  function resolve(uint256 proposalID) external {
    Proposal storage proposal = proposals[proposalID];
    // Proposal must already expire
    require(proposal.expiration != 0 && now >= proposal.expiration);
    proposals[proposalID].expiration = 0;

    require(
      proposal.currentYesCount.mul(100) >=
      proposal.currentYesCount.add(proposal.currentNoCount).mul(get("params:support_required"))
    );

    require(
      proposal.currentYesCount.mul(100) >=
      proposal.totalPossibleVoteCount.mul(get("params:minimum_quorum"))
    );

    for (uint256 index = 0; index < proposal.changeCount; ++index) {
      bytes32 key = proposal.changes[index].key;
      uint256 value = proposal.changes[index].value;
      params[key] = value;
    }
    emit ProposalResolved(proposalID);
  }
}
