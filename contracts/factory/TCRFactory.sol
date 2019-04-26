pragma solidity 0.5.0;

import "../data/TCR.sol";

contract TCRFactory {
  function create(
    bytes8 _prefix,
    CommunityCore _core,
    VotingInterface _voting,
    uint256[] calldata _expressions
  )
    external
    returns (TCR)
  {
    return new TCR(_prefix, _core, _voting, _expressions);
  }
}
