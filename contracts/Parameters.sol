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

  // An event to emit when a parameter proposal is approved by the community.
  event ParameterChanged(bytes32 indexed key, uint256 value);

  // The address of community token contract used to determine voting power.
  CommunityToken public token;

  // Public map of all active parameters.
  mapping (bytes32 => uint256) public params;

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

    bytes32 key;
    uint256 value;

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

    proposals[nonce].proposedTime = now;
    proposals[nonce].expiration = now + get("params:proposal_expiration_time");
    proposals[nonce].key = key;
    proposals[nonce].value = value;
    proposals[nonce].currentVoteCount = 0;
    proposals[nonce].totalVoteCount = token.totalSupply();
  }

  /**
   * @dev Called by token holders to express aggreement with a proposal. See
   * function propose above.
   */
  function vote(uint256 proposalID, uint256 tokenBalanceNonce) external {
    Proposal storage proposal = proposals[proposalID];
    address voter = msg.sender;

    require(!proposal.voted[voter]);

    require(proposal.expiration > now);
    uint256 weight = token.historicalBalanceAtTime(
      voter,
      proposal.proposedTime,
      tokenBalanceNonce
    );

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
