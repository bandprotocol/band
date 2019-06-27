export default {
  description: [
    `Write a simple version of the smart contract. We set the price at 10 USD. As you can see buyTicket function allows anyone to buy a ticket. The only remaining hole to fill is the exchange rate between ETH and USD.`,
    `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32 .`,
    `Instantiate a QueryInterface object with PriceCommunity contract address at 0x8B3dBb2Db70120Cf4D24c739E1c296DE98644238 . ETH/USD exchange rate can be obtained by query with key ETH/USD . The return value is the (exchange rate) * 10^18 . Note that you need to convert bytes32 result to uint256 .`,
  ],
  label: 'price',
  example: `🚀 Say you have a simple smart contract for selling concert tickets. Users must pay in ETH, but we want the price of each ticket to be exactly 10 USD. In other words, a ticket costs whatever amount ETH worth 10 USD at the purchase time. The smart contract needs a real-time exchange rate of ETH/USD. 👇👇👇`,
  contractName: 'TicketSellerContract',
  dataFormat: {
    description: `The return value from community's contract always bytes32. For ...`,
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
