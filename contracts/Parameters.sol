pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./IParameters.sol";
import "./Proof.sol";
import "./Voting.sol";


contract Parameters is IParameters {
  using SafeMath for uint256;
  using Proof for bytes32;

  // TODO
  Voting public voting;

  // TODO
  mapping (bytes32 => uint256) public params;

  /**
   * @dev TODO
   */
  struct Proposal {
    mapping (address => bool) voted;

    uint256 expiration;

    bytes32 key;
    uint256 value;

    bytes32 votingSnapshot;

    uint256 currentVoteCount;
    uint256 totalVoteCount;
  }

  uint256 public nextProposalNonce = 1;
  mapping (uint256 => Proposal) public proposals;

  event ParameterChanged(bytes32 indexed key, uint256 value);

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

  function get(bytes32 key) public view returns (uint256) {
    uint256 value = params[key];
    require(value != 0);
    return value;
  }

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

  function vote(uint256 proposalID, uint256 weight, bytes32[] proof) external {
    Proposal storage proposal = proposals[proposalID];
    address voter = msg.sender;

    require(!proposal.voted[voter]);

    require(proposal.expiration > now);
    require(proposal.votingSnapshot.verify(voter, bytes32(weight), proof));

    proposal.voted[voter] = true;
    proposal.currentVoteCount = proposal.currentVoteCount.add(weight);

    conclude(proposalID);
  }

  function conclude(uint256 proposalID) private {
    Proposal storage proposal = proposals[proposalID];

    if(proposal.currentVoteCount.mul(100) >=
            proposal.totalVoteCount.mul(get("params:proposal_pass_percentage")))
    {
      params[proposal.key] = proposal.value;
      emit ParameterChanged(proposal.key, proposal.value);
      proposals[proposalID].expiration = 0;
    }
  }

  function hasVoted(uint256 proposalID, address voter) external view returns(bool) {
    return proposals[proposalID].voted[voter];
  }
}
