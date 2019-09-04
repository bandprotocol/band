# 从数据集合约查询数据

Band Protocol的目的是用真实的数据增强Dapp。现在你已经与Band Protocol的智能合约建立了连接，你可以开始通过一个简单的函数调用来查询数据。按照下面的教程开始。

## 要求

要使用来自Band Protocol的数据，必须满足以下两个条件：

- **智能合约必须支持ETH支付**，你可以从水龙头([Kovan水龙头](https://faucet.kovan.network/))请求测试网获得免费的ETH。

- **你需要数据集的唯一标识符(地址)** 与你想要的数据集关联。访问[可用数据集章节](../datasets/overview.md)，查看当前可用的数据集。

## 执行数据查询

### 导入Band Protocol的Oracle(预言机)接口

首先，你需要将`Oracle`接口导入到智能合约中。根据与Band Protocol 连接的方式，此过程可能有所不同。

**对于使用 `band-solidity` 的开发者：**

```ts
import { usingBandProtocol, Oracle } from "band-solidity/contracts/main.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
contract MyContract is usingBandProtocol {
  /// ...
}
```

**对于不使用`band-solidity` 的开发者：**

```ts
interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}
```

### 实例化Oracle(预言机)实例

接下来，可以使用数据集地址实例化`Oracle`实例。该对象可用于Band Protocol的信息交换。

```ts
/// Instante an oracle instance for a given dataset address
Oracle oracle = Oracle(0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e)
```

### 查询价格

通过在`Oracle`实例上调用`queryPrice`函数，可以获得从数据集合约中查询一个数据点的价格。这个函数不需要任何调用成本。

```ts
/// Get the price of querying for one data point (in Wei)
uint256 queryPrice = oracle.queryPrice();
```

### 执行数据查询

最后一步是调用`query`函数从数据集 合约中获取数据。标准的`query`函数接受一个参数，输入键，连同要支付的Eth。它返回三个值。有关返回值的解释，请参考[资料](reference.md)。输入键的规范可以在[数据集页面](../datasets/overview.md)上找到。


```ts
/// Make a query for key "SPOTPX/ETH-USD" (ETH/USD spot price)
(bytes32 output, uint256 updatedAt, Oracle.Querystatus status) =
  oracle.query.value(queryPrice)("SPOTPX/ETH-USD");
```

此外，对于使用`band-solidity`库的开发人员，继承`usingBandProtocol`类允许智能合约调用`Oracle`对象上的其他`helper`方法。完整的资料请参考[链接](reference.md)。下面提供了一些示例。

```ts
/// Get the most-up-to-date ETH/USD rate
uint256 ethusd = oracle.querySpotPrice("ETH-USD");

/// Get the most-up-to-date ETH/USD rate. Must not be older than 10 mins.
uint256 ethusd = oracle.querySpotPriceWithExpiry("ETH-USD", 10 minutes);
```

## 请求数据更新

::: warning 注意
在这个初始版本中， Band Foundation 负责促进数据请求更新。 我们正在开发一个去中心化的点对点网络来取代它。有关详细信息，请看[数据提供者](../providers/overview.md)。
:::

尽管数据提供者努力不断地向链上数据集的智能合约提供数据，但也有可能有些数据不是你当前需要的最新数据。作为dapp开发者，你可以通过向[https://data-request.bandprotocol.com](https://data-request.bandprotocol.com)发送HTTP POST请求，请求数据提供者立即为给定**数据集**的**给定键**提供数据。下面提供了一个示例。

```sh
# Request a data update request for key SPOTPX/ETH-USD
curl -X POST \
  https://data-request.bandprotocol.com \
  -H 'Content-Type: application/json' \
  -d '{
    "network_id": 42,
    "dataset": "0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e",
    "key": "SPOTPX/ETH-USD",
    "broadcast": true
}'
```

或者

```sh
curl -X POST \
  https://data-request.bandprotocol.com \
  -H 'Content-Type: application/json' \
  -d '{
    "network_id": 42,
    "dataset": "0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e",
    "key": "0x53504f5450582f414d5a4e",
    "broadcast": true
}'
```

上面的例子显示了一个更新Kovan金融数据集中`ETH/USD交易对`的请求。注意，POST请求接受一个带有四个输入的JSON参数。

- `network_id`：Ethereum网络ID(例如1代表mainnet, 42代表Kovan)
- `dataset`：更新数据的数据集的唯一地址
- `key`: 用于更新数据的hex格式或ascii格式密钥。有关详细信息，请参见dataset页面上的介绍。
- `broadcast`: 指示是否应自动广播数据更新交易的布尔值。 如果是 **true**,Band Foundation将广播交易。 如果是 **false**, 此HTTP请求将返回一个Ethereum 交易数据。

这个特性对于`Web Oracle`数据集尤其必要。你可以在[这里](../datasets/web-oracle.md)阅读更多内容。

