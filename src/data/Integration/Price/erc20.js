export default {
  overview: [
    `You can integrate token prices to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key KNC/LINK for KyberNetwork to ChainLink conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of the smart contract. The function that is left to be implemented is •getLINKETHRate function, which will return •LINK/ETH rate multiplied by 10^18 . Note that, we omit some functions to make this example short`,
    `Copy-paste •QueryInterface to the top of the contract. This acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 together with additional statuses.`,
    `Instantiate a •QueryInterface object with TCD address 0xfdd6bEfAADa0e12790Dea808bC9011e3b24C278A. LINK/USD exchange rate can be obtained by query with key •LINK/USD . The return value is the (exchange rate) * 10^18 . Note that you need to convert bytes32 result to uint256 .`,
  ],
  label: 'price',
  example: `🏛 Say you want a simple automated exchange smart contract that can receive LINK tokens from users and return proper amount of ETH based on the current rate of •LINK/ETH . The contract needs the real-time exchange rate 👇👇👇`,
  contractName: 'ExchangeContract',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256 . Note that to maintain arithmetic precision, the value is multiplied by 10^18 .`,
  },
  keyFormat: {
    crypto: {
      header: 'List of Available Pairs',
      description:
        'The following pairs are available for ERC-20 to ETH trading data.',
      keys: [
        [
          'BAT/ETH',
          'Basic Attention Token price in ETH (times 10^18 )',
          'https://basicattentiontoken.org/wp-content/uploads/2017/07/BAT_logo_color_sansBAT.png',
        ],
        [
          'DAI/ETH',
          'DAI stable coin price in ETH (times 10^18 )',
          'https://logo.cryptonews.band/dai.png',
        ],
        [
          'KNC/ETH',
          'Kyber Network price in ETH (times 10^18 )',
          'https://kyber.network/favicon-32x32.png',
        ],
        [
          'LINK/ETH',
          'ChainLink price in ETH (times 10^18 )',
          'https://chain.link/assets/images/favicon.ico',
        ],
        [
          'MKR/ETH',
          'MakerDAO price in ETH (times 10^18 )',
          'https://makerdao.com/favicon.png',
        ],
        [
          'OMG/ETH',
          'OmiseGo price in ETH (times 10^18 )',
          'https://assets.omise.co/assets/favicon-32x32-c9f50e6b0bb82b7213254bbbf283155d5732b5f51bbc1fa4109a1328e348f0ac.png',
        ],
        [
          'REP/ETH',
          'Augur price in ETH (times 10^18 )',
          'https://www.augur.net/favicon/apple-icon-57x57.png',
        ],
        [
          'USDC/ETH',
          'USD Coin price in ETH (times 10^18 )',
          'https://logo.cryptonews.band/usdc.png',
        ],
        [
          'ZRX/ETH',
          '0x Protocol Token price in ETH (times 10^18 )',
          'https://0x.org/images/favicon/favicon-2-32x32.png',
        ],
      ],
    },
  },
  solidity: [
    `
pragma solidity ^0.5.0;










interface ERC20 {
  function transferFrom(address from, address to, uint tokens) external returns (bool success);
}

contract ExchangeContract {
  ERC20 public LINK = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088);  // Kovan address of ChainLink token

  function sellToken(uint256 amount) public {
    require(LINK.transferFrom(msg.sender, address(this), amount));
    uint256 weiPayout = getLINKETHRate() * amount / 1e18;
    msg.sender.transfer(weiPayout);
  }

  function getLINKETHRate() internal returns (uint256 rate) {




  }

  /// More code for operator to get LINK out and refill ETH omitted.
}`,
    `
pragma solidity ^0.5.0;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

interface ERC20 {
  function transferFrom(address from, address to, uint tokens) external returns (bool success);
}

contract ExchangeContract {
  ERC20 public LINK = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088);  // Kovan address of ChainLink token

  function sellToken(uint256 amount) public {
    require(LINK.transferFrom(msg.sender, address(this), amount));
    uint256 weiPayout = getLINKETHRate() * amount / 1e18;
    msg.sender.transfer(weiPayout);
  }

  function getLINKETHRate() internal returns (uint256 rate) {




  }

  /// More code for operator to get LINK out and refill ETH omitted.
}`,
    `
pragma solidity ^0.5.0;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

interface ERC20 {
  function transferFrom(address from, address to, uint tokens) external returns (bool success);
}

contract ExchangeContract {
  ERC20 public LINK = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088);  // Kovan address of ChainLink token

  function sellToken(uint256 amount) public {
    require(LINK.transferFrom(msg.sender, address(this), amount));
    uint256 weiPayout = getLINKETHRate() * amount / 1e18;
    msg.sender.transfer(weiPayout);
  }

  function getLINKETHRate() internal returns (uint256 rate) {
    QueryInterface q = QueryInterface(0xfdd6bEfAADa0e12790Dea808bC9011e3b24C278A);
    (bytes32 rawRate,, QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("LINK/ETH");
    require(status == QueryInterface.QueryStatus.OK);
    return uint256(rawRate);
  }

  /// More code for operator to get LINK out and refill ETH omitted.
}`,
  ],
}
