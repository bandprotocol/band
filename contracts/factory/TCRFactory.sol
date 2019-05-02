pragma solidity 0.5.0;

import "../data/TCR.sol";

contract TCRFactory {
  function create(
    bytes8 prefix,
    CommunityToken token,
    Parameters params,
    VotingInterface voting,
    uint256[] calldata expressions
  )
    external
    returns (TCR)
  {
    return new TCR(prefix, token, params, voting, expressions);
  }
}
