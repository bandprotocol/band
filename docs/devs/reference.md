# Oracle Interface Reference

## Standard Oracle Interface

The following two functions are implemented by dataset smart contracts. You decentralized application can invoke these functions using `CALL` opcode on EVM.

### `queryPrice`: Get Query Price

- **return**: An `uint256` representing the amount of Ether (in Wei) that needs to be paid for one data query.

```ts
function queryPrice() external view returns (uint256);
```

### `query`: Perform Data Query

- **param - input**: The key to query data, as specified in the dataset's specification.
- **return - output**: The output result of this query as `bytes32`. The result can be parsed as specified in the dataset's specification.
- **return - updatedAt**: The latest time (in [Unix time](https://en.wikipedia.org/wiki/Unix_time)) that this data has been updated.
- **return - status**: The status of this query.
  - `INVALID`: Query is not valid.
  - `OK`: Data is ready for use.
  - `NOT_AVAILABLE`: Data is not available from data providers.
  - `DISAGREEMENT`: Data providers [agree to disagree](https://en.wikipedia.org/wiki/Agree_to_disagree) on the final result.

```ts
enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

function query(bytes calldata input)
  external payable
  returns (bytes32 output, uint256 updatedAt, QueryStatus status);
```

## `band-solidity` Extension

By inheriting from `usingBandProtocol` contract, a smart contract can invoke additional methods on `Oracle` object to perform specific types of queries. These helper methods take care of input key encode and result decode. They also take care of asserting valid query condition (such as by auto-fail if the query status is not `OK`).

Additionally, since these functions are `internal`, the caller does not need to explicitly pass ETH with the call (by using `.value`). Instead, these functions take care of passing ETH to the dataset contract on your behalf.

### `querySpotPrice`: Get Asset Spot Price

Helper method for [Financial Data Feeds](../datasets/financial-kovan.html) dataset to get asset spot price.

- **param - symbol**: The asset's symbol (such as `ETH-USD` or `AAPL`).
- **return**: The most-up-to-date asset spot price (multiplied by 10<sup>18</sup>).

```ts
uint256 price = oracle.querySpotPrice("ETH-USD");
```

### `querySpotPriceWithExpiry`: Get Asset Spot Price with Expiry

Similar to `querySpotPrice`, but with another argument to specify how long to tolerate old data. If data is available, but is older than the specify time, the transaction reverts.

- **param - symbol**: The asset's symbol (such as `ETH-USD` or `AAPL`).
- **param - timeLimit**: The amount of time (in seconds) to tolerate old data.
- **return**: The most-up-to-date asset spot price (multiplied by 10<sup>18</sup>).

```ts
uint256 price = oracle.querySpotPriceWithExpiry("ETH-USD", 10 minutes);
```
