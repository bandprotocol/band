pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./BandContractBase.sol";
import "./ParametersBase.sol";
import "./ResolveListener.sol";
import "./VotingInterface.sol";
import "./Feeless.sol";

/*
 * @title Parameters
 *
 * @dev Parameter contract is a one-per-community contract that maintains
 * configuration of everything in the community, including inflation rate,
 * vote quorums, proposal expiration timeout, etc.
 */
contract Parameters is BandContractBase, ParametersBase, ResolveListener, Feeless {
  using SafeMath for uint256;

  event ProposalProposed(  // A new proposal is proposed.
    uint256 indexed proposalID,
    address indexed proposer
  );

  event ProposalAccepted( // A proposol is accepted.
    uint256 indexed proposalID
  );

  event ProposalRejected( // A proposol is rejected.
    uint256 indexed proposalID
  );

  event ParameterInit(  // A parameter is initialized during contract creation.
    bytes32 indexed key,
    uint256 value
  );

  event ParameterProposed(  // A parameter change is proposed.
    uint256 indexed proposalID,
    bytes32 indexed key,
    uint256 value
  );

  CommunityToken public token;
  VotingInterface public voting;

  struct KeyValue {
    bytes32 key;
    uint256 value;
  }

  /**
   * @dev Proposal struct for each of the proposal change that is proposed to
   * this contract.
   */
  struct Proposal {
    uint256 changeCount;
    mapping (uint256 => KeyValue) changes;
  }

  uint256 public nextProposalNonce = 1;
  mapping (uint256 => Proposal) public proposals;

  /**
   * @dev Create parameters contract. Initially set of key-value pairs can be
   * given in this constructor.
   */
  constructor(
    CommunityToken _token,
    VotingInterface _voting,
    bytes32[] memory keys,
    uint256[] memory values
  )
    public
  {
    token = _token;
    voting = _voting;

    require(keys.length == values.length);
    for (uint256 idx = 0; idx < keys.length; ++idx) {
      params[keys[idx]] = values[idx];
      emit ParameterInit(keys[idx], values[idx]);
    }

    (bool ok,) = address(voting).delegatecall(abi.encodePacked(bytes4(keccak256("verifyVotingParams()"))));
    require(ok);

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
  function propose(address sender, bytes32[] calldata keys, uint256[] calldata values)
    external
    feeless(sender)
    returns (uint256)
  {
    require(keys.length == values.length);
    uint256 proposalID = nextProposalNonce;
    nextProposalNonce = proposalID.add(1);

    emit ProposalProposed(
      proposalID,
      sender
    );
    proposals[proposalID].changeCount = keys.length;
    for (uint256 index = 0; index < keys.length; ++index) {
      bytes32 key = keys[index];
      uint256 value = values[index];
      emit ParameterProposed(proposalID, key, value);
      proposals[proposalID].changes[index] = KeyValue(key, value);
    }
    require(
      voting.startPoll(
        token,
        proposalID,
        "params:",
        this
      )
    );
    return proposalID;
  }

  /**
   * @dev Called by the voting contract once the poll is resolved.
   */
  function onResolved(uint256 proposalID, PollState pollState)
    public
    onlyFrom(address(voting))
    returns (bool)
  {
    Proposal storage proposal = proposals[proposalID];
    if (pollState == PollState.Yes) {
      for (uint256 index = 0; index < proposal.changeCount; ++index) {
        bytes32 key = proposal.changes[index].key;
        uint256 value = proposal.changes[index].value;
        params[key] = value;
      }
      emit ProposalAccepted(proposalID);
    } else {
      emit ProposalRejected(proposalID);
    }
    return true;
  }
}
