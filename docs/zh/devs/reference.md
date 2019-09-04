# Oracle接口规范

## 标准Oracle接口

下面两个函数由数据集智能合约实现。Dapp可以使用EVM上的`CALL`操作码调用这些函数。

### `queryPrice`：获取查询价格

- **返回值**：一个 `uint256`的值，表示一个数据查询需要支付的Eth 数量(单位是Wei)。

```ts
function queryPrice() external view returns (uint256);
```

### `query`: 执行数据查询

- **param - input**: 查询数据的键，如数据集规范中指定的值。
- **return - output**: 该查询的输出结果为 `bytes32`。可以按照数据集规范中的指定解析结果。
- **return - updatedAt**: 此数据已更新的最新时间(Unix时间)。
- **return - status**: 此查询的状态。
  - `INVALID`：查询无效。
  - `OK`：数据已准备好。
  - `NOT_AVAILABLE`：数据无法从数据提供者获得。
  - `DISAGREEMENT`：数据提供者在最终结果上[存在分歧](https://en.wikipedia.org/wiki/Agree_to_disagree)。



```ts
enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

function query(bytes calldata input)
  external payable
  returns (bytes32 output, uint256 updatedAt, QueryStatus status);
```

## `band-solidity` 扩展

通过继承`usingBandProtocol`合约，智能合约可以调用`Oracle`对象上的其他方法来执行特定类型的查询。这些辅助方法负责输入键编码和结果解码。它们还负责断言有效的查询条件(例如，如果查询状态是不`OK`，则自动失败)。

此外，由于这些函数是`internal`函数，调用者不需要显式地将ETH与调用一起传递(通过使用`.value`)。相反，这些函数负责代表你将ETH传递给数据集合约。

### `querySpotPrice`：获取资产现货价格

为[金融数据提供数据](../datasets/financial-kovan.md)集以获取资产现货价格的辅助方法。

- **param - symbol**: 资产的符号(如`ETH-USD`或`AAPL`)。
- **return**: 最新资产现货价格 (乘以10<sup>18</sup>).

```ts
uint256 price = oracle.querySpotPrice("ETH-USD");
```

### `querySpotPriceWithExpiry`：获得到期的资产现货价格

与`querySpotPrice`相似，但是使用另一个参数来指定允许旧数据的时间。如果数据可用，但是比指定的时间更早，交易将恢复(取消)。

- **param - symbol**: 资产的符号(如 `ETH-USD`或`AAPL`)。
- **param - timeLimit**: 允许旧数据的时间(以秒为单位)。
- **return**: 最新资产现货价格(乘以10<sup>18</sup>).

```ts
uint256 price = oracle.querySpotPriceWithExpiry("ETH-USD", 10 minutes);
```
