# Complete Walkthrough

We conclude dapp developer guide with a complete walkthrough to build a simple smart contract that consumes data from Band Protocol.

## Install MetaMask

::: tip
If you already have MetaMask browser extension installed, switch to Kovan network and skip to the [next section](#request-kovan-testnet-ether).
:::

[MetaMask](https://metamask.io) is a brower wallet that allows you to interact with Ethereum from web browser (Chrome or Firefox). With MetaMask, you can own Ether, the native currency of Ethereum, both in real network (mainnet) and test networks. You can also spend ETH to deploy smart contracts or send transactions to the network. To install MetaMask, go to [https://metamask.io](https://metamask.io) and download the browser extension.

After you create a new vault, you will face the screen that shows your address at the top (can click to copy) and 0 ETH. Change the network selection to `Kovan Test Network`. We will continue the next steps assuming that you connect to Kovan.

<div align="center">
  <figure>
    <img src='/assets/metmask-no-eth.png'>
  </figure>
</div>

## Request Kovan Testnet Ether

::: tip
If you already own Kovan testnet Ether (KETH), skip to the [next section](#request-kovan-testnet-ether).
:::

Now that you have MetaMask installed and connected to Kovan test network, the next step is to request testnet ETH to interact with the Ethereum network. Head over to [https://faucet.kovan.network](https://faucet.kovan.network) to enter Kovan faucet.

<div align="center">
  <figure>
    <img src='/assets/kovan-faucet-home.png'>
  </figure>
</div>

After logging in with [Github](https://github.com), you will be able to enter your Ethereum address. This address will be funded with Kovan test ETH (KETH).

<div align="center">
  <figure>
    <img src='/assets/kovan-faucet-login.png'>
  </figure>
</div>

## Write Your First Smart Contract

To simplify the tutorial, we are not going to set up a full development environment. Instead, we will write our smart contract using [Remix](https://remix.ethereum.org), an in-browser smart contract development tool. Go to [https://remix.ethereum.org](https://remix.ethereum.org), you will see an empty editing space.

Paste the following code to the editor. This example smart contract contains one function `update`, which will fetch the exchange rate between Ethereum and US Dollar from Band Protocol's Kovan financial feeds and update the result in its state variable `ethusd`.

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

## Deploy and Test the Contract

Once the contract is implemented, go to "Deploy and Run Transaction" tab and click `Deploy` to deploy the smart contract. Note that the environment must be `Injected Web3` to deploy via MetaMask. Another reminder that MetaMask network must be set to Kovan.

<div align="center">
  <figure>
    <img src='/assets/remix-deploy.png'>
  </figure>
</div>

After the contract is deployed successfully, click on `update` button on the button left to send a transaction to invoke `update` function. To call this function successfully, the caller must pass `0.001 ETH` as a query fee. You can specify that under `Value` tab.

<div align="center">
  <figure>
    <img src='/assets/remix-click-update.png'>
  </figure>
</div>

Once the transaction is confirmed, click on `ethusd` button to query for the value of contract state variable `ethusd`. You will see that it changes from zero to whatever the current price of ETH in USD is, multiplied by 10<sup>18</sup>. In this example, the current Ethereum price is approximately 200.55 US Dollar.

<div align="center">
  <figure>
    <img src='/assets/remix-get-ethusd.png'>
  </figure>
</div>
