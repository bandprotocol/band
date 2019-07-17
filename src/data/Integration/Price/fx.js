export default {
  overview: [
    `You can integrate fx prices to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •JPY/CNY for Japanese Yen to Chinese Yuan conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of the smart contract. The function that is left to be implemented is •getCNYUSDRate function, which will return •CNY/ETH rate multiplied by 10^18 . Note that, we omit some functions to make this example short`,
    `Copy-paste •QueryInterface to the top of the contract. This acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 together with additional statuses.`,
    `Instantiate a •QueryInterface object with TCD address 0xfdd6bEfAADa0e12790Dea808bC9011e3b24C278A. CNY/USD exchange rate can be obtained by query with key •CNY/USD . The return value is the (exchange rate) * 10^18 . Note that you need to convert bytes32 result to uint256 .`,
  ],
  label: 'price',
  example: `💸 Say you want to create FX betting smart contract. First bettor will get a reward if CNY/USD is going down after 1 day has passed otherwise second bettor will get the reward instead 👇👇👇`,
  contractName: 'FXBettingContract',
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
          'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
        ],
        [
          'EUR/USD',
          '1 Euro in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg',
        ],
        [
          'GBP/USD',
          '1 British Pound in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg',
        ],
        [
          'JPY/USD',
          '1 Japanese Yen in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg',
        ],
        [
          'THB/USD',
          '1 Thai Baht in USD (times by 10^18 )',
          'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg',
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
  solidity: [
    `
pragma solidity 0.5.9;










contract FXBettingContract {
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
    startRate = getCNYUSDRate();
  }

  function getCNYUSDRate() internal returns (uint256 rate) {




  }

  function resolve() public payable {
    // have to wait 1 day after start betting
    require(now - bettingStartDate >= 1 days);
    // get rate again after 1 day
    uint256 currentRate = getCNYUSDRate();
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

contract FXBettingContract {
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
    startRate = getCNYUSDRate();
  }

  function getCNYUSDRate() internal returns (uint256 rate) {




  }

  function resolve() public payable {
    // have to wait 1 day after start betting
    require(now - bettingStartDate >= 1 days);
    // get rate again after 1 day
    uint256 currentRate = getCNYUSDRate();
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

contract FXBettingContract {
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
    startRate = getCNYUSDRate();
  }

  function getCNYUSDRate() internal returns (uint256 rate) {
    QueryInterface q = QueryInterface(0x869e8e455816153A9330D59a854817231E49D9F9);
    (bytes32 rawRate,, QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("CNY/USD");
    require(status == QueryInterface.QueryStatus.OK);
    return uint256(rawRate);
  }

  function resolve() public payable {
    // have to wait 1 day after start betting
    require(now - bettingStartDate >= 1 days);
    // get rate again after 1 day
    uint256 currentRate = getCNYUSDRate();
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
