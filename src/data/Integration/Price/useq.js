export default {
  overview: [
    `You can integrate useq prices to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •FB/USD for Facebook stock price to US dollar conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of the smart contract. The function that is left to be implemented is •getFBUSDRate function, which will return •FB/ETH rate multiplied by 10^18 . Note that, we omit some functions to make this example short`,
    `We then define •QueryInterface at the top of the contract. This gives us access trusted data available on Band Protocol. Notice that the •query is a payable function that takes •bytes and returns •bytes32 together with a timestamp an query status.`,
    `Instantiate a •QueryInterface object with TCD address 0xfdd6bEfAADa0e12790Dea808bC9011e3b24C278A. FB/USD exchange rate can be obtained by query with key •FB/USD . The return value is the (exchange rate) * 10^18 . Note that you need to convert bytes32 result to uint256 .`,
  ],
  label: 'price',
  example: `💸 Say you want to create USeq betting smart contract. First bettor will get a reward if FB/USD is going down after 1 minute has passed otherwise second bettor will get the reward instead 👇👇👇`,
  contractName: 'USeqBettingContract',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256 . Note that to maintain arithmetic precision, the value is multiplied by 10^18 .`,
  },
  keyFormat: {
    crypto: {
      header: 'List of Available Pairs',
      description: [
        'The following pairs are available for US Equity trading data.',
      ],
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
  solidity: [
    `
pragma solidity 0.5.9;










contract USeqBettingContract {
  address payable public bettor_1;        // first bettor
  address payable public bettor_2;        // second bettor
  uint256 public bettingStartDate;
  uint256 public startRate;

  constructor(
    address payable _bettor_1,
    address payable _bettor_2
  ) public payable {              // Contract creator can deposit some amount of ETH as reward
    bettor_1 = _bettor_1;       // initiate first bettor
    bettor_2 = _bettor_2;       // initiate second bettor
    bettingStartDate = now;
    startRate = getFBUSDRate();
  }

  function getFBUSDRate() internal returns (uint256 rate) {




  }

  function resolve() public payable {
    // have to wait 1 minute after start betting
    require(now - bettingStartDate >= 1 minutes);
    // get rate again after 1 minute
    uint256 currentRate = getFBUSDRate();
    if (currentRate > startRate) {
      // if currentRate > startRate then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if currentRate <= startRate then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}`,
    `
pragma solidity 0.5.9;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

contract USeqBettingContract {
  address payable public bettor_1;        // first bettor
  address payable public bettor_2;        // second bettor
  uint256 public bettingStartDate;
  uint256 public startRate;

  constructor(
    address payable _bettor_1,
    address payable _bettor_2
  ) public payable {              // Contract creator can deposit some amount of ETH as reward
    bettor_1 = _bettor_1;       // initiate first bettor
    bettor_2 = _bettor_2;       // initiate second bettor
    bettingStartDate = now;
    startRate = getFBUSDRate();
  }

  function getFBUSDRate() internal returns (uint256 rate) {




  }

  function resolve() public payable {
    // have to wait 1 minute after start betting
    require(now - bettingStartDate >= 1 minutes);
    // get rate again after 1 minute
    uint256 currentRate = getFBUSDRate();
    if (currentRate > startRate) {
      // if currentRate > startRate then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if currentRate <= startRate then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}`,
    `
pragma solidity 0.5.9;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

contract USeqBettingContract {
  address payable public bettor_1;        // first bettor
  address payable public bettor_2;        // second bettor
  uint256 public bettingStartDate;
  uint256 public startRate;

  constructor(
    address payable _bettor_1,
    address payable _bettor_2
  ) public payable {              // Contract creator can deposit some amount of ETH as reward
    bettor_1 = _bettor_1;       // initiate first bettor
    bettor_2 = _bettor_2;       // initiate second bettor
    bettingStartDate = now;
    startRate = getFBUSDRate();
  }

  function getFBUSDRate() internal returns (uint256 rate) {
    QueryInterface q = QueryInterface(0x869e8e455816153A9330D59a854817231E49D9F9);
    (bytes32 rawRate,, QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("FB/USD");
    require(status == QueryInterface.QueryStatus.OK);
    return uint256(rawRate);
  }

  function resolve() public payable {
    // have to wait 1 minute after start betting
    require(now - bettingStartDate >= 1 minutes);
    // get rate again after 1 minute
    uint256 currentRate = getFBUSDRate();
    if (currentRate > startRate) {
      // if currentRate > startRate then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if currentRate <= startRate then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}`,
  ],
}
