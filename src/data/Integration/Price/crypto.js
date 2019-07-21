export default {
  overview: [
    `You can integrate crypto-fiat prices to your DApps in 3 steps`,
    `Pick the query key for data lookup. For instance, key ETH/USD for Ethereum to USD conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `First we begin by writing a simple version of ticket selling smart contract. The •buyTicket function allows anyone to buy a ticket at a fixed cost of 10 USD, with a function to get the exchange rate between ETH and USD left to be implemented.`,
    `We then define •QueryInterface at the top of the contract. This gives us access trusted data available on Band Protocol. Notice that the •query is a payable function that takes •bytes and returns •bytes32 together with a timestamp an query status.`,
    `Finally we instantiate a •QueryInterface object with TCD address 0x61518CA6F924348465B5126C0c20e843E5E6aA41. ETH/USD exchange rate can be obtained by calling the •query function with key ETH/USD. Note that you need to convert bytes32 result to uint256 before doing further calculations. With this, we have completed our contract in less than 30 lines of code.`,
  ],
  label: 'price',
  example: `🎫 Let's assume we want to create a simple smart contract for selling concert tickets. You want the users to pay a fixed 10 USD for each ticket, but you're accepting the payment in ETH. The smart contract needs to know an exchange rate of ETH/USD at the time of purchase. With Band Protocol, this is easy to implement. Let's explore how we can build this contract in a few lines of code. 👇👇👇`,
  contractName: 'TicketContract',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256 . Note that to maintain arithmetic precision, the value is multiplied by 10^18 .`,
  },
  keyFormat: {
    crypto: {
      // header: 'List of Available Pairs',
      description: [
        'The following pairs are available for crypto-fiat trading data. Note that dapps can use ETH/USD conversion rate together with ERC-20 datasets to compute the rates between ERC-20 tokens and USD.',
      ],
      keys: [
        [
          'BCH/USD',
          'Bitcoin Cash price in USD (times 10^18 )',
          'https://www.bitcoincash.org/img/favicon/apple-icon-57x57.png',
        ],
        [
          'BTC/USD',
          'Bitcoin price in USD (times by 10^18 )',
          'https://bitcoin.org/favicon.png?1563289583',
        ],
        [
          'ETH/USD',
          'Ethereum price in USD (times by 10^18 )',
          'https://www.ethereum.org/favicon.png',
        ],
        [
          'LTC/USD',
          'Litecoin price in USD (times by 10^18 )',
          'https://litecoin.org/img/litecoin.png',
        ],
        [
          'XRP/USD',
          'Ripple (XRP) price in USD (times by 10^18 )',
          'https://www.ripple.com/wp-content/themes/ripple-beta/assets/img/favicon-32x32-new.png',
        ],
      ],
    },
  },
  solidity: [
    `
pragma solidity ^0.5.0;










contract TicketContract {
  uint256 public constant ticketPrice = 10;    /// In USD
  mapping (address => bool) public hasTicket;  /// Whether a user has a ticket

  function buyTicket() public payable {
    require(!hasTicket[msg.sender], "Must not already have a ticket");
    require(msg.value * getETHUSDRate() / 1e36 >= ticketPrice, "INSUFFICIENT_ETHER");
    hasTicket[msg.sender] = true;
  }

  function getETHUSDRate() internal returns (uint256 rate) {




  }
}`,
    `
pragma solidity ^0.5.0;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

contract TicketContract {
  uint256 public constant ticketPrice = 10;    /// In USD
  mapping (address => bool) public hasTicket;  /// Whether a user has a ticket

  function buyTicket() public payable {
    require(!hasTicket[msg.sender], "Must not already have a ticket");
    require(msg.value * getETHUSDRate() / 1e36 >= ticketPrice, "INSUFFICIENT_ETHER");
    hasTicket[msg.sender] = true;
  }

  function getETHUSDRate() internal returns (uint256 rate) {




  }
}`,
    `
pragma solidity ^0.5.0;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

  function queryPrice() external view returns (uint256);
}

contract TicketContract {
  uint256 public constant ticketPrice = 10;    /// In USD
  mapping (address => bool) public hasTicket;  /// Whether a user has a ticket

  function buyTicket() public payable {
    require(!hasTicket[msg.sender], "Must not already have a ticket");
    require(msg.value * getETHUSDRate() / 1e36 >= ticketPrice, "INSUFFICIENT_ETHER");
    hasTicket[msg.sender] = true;
  }

  function getETHUSDRate() internal returns (uint256 rate) {
    QueryInterface q = QueryInterface(0x61518CA6F924348465B5126C0c20e843E5E6aA41);
    (bytes32 rawRate,, QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("ETH/USD");
    require(status == QueryInterface.QueryStatus.OK);
    return uint256(rawRate);
  }
}`,
  ],
}
