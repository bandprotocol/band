export default {
  description: [``, ``, ``],
  label: 'price',
  example: `Coming soon!`,
  contractName: 'TODO',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256. Note that to maintain arithmetic precision, the value is multiplied by 10^18 . See Example tab for, well, example.`,
  },
  keyFormat: {
    crypto: {
      header: 'List of Available Pairs',
      description: '......',
      keys: [
        [
          'BTC/USD',
          'Price of 1 Bitcoin in United States dollar unit multiply by 10^18',
          '',
        ],
        [
          'ETH/USD',
          'Price of 1 Ethereum in United States dollar unit multiply by 10^18',
          '',
        ],
        ['MKR/ETH', 'Price of 1 Maker in Ethereum unit multiply by 10^18', ''],
        [
          'BAT/ETH',
          'Price of 1 Basic Attention Token in Ethereum unit multiply by 10^18',
          '',
        ],
        [
          'USDC/ETH',
          'Price of 1 USD Coin in Ethereum unit multiply by 10^18',
          '',
        ],
        [
          'OMG/ETH',
          'Price of 1 OmiseGO in Ethereum unit multiply by 10^18',
          '',
        ],
        ['ZRX/ETH', 'Price of 1 ZeroX in Ethereum unit multiply by 10^18', ''],
        ['DAI/ETH', 'Price of 1 Dai in Ethereum unit multiply by 10^18', ''],
        ['REP/ETH', 'Price of 1 Augur in Ethereum unit multiply by 10^18', ''],
        ['KNC/ETH', 'Price of 1 Band in Ethereum unit multiply by 10^18', ''],
      ],
    },
  },
  solidity: [``, ``, ``],
}
