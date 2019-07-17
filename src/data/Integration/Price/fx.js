export default {
  overview: [
    `You can integrate fx prices to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key JPY/CNY for Japanese Yen to Chinese Yuan conversion rate. Each dataset has its own method to construct a valid key.`,
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
        'The following pairs are available for Foreign Exchange trading data.',
      keys: [
        [
          'CNY/USD',
          '1 Chinese Yuan in USD (times by 10^18 )',
          'https://www.countries-ofthe-world.com/flags-normal/flag-of-China.png',
        ],
        [
          'EUR/USD',
          '1 Euro in USD (times by 10^18 )',
          'https://www.crwflags.com/fotw/images/e/eu-eun.gif',
        ],
        [
          'GBP/USD',
          '1 British Pound in USD (times by 10^18 )',
          'https://www.countries-ofthe-world.com/flags-normal/flag-of-United-Kingdom.png',
        ],
        [
          'JPY/USD',
          '1 Japanese Yen in USD (times by 10^18 )',
          'https://www.countries-ofthe-world.com/flags-normal/flag-of-Japan.png',
        ],
        [
          'THB/USD',
          '1 Thai Baht in USD (times by 10^18 )',
          'https://www.countries-ofthe-world.com/flags-normal/flag-of-Thailand.png',
        ],
        [
          'XAG/USD',
          '1 ounce of Silver in USD (times by 10^18 )',
          'https://img.etimg.com/thumb/height-480,width-640,imgsize-119619,msid-63982286/golden-time-to-buy-silver-imports-to-rise.jpg',
        ],
        [
          'XAU/USD',
          '1 ounce of Gold in USD (times by 10^18 )',
          'https://img.etimg.com/thumb/height-480,width-640,msid-68557855,imgsize-148822/gold-4-ts.jpg',
        ],
      ],
    },
  },
  solidity: [``, ``, ``],
}
