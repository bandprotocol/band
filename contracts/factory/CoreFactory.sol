pragma solidity 0.5.0;

import "../CommunityToken.sol";
import "../Parameters.sol";
import "../CommunityCore.sol";
import "../voting/CommitRevealVoting.sol";


contract CoreFactory{
  function create(
    BandToken bandToken,
    CommunityToken commToken,
    Parameters params,
    uint256[] calldata expressions
  )
    external
    returns (CommunityCore)
  {
    return new CommunityCore(bandToken, commToken, params, expressions);
  }
}

