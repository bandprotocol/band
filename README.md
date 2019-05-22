<div align="center">
  <h1>
    Band Smart Contracts
  </h1>

  <p>
    <strong>Decentralized Data Governance Protocol</strong>

![Solidity](https://img.shields.io/badge/language-solidity-orange.svg?longCache=true&style=popout-square)
![Ethereum](https://img.shields.io/badge/platform-Ethereum-blue.svg?longCache=true&style=popout-square)
![Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-green.svg?longCache=true&style=popout-square)

  </p>
</div>

# Contract

> Band protocol smart contracts.

## Installation

Make sure you have Node.js and Yarn installed, then:

```
yarn install
```

## Run test case

```
yarn run truffle test
```

## Deploying contract to Rinkeby testnet

> Deploy all contract

```
yarn run truffle deploy --reset --network rinkeby
```

> Deploy only new community (use same band)

```
yarn run truffle deploy --network rinkeby - f 3
```

## Deplying contract to Localhost

> Deploy all contract

```
yarn truffle deploy --network development --reset 2> config.txt
```

> Script to mock tcr data

```
yarn truffle exec exec/challenge.js --network development
```
