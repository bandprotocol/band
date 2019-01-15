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
yarn truffle deploy --reset --network rinkeby
```
> Deploy only new community (use same band)
```
yarn truffle deploy --network rinkeby - f 3
```
