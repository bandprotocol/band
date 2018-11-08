pragma solidity ^0.4.24;

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

  event NewProposal(  // A new parameter key-value is proposed.
    uint256 indexed proposalID,
    bytes32 indexed key,
    uint256 value
  );

  event ProposalVoted(  // Someone endorses a proposal.
    uint256 indexed proposalID,
    address indexed voter,
    uint256 weight
  );

  event ParameterChanged(  // A parameter is changed.
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

    uint256 proposedTime;

    // Only proposal with expiration > now is considered valid. Note that this
    // means nonexistent proposal (with experiation default to 0) is never
    // considered.
    uint256 expiration;

    uint256 changeCount;
    mapping (uint256 => KeyValue) changes;

    uint256 currentVoteCount;
    uint256 totalVoteCount;
  }

  uint256 public nextProposalNonce = 1;
  mapping (uint256 => Proposal) public proposals;

  /**
   * @dev Create parameters contract. Initially set of key-value pairs can be
   * given in this constructor.
   */
  constructor(CommunityToken _token, bytes32[] keys, uint256[] values) public {
    token = _token;

    require(keys.length == values.length);
    for (uint256 idx = 0; idx < keys.length; ++idx) {
      params[keys[idx]] = values[idx];
      emit ParameterChanged(keys[idx], values[idx]);
    }

    require(get("params:proposal_expiration_time") > 0);
    require(get("params:proposal_pass_percentage") <= 100);
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
   * @dev Propose a set of new key-value changes. The proposal must be approved
   * by more than `params:proposal_pass_percentage` of voting power in order to
   * be adopted.
   */
  function propose(bytes32[] keys, uint256[] values) external {
    require(keys.length == values.length);

    uint256 nonce = nextProposalNonce;
    nextProposalNonce = nonce.add(1);

    proposals[nonce].proposedTime = now;
    proposals[nonce].expiration = now.add(get("params:proposal_expiration_time"));
    proposals[nonce].changeCount = keys.length;
    proposals[nonce].currentVoteCount = 0;
    proposals[nonce].totalVoteCount = token.totalSupply();

    for (uint256 index = 0; index < keys.length; ++index) {
      bytes32 key = keys[index];
      uint256 value = values[index];
      proposals[nonce].changes[index] = KeyValue(key, value);
      emit NewProposal(nonce, key, value);
    }
  }

  /**
   * @dev Called by token holders to express aggreement with a proposal. See
   * function propose above.
   */
  function vote(uint256 proposalID, uint256 tokenBalanceNonce) external {
    Proposal storage proposal = proposals[proposalID];
    address voter = msg.sender;

    // Proposal must not yet expired. Note that if the proposal does not exist
    // or is already applied, the expiration will be 0, failing this condition
    require(proposal.expiration > now);

    // Voter should not have already voted.
    require(!proposal.voted[voter]);

    uint256 weight = token.historicalBalanceAtTime(
      voter,
      proposal.proposedTime,
      tokenBalanceNonce
    );

    proposal.voted[voter] = true;
    proposal.currentVoteCount = proposal.currentVoteCount.add(weight);
    emit ProposalVoted(proposalID, msg.sender, weight);

    if(proposal.currentVoteCount.mul(100) >=
       proposal.totalVoteCount.mul(get("params:proposal_pass_percentage"))) {

      for (uint256 index = 0; index < proposal.changeCount; ++index) {
        bytes32 key = proposal.changes[index].key;
        uint256 value = proposal.changes[index].value;

        params[key] = value;
        emit ParameterChanged(key, value);
      }

      proposals[proposalID].expiration = 0;
    }
  }
}
