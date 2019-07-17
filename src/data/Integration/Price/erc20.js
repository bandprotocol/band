export default {
  overview: [
    `You can integrate token prices to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key KNC/LINK for KyberNetwork to ChainLink conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `First we begin by writing a simple version of the contract with •sellToken function. The •getLINKETHRate function, which will return •LINK/ETH rate is left to be implemented. Note that, we omit some of the functions to make this example short`,
    `We then define •QueryInterface at the top of the contract. This gives us access trusted data available on Band Protocol. Notice that the •query is a payable function that takes •bytes and returns •bytes32 together with a timestamp an query status.`,
    `Finally we instantiate a •QueryInterface object with TCD address 0xfdd6bEfAADa0e12790Dea808bC9011e3b24C278A. LINK/ETH exchange rate can be obtained by calling the •query function with key LINK/ETH. Note that you need to convert bytes32 result to uint256 before doing further calculations. The converted value is the (exchange rate) multipled by 10^18.`,
  ],
  label: 'price',
  example: `🏛 Let's assume we want to build a simple automated exchange contract that buy LINK tokens from the users and pay an appropriate amount of ETH based on the current exchange rate of •LINK/ETH. The contract needs access to real-time exchange rate. With Band Protocol's price feed, implementing this contract is a breeze. Let's go through the code 👇👇👇`,
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
  ERC20 public LINK = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088); 
                            // Kovan address of ChainLink token

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
  ERC20 public LINK = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088);
                            // Kovan address of ChainLink token

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
  ERC20 public LINK = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088);
                            // Kovan address of ChainLink token

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
