pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ParametersBase.sol";
import "./feeless/Feeless.sol";
import "./voting/ResolveListener.sol";
import "./voting/VotingInterface.sol";

/*
 * @title Parameters
 *
 * @dev Parameter contract is a one-per-community contract that maintains
 * configuration of everything in the community, including inflation rate,
 * vote quorums, proposal expiration timeout, etc.
 */
contract Parameters is Ownable, ParametersBase, ResolveListener, Feeless {
  using SafeMath for uint256;

  event ProposalProposed(  // A new proposal is proposed.
    uint256 indexed proposalID,
    address indexed proposer,
    bytes32 reasonHash
  );

  event ProposalAccepted( // A proposol is accepted.
    uint256 indexed proposalID
  );

  event ProposalRejected( // A proposol is rejected.
    uint256 indexed proposalID
  );

  event ParameterChanged(  // A parameter is changed.
    bytes32 indexed key,
    uint256 value
  );

  event ParameterProposed(  // A parameter change is proposed.
    uint256 indexed proposalID,
    bytes32 indexed key,
    uint256 value
  );

  mapping (bytes32 => uint256) public params;

  CommunityToken public token;
  VotingInterface public voting;

  struct KeyValue {
    bytes32 key;
    uint256 value;
  }

  struct Proposal {
    uint256 changeCount;
    mapping (uint256 => KeyValue) changes;
  }

  uint256 public nextProposalNonce = 1;
  mapping (uint256 => Proposal) public proposals;

  constructor(CommunityToken _token, VotingInterface _voting) public {
    token = _token;
    voting = _voting;
  }

  /**
   * @dev Return the value at the given key. Throw if the value is not set.
   */
  function get(bytes32 key) public view returns (uint256) {
    return params[key];
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

  function set(bytes32 key, uint256 value) public onlyOwner {
    params[key] = value;
    emit ParameterChanged(key, value);
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
    uint256 proposalID = nextProposalNonce;
    nextProposalNonce = proposalID.add(1);

    emit ProposalProposed(
      proposalID,
      sender,
      reasonHash
    );
    proposals[proposalID].changeCount = keys.length;
    for (uint256 index = 0; index < keys.length; ++index) {
      bytes32 key = keys[index];
      uint256 value = values[index];
      emit ParameterProposed(proposalID, key, value);
      proposals[proposalID].changes[index] = KeyValue(key, value);
    }
    require(voting.startPoll(token, proposalID, "params:", this));
    return proposalID;
  }

  /**
   * @dev Called by the voting contract once the poll is resolved.
   */
  function onResolved(uint256 proposalID, PollState pollState)
    public
    returns (bool)
  {
    require(msg.sender == address(voting));
    Proposal storage proposal = proposals[proposalID];
    if (pollState == PollState.Yes) {
      for (uint256 index = 0; index < proposal.changeCount; ++index) {
        bytes32 key = proposal.changes[index].key;
        uint256 value = proposal.changes[index].value;
        params[key] = value;
        emit ParameterChanged(key, value);
      }
      emit ProposalAccepted(proposalID);
    } else {
      emit ProposalRejected(proposalID);
    }
    return true;
  }
}
