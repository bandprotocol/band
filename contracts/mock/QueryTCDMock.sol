pragma solidity 0.5.9;

import "../data/AggTCD.sol";

contract QueryTCDMock {

  AggTCD public tcd;

  bytes32 public result;
  uint256 public updatedAt;
  QueryInterface.QueryStatus public status;

  constructor(AggTCD _tcd) public {
    tcd = _tcd;
  }

  function query(bytes calldata input) external payable {
    (result, updatedAt, status) = tcd.query.value(tcd.queryPrice(input))(input);
  }
}
