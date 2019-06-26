export default {
  'Price Dataset': {
    description: ['', '', ''],
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
  },
  SportFeedCommunity: {
    description: ['', '', ''],
    solidity: [
      `
pragma solidity 0.5.9;






contract SportBettingContract {
    address payable public bettor_1;        // first bettor
    address payable public bettor_2;        // second bettor

    constructor(
        address payable _bettor_1,
        address payable _bettor_2
    ) public payable {              // Contract creator can deposit some amount of ETH as reward
        bettor_1 = _bettor_1;       // initiate first bettor
        bettor_2 = _bettor_2;       // initiate second bettor
    }

    function claimReward() public payable {




        // Mock LAC's scores
        uint8 lacScore = 0;
        // Mock GSW's scores
        uint8 gswScore = 0;
        // if the scores are equal then nobody can get ETH in this contract
        require(lacScore != gswScore);
        if (lacScore > gswScore) {
            // if LAC win then give all ETH in this contract to the first bettor
            bettor_1.transfer(address(this).balance);
        } else {
            // if GSW win then give all ETH in this contract to the second bettor
            bettor_2.transfer(address(this).balance);
        }
    }
}
`,
      `
pragma solidity 0.5.9;

interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
}

contract SportBettingContract {
    address payable public bettor_1;        // first bettor
    address payable public bettor_2;        // second bettor

    constructor(
        address payable _bettor_1,
        address payable _bettor_2
    ) public payable {              // Contract creator can deposit some amount of ETH as reward
        bettor_1 = _bettor_1;       // initiate first bettor
        bettor_2 = _bettor_2;       // initiate second bettor
    }

    function claimReward() public payable {




        // Mock LAC's scores
        uint8 lacScore = 0;
        // Mock GSW's scores
        uint8 gswScore = 0;
        // if the scores are equal then nobody can get ETH in this contract
        require(lacScore != gswScore);
        if (lacScore > gswScore) {
            // if LAC win then give all ETH in this contract to the first bettor
            bettor_1.transfer(address(this).balance);
        } else {
            // if GSW win then give all ETH in this contract to the second bettor
            bettor_2.transfer(address(this).balance);
        }
    }
}
`,
      `
pragma solidity 0.5.9;

interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
}

contract SportBettingContract {
    address payable public bettor_1;        // first bettor
    address payable public bettor_2;        // second bettor

    constructor(
        address payable _bettor_1,
        address payable _bettor_2
    ) public payable {              // Contract creator can deposit some amount of ETH as reward
        bettor_1 = _bettor_1;       // initiate first bettor
        bettor_2 = _bettor_2;       // initiate second bettor
    }

    function claimReward() public payable {
        // Create a QueryInterface pointing to Sport community contract
        QueryInterface q = QueryInterface(0x7d19771a15c1314be9Bd436092A727A70Edc6482);
        // Get the scores at date 2019 04 27
        bytes32 rawData = q.query.value(q.queryPrice())("20190427/LAC-GSW");
        // Get LAC's score from the first byte and then convert from byte to uint8
        uint8 lacScore = uint8(rawData[0]);
        // Get GSW's score from the second byte and then convert from byte to uint8
        uint8 gswScore = uint8(rawData[1]);
        // if the scores are equal then nobody can get ETH in this contract
        require(lacScore != gswScore);
        if (lacScore > gswScore) {
            // if LAC win then give all ETH in this contract to the first bettor
            bettor_1.transfer(address(this).balance);
        } else {
            // if GSW win then give all ETH in this contract to the second bettor
            bettor_2.transfer(address(this).balance);
        }
    }
}
`,
    ],
  },
  LotteryFeedCommunity: {
    description: ['', '', ''],
    solidity: [
      `
pragma solidity 0.5.9;






contract PowerBallContract {
    // keep the record of guesses submitted by each participant
    mapping (address => bytes7) public guesses;

    function guess(bytes7 _guess) public payable  {
        // sender should never submit his/her guess before
        require(guesses[msg.sender] == bytes7(0));
        // Anyone can particippate util 04/20/2019 @ 12:00am (UTC)
        require(now <= 1555718400);
        // sender should pay 1 finney to submit his/her guess
        require(msg.value == 1 finney);
        guesses[msg.sender] = _guess;
    }

    function claimReward() public payable {


        // Mock PowerBall result
        bytes7 result = bytes7(0);
        // sender should provide the right guess before getting reward (all ETH in this contract)
        require(result == guesses[msg.sender]);
        // give all ETH in this contract to the sender
        msg.sender.transfer(address(this).balance);
    }
}
`,
      `
pragma solidity 0.5.9;

interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
}

contract PowerBallContract {
    // keep the record of guesses submitted by each participant
    mapping (address => bytes7) public guesses;

    function guess(bytes7 _guess) public payable  {
        // sender should never submit his/her guess before
        require(guesses[msg.sender] == bytes7(0));
        // Anyone can particippate util 04/20/2019 @ 12:00am (UTC)
        require(now <= 1555718400);
        // sender should pay 1 finney to submit his/her guess
        require(msg.value == 1 finney);
        guesses[msg.sender] = _guess;
    }

    function claimReward() public payable {


        // Mock PowerBall result
        bytes7 result = bytes7(0);
        // sender should provide the right guess before getting reward (all ETH in this contract)
        require(result == guesses[msg.sender]);
        // give all ETH in this contract to the sender
        msg.sender.transfer(address(this).balance);
    }
}
`,
      `
pragma solidity 0.5.9;

interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
}

contract PowerBallContract {
    // keep the record of guesses submitted by each participant
    mapping (address => bytes7) public guesses;

    function guess(bytes7 _guess) public payable  {
        // sender should never submit his/her guess before
        require(guesses[msg.sender] == bytes7(0));
        // Anyone can particippate util 04/20/2019 @ 12:00am (UTC)
        require(now <= 1555718400);
        // sender should pay 1 finney to submit his/her guess
        require(msg.value == 1 finney);
        guesses[msg.sender] = _guess;
    }

    function claimReward() public payable {
        // Create a QueryInterface pointing to Lottery community contract
        QueryInterface q = QueryInterface(0x6863019Ec1A5f675ce64699020A338Ee2256B981);
        // Get PowerBall result from Lottery community
        bytes7 result = bytes7(q.query.value(q.queryPrice())("PWB/20190420"));
        // sender should provide the right guess before getting reward (all ETH in this contract)
        require(result == guesses[msg.sender]);
        // give all ETH in this contract to the sender
        msg.sender.transfer(address(this).balance);
    }
}
`,
    ],
  },
  BandIdentity: {
    description: ['', '', ''],
    solidity: [
      `
pragma solidity 0.5.9;






contract SimplePollContract {
    // keep the record of address who has already voted
    mapping (address => bool) public votes;
    uint256 public candidate_1_score = 0;
    uint256 public candidate_2_score = 0;

    function vote(uint256 candidate_id) public payable {
        // candidate_id should only be 1 or 2
        require(candidate_id == 1 || candidate_id == 2);
        // sender should never vote before
        require(!votes[msg.sender]);


        // Mock hasIdentity to be always true, so every address can vote
        bool hasIdentity = true;
        require(hasIdentity);
        votes[msg.sender] = true;
        if (candidate_id == 1) {
            candidate_1_score++;
        } else {
            candidate_2_score++;
        }
    }
}
`,
      `
pragma solidity 0.5.9;

interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
}

contract SimplePollContract {
    // keep the record of address who has already voted
    mapping (address => bool) public votes;
    uint256 public candidate_1_score = 0;
    uint256 public candidate_2_score = 0;

    function vote(uint256 candidate_id) public payable {
        // candidate_id should only be 1 or 2
        require(candidate_id == 1 || candidate_id == 2);
        // sender should never vote before
        require(!votes[msg.sender]);


        // Mock hasIdentity to be always true, so every address can vote
        bool hasIdentity = true;
        require(hasIdentity);
        votes[msg.sender] = true;
        if (candidate_id == 1) {
            candidate_1_score++;
        } else {
            candidate_2_score++;
        }
    }
}
`,
      `
pragma solidity 0.5.9;

interface QueryInterface {
  function query(bytes calldata input) external payable returns (bytes32);
  function queryPrice() external view returns (uint256);
}

contract SimplePollContract {
    // keep the record of address who has already voted
    mapping (address => bool) public votes;
    uint256 public candidate_1_score = 0;
    uint256 public candidate_2_score = 0;

    function vote(uint256 candidate_id) public payable {
        // candidate_id should only be 1 or 2
        require(candidate_id == 1 || candidate_id == 2);
        // sender should never vote before
        require(!votes[msg.sender]);
        // Create a QueryInterface pointing to Identity community contract
        QueryInterface q = QueryInterface(0x616aa37B3e630fce6d96Abc2Afa767aa98280743);
        // Only address that has identity can vote
        bool hasIdentity = q.query.value(q.queryPrice())(abi.encodePacked(msg.sender)) > 0;
        require(hasIdentity);
        votes[msg.sender] = true;
        if (candidate_id == 1) {
            candidate_1_score++;
        } else {
            candidate_2_score++;
        }
    }
}
`,
    ],
  },
}
