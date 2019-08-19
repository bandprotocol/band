# Query Data from Dataset Contract

Band Protocol aims to augment your decentralized applications with real-world data. Now that you have the connection with Band Protocol's smart contracts, you can start querying data as a simple function call. Follow the tutorials below to get started.

## Requirements

To start consuming data from Band Protocol, the following two conditions must be satisfied.

- **Your smart contract must be funded with Ether**, the native currency of Ethereum. Querying data requires payment in Ether. You can request free ETH on testnets from available faucets ([Kovan faucet](https://faucet.kovan.network/)).

- **You need dataset's unique identifier (address)** associated with the dataset you want. Visit [Available Datasets](../datasets/overview) section to see what's available at the moment.

## Perform Data Query

### Import Band Protocol's Oracle Interface

First, you need to import `Oracle` interface to your smart contract. Depending on the way to connect with Band Protocol, this process can be differ.

**For `band-solidity` users:**

```ts
import { usingBandProtocol, Oracle } from "band-solidity/contracts/main.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
contract MyContract is usingBandProtocol {
  /// ...
}
```

**For non-`band-solidity` users:**

```ts
interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}
```

### Instantiate Oracle Instance

Next, you can instantiate an `Oracle` instance with the dataset address. This object can be used to exchange information with Band Protocol.

```ts
/// Instante an oracle instance for a given dataset address
Oracle oracle = Oracle(0x07416E24085889082d767AF4CA09c37180A3853c)
```

### Check for Query Price

The cost of querying one data point from the dataset contract can be obtained by calling `queryPrice` function on the `Oracle` instance. This function costs nothing to call.

```ts
/// Get the price of querying for one data point (in Wei)
uint256 queryPrice = oracle.queryPrice();
```

### Perform Data Query

The final step is to call `query` function to get for data from the dataset contract. The standard `query` function takes one argument, the input key, together with payment in Ether. It returns three values. See [Reference](reference.md) for the explanations of the returned values. Specifications of input keys can be found
on [dataset pages](../datasets/overview.md).

```ts
/// Make a query for key hex"80dec7374554482f555344" (ETH/USD spot price)
(bytes32 output, uint256 updatedAt, Oracle.Querystatus status) =
  oracle.query.value(queryPrice)(abi.encodePacked(hex"80dec737", "ETH/USD"));
```

Additionally, for developers that use `band-solidity` library, inheriting from `usingBandProtocol` class allows the smart contract to call additional helper methods on `Oracle` object. Full reference is also available in [Reference](reference.md). Some of the examples are provided below.

```ts
/// Get the most-up-to-date ETH/USD rate
uint256 ethusd = oracle.querySpotPrice("ETH/USD");

/// Get the most-up-to-date ETH/USD rate. Must not be older than 10 mins.
uint256 ethusd = oracle.querySpotPriceWithExpiration("ETH/USD", 10 minutes);
```

## Request Data Update

::: warning Notice
In this initial release, Band Foundation is responsible for facilitating data request updates. We are developing a decentralized peer-to-peer network to replace this. See [Data Provider](../providers/overview) for more details.
:::

Although data providers strive to continously supply data to on-chain dataset contracts, it is possible that some data may not be up-to-date the at the moment you need. As a dapp developer, you can request data providers to supply data for a given **key** of a given **dataset** instantly by [POSTing](<https://en.wikipedia.org/wiki/POST_(HTTP)>) a [HTTP](https://en.wikipedia.org/wiki/HTTP) request to [https://data-request.bandprotocol.com](https://data-request.bandprotocol.com). An example is provided below.

```sh
# Request a data update request for key hex"80dec7374554482f555344"
curl -X POST \
  https://data-request.bandprotocol.com \
  -H 'Content-Type: application/json' \
  -d '{
    "network_id": 42,
    "dataset": "0x07416E24085889082d767AF4CA09c37180A3853c",
    "key": "0x80dec7374554482f555344",
    "broadcast": true
}'
```

The example above shows a a request to update spot price of `ETH/USD` pair on Kovan's financial dataset. Notice that the POST request takes a JSON parameter with four inputs.

- `network_id`: Ethereum network ID (e.g. 1 for mainnet, 42 for Kovan)
- `dataset`: Unique address of the dataset to update data
- `key`: Hex-formatted key for data to update. See specification on the dataset page for details.
- `broadcast`: A boolean indicating whether the data update transaction should be automatically broadcast. If **true**, Band Foundation will broadcast the transaction. If **false**, this HTTP request will return an Ethereum transaction data.

This feature is especially necessary for the Web Oracle dataset. You can read more about it [here](../datasets/web-oracle.html).
