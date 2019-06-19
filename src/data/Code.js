export default {
  price: {
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
        // Create a QueryInterface pointing to Band Protocol's Crypto Price Feed
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
  },
  sport: {
    solidity: [
      `
  interface DataSource {
    function getQueryPrice() external view returns (uint256);
    function getAsBytes32(bytes32 key) external payable returns (bytes32);
  }

  contract SportResultContract {
    DataSource public constant dataSource =
      DataSource(0x7d19771a15c1314be9Bd436092A727A70Edc6482);

    function checkNBAResult() internal {
      bytes32 sportResult = dataSource
        .getAsBytes32
        .value(dataSource.getQueryPrice())("NBA2019/20190427/LAC-GSW");
      assert (uint8(sportResult[0]) == 110); // The Clippers scored 110
      assert (uint8(sportResult[1]) == 129); // The Warriors scored 129
    }
  }`,
    ],
  },
  lottery: {
    solidity: [
      `
  interface DataSource {
    function getQueryPrice() external view returns (uint256);
    function getAsBytes32(bytes32 key) external payable returns (bytes32);
  }

  contract LottoResultContract {
    DataSource public constant dataSource =
      DataSource(0x6863019Ec1A5f675ce64699020A338Ee2256B981);

    function checkLottoResult() internal {
      bytes32 powerballResult = dataSource
        .getAsBytes32
        .value(dataSource.getQueryPrice())("PWB/20190420");
      assert (uint8(powerballResult[0]) == 3);   // White Ball #1
      assert (uint8(powerballResult[1]) == 27);  // White Ball #2
      assert (uint8(powerballResult[2]) == 30);  // White Ball #3
      assert (uint8(powerballResult[3]) == 63);  // White Ball #4
      assert (uint8(powerballResult[4]) == 65);  // White Ball #5
      assert (uint8(powerballResult[5]) == 1);   // Power Ball #1
      assert (uint8(powerballResult[6]) == 3);   // Power Play Multiplier
    }
  }`,
    ],
  },
  identity: {
    solidity: [
      `
  interface DataSource {
    function getQueryPrice() external view returns (uint256);
    function getAsBool(bytes32 key) external payable returns (bool);
  }

  contract IdentityResultContract {
    DataSource public constant dataSource =
      DataSource(0x616aa37B3e630fce6d96Abc2Afa767aa98280743);

    function checkIdentityResult() internal {
      bool identityResult = dataSource
        .getAsBool
        .value(dataSource.getQueryPrice())(bytes32(bytes20(0xe871810225fd2cfD7847319c52F4094958c2f350)));
      assert (identityResult);   // identityResult is True
    }
  }`,
    ],
  },
}
