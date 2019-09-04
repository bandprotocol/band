# 链接到 Band Protocol

在本节中，我们将介绍如何设置将你的项目来连接到Band Protocol。根据项目的状态，有三种主要方法可以将Band Protocol 添加到项目中。

## 创建 一个 Band-Powered 项目

如果你正在使用 [Truffle](https://www.trufflesuite.com/)构建一个新项目，你可以从一个准备好的样板文件中创建新的基于以太坊的项目。运行下面的命令，在一个名为`my_project`的新文件夹下创建一个新项目。

```sh
mkdir my_project
cd my_project
npx truffle unbox bandprotocol/band
```

## 将Band添加到现有项目中

如果你已经有了设置了一个项目， 你安装 `band-solidity` 库作为访问Band Protocol的依赖项。只需安装 [NPM](https://www.npmjs.com/) 或者 [Yarn](https://yarnpkg.com/).

**NPM:**

```sh
npm install band-solidity --save
```

**Yarn:**

```sh
yarn add band-solidity
```

## 直接导入Band的Oracle接口

如果你希望在没有第三方依赖的情况下开发项目，你只需将Band Protocol的`Oracle`接口添加到智能合约文件的顶部即可。

```ts
interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}
```

请注意，通过使用此方法，你将无法访问`band-solidity`的 `utility` 功能。

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
