export default {
  overview: [
    `You can integrate useq prices to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •FB/USD for Facebook stock price to US dollar conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [``, ``, ``],
  label: 'price',
  example: `Coming soon!`,
  contractName: 'TODO',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256 . Note that to maintain arithmetic precision, the value is multiplied by 10^18 .`,
  },
  keyFormat: {
    crypto: {
      header: 'List of Available Pairs',
      description:
        'The following pairs are available for US Equity trading data.',
      keys: [
        [
          'AAPL/USD',
          '1 Apple Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        ],
        [
          'AMZN/USD',
          '1 Amazon Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        ],
        [
          'FB/USD',
          '1 Facebook Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/8/87/Facebook_Logo_%282015%29_light.svg',
        ],
        [
          'GOOG/USD',
          '1 Alphabet Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/7/7a/Alphabet_Inc_Logo_2015.svg',
        ],
        [
          'INTC/USD',
          '1 Intel Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg',
        ],
        [
          'MSFT/USD',
          '1 Microsoft Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        ],
        [
          'NFLX/USD',
          '1 Netflix Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
        ],
        [
          'NVDA/USD',
          '1 Nvidia Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/en/6/6d/Nvidia_image_logo.svg',
        ],
        [
          'ORCL/USD',
          '1 Oracle Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/c/c3/Oracle_Logo.svg',
        ],
        [
          'SBUX/USD',
          '1 Starbucks Stock in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg',
        ],
      ],
    },
  },
  solidity: [``, ``, ``],
}
