pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./IParameters.sol";
import "./Voting.sol";
import "./VerifyProof.sol";


contract Parameters is IParameters {
  using SafeMath for uint256;
  using SMTProofVerifier for bytes32;

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

  uint256 nextProposalNonce = 1;
  mapping (uint256 => Proposal) proposals;

  constructor(Voting _voting, bytes32[] keys, uint256[] values) public {
    voting = _voting;

    require(keys.length == values.length);
    for (uint256 idx = 0; idx < keys.length; ++idx) {
      params[keys[idx]] = values[idx];
    }

    require(get("proposal_expiration_time") > 0);
    require(get("proposal_pass_percentage") <= 100);
  }

  function get(bytes32 key) public view returns (uint256) {
    uint256 value = params[key];
    require(value != 0);
    return value;
  }

  function propose(bytes32 key, uint256 value) external {
    uint256 nonce = nextProposalNonce;
    nextProposalNonce = nonce + 1;

    proposals[nonce].expiration = now + get("proposal_expiration_time");
    proposals[nonce].key = key;
    proposals[nonce].value = value;
    proposals[nonce].votingSnapshot = voting.getVotingPowerSnapshot();
    proposals[nonce].currentVoteCount = 0;
    proposals[nonce].totalVoteCount = voting.getTotalVotingPower();
  }

  function vote(uint256 proposalID, uint256 weight, bytes32[] proof) external {
    Proposal storage proposal = proposals[proposalID];
    address voter = msg.sender;

    require(!proposal.voted[voter]);

    require(proposal.expiration > now);
    require(proposal.votingSnapshot.verifyProof(voter, bytes32(weight), proof));

    proposal.voted[voter] = true;
    proposal.currentVoteCount = proposal.currentVoteCount.add(weight);
  }

  function conclude(uint256 proposalID) external {
    Proposal storage proposal = proposals[proposalID];

    require(proposal.expiration != 0);
    require(proposal.expiration < now);

    require(proposal.currentVoteCount.mul(100) >=
            proposal.totalVoteCount.mul(get("proposal_pass_percentage")));

    params[proposal.key] = proposal.value;
    proposals[proposalID].expiration = 0;
  }
}
