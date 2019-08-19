# Connect with Band Protocol

Now that you are onboard with us. Let's get started on to the actual implementation. In this section, we will go over the way you can set up your project to connect with Band Protocol. Depending on your project's state, there are three primary ways you can add Band Protocol connection to your project.

## Create a Band-Powered Project

If you are building a new project, by using [Truffle](https://www.trufflesuite.com/), you can bootstrap a new Ethereum-based project from a prepared boilerplate. Run the command below to unbox a new Band-powered project into your current directory.

```sh
mkdir my_project
cd my_project
npx truffle unbox bandprotocol/band
```

## Add Band to Your Existing Project

If you already have a project setup, you can install `band-solidity` library as its dependency to gain access to Band Protocol. Simply install the library with [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

**NPM:**

```sh
npm install band-solidity --save
```

**Yarn:**

```sh
yarn add band-solidity
```

## Import Band's Oracle Interface to Your Contract

If you prefer to develop your project without a thrid-party dependency, you can simply add Band Protocol's `Oracle` interface to the top of your smart contract files.

```ts
interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}
```

Note that by using this approach, you will not have access to `band-solidity`'s utility functions.

<!-- # Connect with Band Protocol

Now that you are onboard with us. Let's continue on to the actual implementation. In this section, we will explain how you can write your smart contracts to retrieve data from Band Protocol. We believe you will be impressed by how simple and short it is!

## Add Band to Your Existing Project

If you

## Find Data Sources of your Interest

As explained in [Architecture Section](/band/overview.md), Band Protocol consists of multiple independent data governance groups, each of which serves a different type of data. For example, currency exchange rate dataset on Kovan resides at [0x6566bE6fb21CA90F85b3D22D5D94FEece78B9909](https://kovan.etherscan.io/address/0x6566bE6fb21CA90F85b3D22D5D94FEece78B9909). Visit [Available Datasets Section](/TODO) to see what's currently available and their respective specifications. You will need the address of the dataset contract in order to perform queries. If you can't find the data you want, please submit a request via [this form](/TODO).

## Define Oracle Interface

Next, include the following code snippet to the top of your smart contract. This is Band Protocol's generic `Oracle` interface. It has two functions: `queryPrice` to check the cost of querying a data point, and `query` to perform the actual task (notice that the function is `payable`). You can read the specifications of the two functions [here](/devs/reference.md),

```ts
interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  /// Performs the query and returns the result as a triple
  function query(bytes calldata input)
    external payable returns (bytes output, uint256 updatedAt, QueryStatus status);

  /// Returns the cost of calling `query` function in Wei
  function queryPrice() external view returns (uint256);
}
```

## Perform Query On-Chain

In your smart contract, you can instantiate an `Oracle` instance and perform the query. An example of how to query for an exchange rate between Ether and US dollar is shown below.

```ts
/// An example contract that needs access to ETH/USD price running on Kovan.
contract BandClientExample {
  /// Defines an oracle instance pointing to the dataset address
  Oracle oracle = Oracle(0x6566bE6fb21CA90F85b3D22D5D94FEece78B9909);

  /// Returns the most up-to-date ETH/USD exchange rate times 1e18
  function getETHUSDRate() internal returns (uint256) {
    /// Gets the price (in wei) you need to pay to query
    uint256 price = oracle.queryPrice();
    /// Performs the query with Band Protocol's TCD
    (bytes32 output, uint256 updatedAt, Oracle.QueryStatus status) =
      oracle.query.value(price)("ETH/USD");
    /// Query status must be "OK"
    require(status == Oracle.QueryStatus.OK);
    /// Data must not be older than 15 minutes
    require(updatedAt > now - 15 minutes);
    /// Returns the raw output casted to uint256 per specification
    return uint256(output);
  }
}
```

In this example, `BandClientExample` smart contract has one function `getETHUSDRate`. The function first asks for the price of invoking a query, then performs the query with key `ETH/USD`, as specified in the dataset's [key specification](TODO).

## (Optional) Request Data Update with BandApp

On [Band Data Explorer](https://app.kovan.bandprotocol.com), you will see -->
