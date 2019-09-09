pragma solidity 0.5.10;

interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

contract usingBandProtocol {
  using BandLib for Oracle;

  Oracle internal constant FINANCIAL = Oracle(0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e);
  Oracle internal constant LOTTERY = Oracle(0x7b09c1255b27fCcFf18ecC0B357ac5fFf5f5cb31);
  Oracle internal constant SPORT = Oracle(0xF904Db9817E4303c77e1Df49722509a0d7266934);
  Oracle internal constant API = Oracle(0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8);
}

library BandLib {
  function querySpotPrice(Oracle oracle, string memory key) internal returns(uint256) {
    (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(abi.encodePacked('SPOTPX/',key));
    require(status == Oracle.QueryStatus.OK, 'DATA_UNAVAILABLE');
    return uint256(output);
  }

  function querySpotPriceWithExpiry(Oracle oracle, string memory key, uint256 timeLimit) internal returns (uint256) {
    (bytes32 output, uint256 lastUpdated, Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(abi.encodePacked('SPOTPX/',key));
    require(status == Oracle.QueryStatus.OK, 'DATA_UNAVAILABLE');
    require(now - lastUpdated <= timeLimit, 'DATA_OUTDATED');
    return uint256(output);
  }

  function queryScore(Oracle oracle, string memory key) internal returns (uint8, uint8) {
    (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(abi.encodePacked(key));
    require(status == Oracle.QueryStatus.OK, 'DATA_NOT_READY');
    return (uint8(output[0]), uint8(output[1]));
  }

  function queryScoreWithStatus(Oracle oracle, string memory key) internal returns (uint8, uint8, Oracle.QueryStatus) {
    (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(abi.encodePacked(key));
    if (status == Oracle.QueryStatus.OK)
      return (uint8(output[0]), uint8(output[1]), Oracle.QueryStatus.OK);
    return (0, 0, status);
  }

  function queryLottery(Oracle oracle, string memory key) internal returns(uint8[7] memory) {
    (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(abi.encodePacked(key));
    require(status == Oracle.QueryStatus.OK, 'DATA_NOT_READY');
    return getLotteryResult(output);
  }

  function queryLotteryWithStatus(Oracle oracle, string memory key)
    internal
    returns(uint8[7] memory, Oracle.QueryStatus)
  {
    (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(abi.encodePacked(key));
    if (status == Oracle.QueryStatus.OK)
      return (getLotteryResult(output), Oracle.QueryStatus.OK);
    uint8[7] memory zero;
    return (zero,status);
  }

  function getLotteryResult(bytes32 output) internal pure returns(uint8[7] memory) {
    uint8[7] memory result;
    for (uint8 i = 0; i < 7; ++i) {
      result[i] = uint8(output[i]);
    }
    return result;
  }

  /*
    Using for gas station contract for now
  */
  function queryUint256(Oracle oracle, bytes memory key) internal returns(uint256) {
    (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
    require(status == Oracle.QueryStatus.OK, 'DATA_UNAVAILABLE');
    return uint256(output);
  }

  function queryRaw(Oracle oracle, bytes memory key) internal returns(bytes32, uint256, Oracle.QueryStatus) {
    return oracle.query.value(oracle.queryPrice())(key);
  }
}
