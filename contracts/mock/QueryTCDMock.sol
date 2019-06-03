pragma solidity 0.5.8;

import "../data/AggTCD.sol";

contract QueryTCDMock {

  AggTCD public tcd;

  bytes public result;
  QueryInterface.QueryStatus public status;

  constructor(AggTCD _tcd) public {
    tcd = _tcd;
  }

  function query(bytes calldata input) external payable {
    (result, status) = tcd.query.value(tcd.queryPrice(input))(input);
  }
}
