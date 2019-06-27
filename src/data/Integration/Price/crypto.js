export default {
  description: [
    `Write a simple version of the smart contract. We set the price at 10 USD. As you can see buyTicket function allows anyone to buy a ticket. The only remaining hole to fill is the exchange rate between ETH and USD.`,
    `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32 .`,
    `Instantiate a QueryInterface object with PriceCommunity contract address at 0x8B3dBb2Db70120Cf4D24c739E1c296DE98644238 . ETH/USD exchange rate can be obtained by query with key ETH/USD . The return value is the (exchange rate) * 10^18 . Note that you need to convert bytes32 result to uint256 .`,
  ],
  label: 'price',
  example: `🔮 Say you have a simple smart contract for selling concert tickets. Users must pay in ETH, but we want the price of each ticket to be exactly 10 USD. In other words, a ticket costs whatever amount ETH worth 10 USD at the purchase time. The smart contract needs a real-time exchange rate of ETH/USD. 👇👇👇`,
  contractName: 'TicketSellerContract',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256. Note that to maintain arithmetic precision, the value is multiplied by 10^18 . See Example tab for, well, example.`,
  },
  keyFormat: {
    crypto: {
      // header: 'List of Available Pairs',
      description:
        'The following pairs are available for crypto-fiat trading data. Note that dapps can use `ETH/USD` conversion rate together with ERC-20 datasets to compute the rates between ERC-20 tokens and USD.',
      keys: [
        [
          'BCH/USD',
          'Bitcoin Cash price in USD (times 10^18 )',
          'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png',
        ],
        [
          'BTC/USD',
          'Bitcoin price in USD (times by 10^18 )',
          'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        ],
        [
          'ETH/USD',
          'Ethereum price in USD (times by 10^18 )',
          'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        ],
        [
          'LTC/USD',
          'Litecoin price in USD (times by 10^18 )',
          'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png',
        ],
        [
          'XRP/USD',
          'Ripple (XRP) price in USD (times by 10^18 )',
          'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
        ],
      ],
    },
  },
  solidity: [
    `
  pragma solidity 0.5.9;






  contract TicketSellerContract {
    uint256 public ticketPrice = 10;             /// In USD
    mapping (address => bool) public hasTicket;  /// Whether a user has a ticket

    function buyTicket() public payable {
        require(!hasTicket[msg.sender], "Must not already have a ticket");


        // Mock conversion rate between ETH and USD
        uint256 USD_PER_ETH = 1e18;
        // Make sure that the buyer pays enough ETH
        require(msg.value * USD_PER_ETH / 1e18 >= ticketPrice, "INSUFFICIENT_ETHER");
        // Add a ticket to the buyer's mapping slot
        hasTicket[msg.sender] = true;
    }
  }`,
    `
  pragma solidity 0.5.9;

  interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
  }

  contract TicketSellerContract {
    uint256 public ticketPrice = 10;             /// In USD
    mapping (address => bool) public hasTicket;  /// Whether a user has a ticket

    function buyTicket() public payable {
        require(!hasTicket[msg.sender], "Must not already have a ticket");


        // Mock conversion rate between ETH and USD
        uint256 USD_PER_ETH = 1e18;
        // Make sure that the buyer pays enough ETH
        require(msg.value * USD_PER_ETH / 1e18 >= ticketPrice, "INSUFFICIENT_ETHER");
        // Add a ticket to the buyer's mapping slot
        hasTicket[msg.sender] = true;
    }
  }`,
    `
  pragma solidity 0.5.9;

  interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
  }

  contract TicketSellerContract {
    uint256 public ticketPrice = 10;             /// In USD
    mapping (address => bool) public hasTicket;  /// Whether a user has a ticket

    function buyTicket() public payable {
        require(!hasTicket[msg.sender], "Must not already have a ticket");
        // Create a QueryInterface pointing to Price community contract
        QueryInterface q = QueryInterface(0x8B3dBb2Db70120Cf4D24c739E1c296DE98644238);
        // Get the current conversion rate between ETH and USD (times 1e18)
        uint256 USD_PER_ETH = uint256(q.query.value(q.queryPrice())("ETH/USD"));
        // Make sure that the buyer pays enough ETH
        require(msg.value * USD_PER_ETH / 1e18 >= ticketPrice, "INSUFFICIENT_ETHER");
        // Add a ticket to the buyer's mapping slot
        hasTicket[msg.sender] = true;
    }
  }`,
  ],
}
