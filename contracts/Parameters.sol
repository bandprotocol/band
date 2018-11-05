pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./IParameters.sol";
import "./Proof.sol";
import "./Voting.sol";


/*
 * @title Parameters
 *
 * @dev Parameter contract is a one-per-community contract that maintains
 * configuration of everything in the community, including inflation rate,
 * vote quorums, proposal expiration timeout, etc.
 */
contract Parameters is IParameters {
  using SafeMath for uint256;
  using Proof for bytes32;

  Voting public voting;

  mapping (bytes32 => uint256) public params;

  /**
   * @dev Proposal struct for each of the proposal change that is proposed to
   * this contract.
   */
  struct Proposal {
    mapping (address => bool) voted;

    // Only proposal with expiration > now is considered valid. Note that this
    // means nonexistent proposal (with experiation default to 0) is never
    // considered.
    uint256 expiration;

    bytes32 key;
    uint256 value;

    // The snapshot (Merkle root) of voting powers at the time the proposal
    // is proposed.
    bytes32 votingSnapshot;

    uint256 currentVoteCount;
    uint256 totalVoteCount;
  }

  uint256 public nextProposalNonce = 1;
  mapping (uint256 => Proposal) public proposals;

  // An event to emit when a parameter proposal is approved by the community.
  event ParameterChanged(bytes32 indexed key, uint256 value);

  /**
   * @dev Create parameters contract. Initially set of key-value pairs can be
   * given in this constructor.
   */
  constructor(Voting _voting, bytes32[] keys, uint256[] values) public {
    voting = _voting;

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

  function hasVoted(uint256 proposalID, address voter)
    external
    view
    returns (bool)
  {
    return proposals[proposalID].voted[voter];
  }

  /**
   * @dev Propose a new key-value change. The proposal must be approved by
   * more than `params:proposal_pass_percentage` of voting power in order to
   * be adopted.
   */
  function propose(bytes32 key, uint256 value) external {
    uint256 nonce = nextProposalNonce;
    nextProposalNonce = nonce + 1;

    proposals[nonce].expiration = now + get("params:proposal_expiration_time");
    proposals[nonce].key = key;
    proposals[nonce].value = value;
    proposals[nonce].votingSnapshot = voting.votingPowerRootHash();
    proposals[nonce].currentVoteCount = 0;
    proposals[nonce].totalVoteCount = voting.totalVotingPower();
  }

  /**
   * @dev Called by token holders to express aggreement with a proposal. See
   * function propose above.
   */
  function vote(uint256 proposalID, uint256 weight, bytes32[] proof) external {
    Proposal storage proposal = proposals[proposalID];
    address voter = msg.sender;

    require(!proposal.voted[voter]);

    require(proposal.expiration > now);
    require(proposal.votingSnapshot.verify(voter, bytes32(weight), proof));

    proposal.voted[voter] = true;
    proposal.currentVoteCount = proposal.currentVoteCount.add(weight);

    if(proposal.currentVoteCount.mul(100) >=
       proposal.totalVoteCount.mul(get("params:proposal_pass_percentage"))) {
      params[proposal.key] = proposal.value;
      emit ParameterChanged(proposal.key, proposal.value);
      proposals[proposalID].expiration = 0;
    }
  }
}
