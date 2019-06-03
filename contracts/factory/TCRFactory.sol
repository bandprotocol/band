pragma solidity 0.5.8;

import "../data/QueryTCR.sol";

contract TCRFactory {
  event TCRCreated(QueryTCR tcr, address creator);

  function createTCR(
    bytes8 prefix,
    Parameters params,
    BandRegistry registry
  ) external returns(QueryTCR) {
    QueryTCR tcr = new QueryTCR(prefix, params, registry);
    emit TCRCreated(tcr, msg.sender);
    return tcr;
  }
}
