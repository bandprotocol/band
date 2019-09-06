# 完整介绍

我们总结了一个Dapp开发者指南的完整流程，来建立一个简单的智能合约，使用的数据来自Band Protocol。

## 安装 MetaMask

::: tip
如果你早已经安装了MetaMask浏览器插件，请切换到Kovan网络并跳到[下一节](#request-kovan-testnet-ether)。
:::

[MetaMask](https://metamask.io)是一个浏览器钱包，允许你通过浏览器(Chrome或Firefox)与Ethereum交互。使用MetaMask，你可以在真实网络(mainnet)和测试网络中拥有以太币。你还可以使用ETH部署智能合约或将交易发送到网络。要安装MetaMask，请访问https://metamask.io 并下载浏览器插件。

创建新的账号，你将面对屏幕，屏幕顶部显示你的地址(可以单击复制)和0 ETH。将网络选择更改为`Kovan测试网络`。假设你连接到Kovan，我们将继续下一步。

<div align="center">
  <figure>
    <img src='/assets/metmask-no-eth.png'>
  </figure>
</div>

## 申请Kovan测试币

::: tip
如果你已经拥有Kovan测试网以太(KETH)，请跳到[下一节](#write-your-first-smart-contract)。
:::

现在已经安装了MetaMask并连接到Kovan测试网络，下一步是获取以太测试币。进入到 https://faucet.kovan.network 进入Kovan水龙头。

<div align="center">
  <figure>
    <img src='/assets/kovan-faucet-home.png'>
  </figure>
</div>

使用[Github](https://github.com)登录后，输入你的Eth地址。这个地址将收到Kovan测试币(KETH)。

<div align="center">
  <figure>
    <img src='/assets/kovan-faucet-login.png'>
  </figure>
</div>

## 写第一个智能合约

为了简化本教程，我们不打算设置一个完整的开发环境。我们使用[Remix](https://remix.ethereum.org)编写智能合约，这是一种在线的智能合约开发工具。访问 https://remix.ethereum.org，你将看到一个编辑空间。

将以下代码粘贴到编辑器。这个示例智能合约包含一个`update`函数，它将从Band Protocol的Kovan financial feeds获取Ethereum和美元之间的汇率，并将结果保存到 `ethusd`。

```ts
pragma solidity ^0.5.0;

interface Oracle {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }
  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);
  function queryPrice() external view returns (uint256);
}

contract ExampleContract {
  uint256 public ethusd;

  function update() public payable {
    Oracle oracle = Oracle(0x07416E24085889082d767AF4CA09c37180A3853c);
    (bytes32 raw,,) = oracle.query.value(oracle.queryPrice())("ETH/USD");
    ethusd = uint256(raw);
  }
}
```

## 部署和测试合约

合约完成后，转到 "Deploy and Run Transaction" 选项卡，单击`Deploy`部署智能合约。请注意，必须选择`Injected Web3`才能通过MetaMask部署。另一个提醒是必须将MetaMask network设置为Kovan。

<div align="center">
  <figure>
    <img src='/assets/remix-deploy.png'>
  </figure>
</div>

成功部署合约之后，单击左边按钮上的`update`按钮发送交易来调用 `update`函数。要成功调用此函数，调用者必须使用`0.001 ETH`作为查询费。可以在 `Value`选项卡中指定。

<div align="center">
  <figure>
    <img src='/assets/remix-click-update.png'>
  </figure>
</div>

一旦交易确认后，单击`ethusd`按钮查询`ethusd`的值。你会看到它从零变成了以美元为单位的ETH的当前价格，用乘以10<sup>18</sup>的值表示。在这个例子中，当前的以太坊价格大约是200.55美元。

<div align="center">
  <figure>
    <img src='/assets/remix-get-ethusd.png'>
  </figure>
</div>
