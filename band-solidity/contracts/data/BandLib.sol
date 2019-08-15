pragma solidity 0.5.10;

interface Oracle {
    enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

    function query(bytes calldata input)
        external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

    function queryPrice() external view returns (uint256);
}

contract usingBand {
    Oracle internal constant CRYPTO = Oracle(0x07416E24085889082d767AF4CA09c37180A3853c);
    Oracle internal constant ERC20 = Oracle(0x869e8e455816153A9330D59a854817231E49D9F9);
    Oracle internal constant FOREX = Oracle(0x61Ab2054381206d7660000821176F2A798F031de);
    Oracle internal constant STOCK = Oracle(0x7D3196e2876a62cE3EB5778643c6B909788265d4);

    Oracle internal constant NBA = Oracle(0x7264DE0c942Cd9E00f73f59406Dc7d6eCB3956be);
    Oracle internal constant MLB = Oracle(0x1e604e7963471d644BDAA84A9ff367098ae0742C);
    Oracle internal constant NFL = Oracle(0x022d38e9b53d5F28A5EFA58BA2239865AF987956);
    Oracle internal constant EPL = Oracle(0xf268f91689a728153f0D9f0b5dA4aB912Fce80D1);

    Oracle internal constant PWB = Oracle(0x9cd0E16C9b950971fa6c0BA37b9d358117F582aE);
    Oracle internal constant MMN = Oracle(0xa7197Fbf939d51c9e4E2160394b70a431CcCEc51);

    Oracle internal constant API = Oracle(0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8);
}

library BandLib {

    function queryUint256(Oracle oracle, bytes memory key) internal returns(uint256) {
        (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
        require(status == Oracle.QueryStatus.OK);
        return uint256(output);
    }

    function queryUint256WithTimeLimit(Oracle oracle, bytes memory key, uint256 notOldThan) internal returns (uint256) {
        (bytes32 output, uint256 lastUpdated, Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
        require(status == Oracle.QueryStatus.OK);
        require(lastUpdated >= notOldThan);
        return uint256(output);
    }

    function queryScore(Oracle oracle, bytes memory key) internal returns (uint8, uint8) {
        (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
        require(status == Oracle.QueryStatus.OK);
        return (uint8(output[0]), uint8(output[1]));
    }

    function queryScoreNotRevert(Oracle oracle, bytes memory key) internal returns (uint8, uint8, Oracle.QueryStatus) {
        (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
        if (status == Oracle.QueryStatus.OK)
            return (uint8(output[0]), uint8(output[1]), Oracle.QueryStatus.OK);
        return (0, 0, status);
    }

    function queryLottery(Oracle oracle, bytes memory key) internal returns(uint8[7] memory) {
        (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
        require(status == Oracle.QueryStatus.OK);
        return getLotteryResult(output);
    }

    function queryLotteryNotRevert(Oracle oracle, bytes memory key)
        internal
        returns(uint8[7] memory, Oracle.QueryStatus)
    {
        (bytes32 output, , Oracle.QueryStatus status) = oracle.query.value(oracle.queryPrice())(key);
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

    function queryRaw(Oracle oracle, bytes memory key) internal returns(bytes32, uint256, Oracle.QueryStatus) {
        return oracle.query.value(oracle.queryPrice())(key);
    }
}
