pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./BandToken.sol";
import "./CommunityCore.sol";
import "./CommunityToken.sol";
import "./Parameters.sol";
import "./Voting.sol";

import "./lib/LibTokenFactory.sol";
import "./lib/LibParametersFactory.sol";
import "./lib/LibCoreFactory.sol";


contract BandFactory is Ownable {
  event BandCreated(
    address bandAddress,
    address indexed owner,
    uint256 totalSupply
  );

  event CommunityCreated(
    uint256 nonce,
    address token,
    address parameter,
    address core
  );

  event NewVotingContractRegistered(
    address indexed voting
  );

  event VotingContractRemoved(
    address indexed voting
  );

  BandToken public band;
  CommunityCore[] public cores;

  mapping (address => bool) public verifiedVotingContracts;

  constructor(uint256 totalSupply) public {
    band = new BandToken(totalSupply, msg.sender);

    emit BandCreated(address(band), msg.sender, totalSupply);
  }

  function createNewCommunity(
    string calldata _name,
    string calldata _symbol,
    uint8 _decimals,
    Voting _voting,
    bytes32[] calldata _keys,
    uint256[] calldata _values,
    uint256[] calldata _expressions
  )
    external
    returns(bool)
  {
    require(verifiedVotingContracts[address(_voting)]);
    CommunityToken token = LibTokenFactory.create(_name, _symbol, _decimals);
    Parameters params = LibParametersFactory.create(token, _voting, _keys, _values);
    CommunityCore core = LibCoreFactory.create(band, token, params, _expressions);

    token.transferOwnership(address(core));
    cores.push(core);

    emit CommunityCreated(
      cores.length - 1,
      address(token),
      address(params),
      address(core));
    return true;
  }

  function addVotingContract(Voting _voting)
    public
    onlyOwner
    returns(bool)
  {
    require(!verifiedVotingContracts[address(_voting)]);
    verifiedVotingContracts[address(_voting)] = true;
    emit NewVotingContractRegistered(address(_voting));
    return true;
  }

  function removeVotingContract(Voting _voting)
    public
    onlyOwner
    returns(bool)
  {
    require(verifiedVotingContracts[address(_voting)]);
    verifiedVotingContracts[address(_voting)] = false;
    emit VotingContractRemoved(address(_voting));
    return true;
  }
}
