export default {
  overview: [
    `You can integrate the sport data to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •20190427/ATL-BOS for Atlanta Hawks vs Boston Celtics on 27/04/2019 . Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of smart contract for sport betting. We set the scores of both teams to 0 (just mock scores). We will replace these mock scores by real scores from Sport community later.`,
    `We then define •QueryInterface at the top of the contract. This gives us access trusted data available on Band Protocol. Notice that the •query is a payable function that takes •bytes and returns •bytes32 together with a timestamp an query status.`,
    `Instantiate a •QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by query with key •20190427/ATL-BOS and the scores was encoded in first byte and second byte of the return value.`,
  ],
  label: 'sport',
  example: ` 🏀Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If ATL (a basketball team) win first bettor will receive all ETH in the contract. If BOS (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
  contractName: 'SportBettingContract',
  dataFormat: {
    description: `Return value from community's contract always •bytes32 .　
    Sport Community will return score of home team and score of away team which are represented with first 2 bytes of the return value.
    For example
      👉 You have called •q.query.value(q.queryPrice())("20190427/ATL-BOS") 　
      👉 The return value is 0x1f3c000000000000000000000000000000000000000000000000000000000000 　
      👉 So the score of ATL is 0x1f (base 16) which is equal to 31 (base 10) 　
      👉 And the score of BOS is 0x3c (base 16) which is equal to 60 (base 10) 　
    `,
  },
  keyFormat: {
    nfl: {
      header: 'List of Available NFL Teams',
      description: `🏀 NBA or National Basketball Association dataset group has provided keys for query matches score.
    Format of the key is composed of Date(year,month,day)/home-away . For example •20190427/ATL-BOS which mean the key for query score of Atlanta Hawks(home team) and Boston Celtics(away team).
    The return result from query is 32 bytes , so the score of ATL will be encoded in first byte and score of BOS will be encoded in second byte .`,
      keys: [
        [
          'ATL',
          'Atlanta Hawks',
          'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
        ],
        [
          'BOS',
          'Boston Celtics',
          'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
        ],
        [
          'BN',
          'Brooklyn Nets',
          'https://upload.wikimedia.org/wikipedia/commons/4/44/Brooklyn_Nets_newlogo.svg',
        ],
        [
          'CH',
          'Charlotte Hornets',
          'https://upload.wikimedia.org/wikipedia/en/c/c4/Charlotte_Hornets_%282014%29.svg',
        ],
        [
          'CB',
          'Chicago Bulls',
          'https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg',
        ],
        [
          'CC',
          'Cleveland Cavaliers',
          'https://upload.wikimedia.org/wikipedia/en/4/4b/Cleveland_Cavaliers_logo.svg',
        ],
        [
          'DAL',
          'Dallas Mavericks',
          'https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg',
        ],
        [
          'DEN',
          'Denver Nuggets',
          'https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg',
        ],
        [
          'DET',
          'Detroit Pistons',
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Pistons_logo17.svg',
        ],
        [
          'BOS',
          'Golden State Warriors',
          'https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg',
        ],
        [
          'HR',
          'Houston Rockets',
          'https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Rockets.svg',
        ],
        [
          'IP',
          'Indiana Pacers',
          'https://upload.wikimedia.org/wikipedia/en/1/1b/Indiana_Pacers.svg',
        ],
        [
          'LAL',
          'Los Angeles Lakers',
          'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg',
        ],
        [
          'MG',
          'Memphis Grizzlies',
          'https://upload.wikimedia.org/wikipedia/en/f/f1/Memphis_Grizzlies.svg',
        ],
        [
          'MH',
          'Miami Heat',
          'https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg',
        ],
        [
          'MB',
          'Milwaukee Bucks',
          'https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg',
        ],
        [
          'MT',
          'Minnesota Timberwolves',
          'https://upload.wikimedia.org/wikipedia/en/c/c2/Minnesota_Timberwolves_logo.svg',
        ],
        [
          'NOP',
          'New Orleans Pelicans',
          'https://upload.wikimedia.org/wikipedia/en/0/0d/New_Orleans_Pelicans_logo.svg',
        ],
        [
          'NYK',
          'New York Knicks',
          'https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg',
        ],
        [
          'OCT',
          'Oklahoma City Thunder',
          'https://upload.wikimedia.org/wikipedia/en/5/5d/Oklahoma_City_Thunder.svg',
        ],
        [
          'OM',
          'Orlando Magic',
          'https://upload.wikimedia.org/wikipedia/en/1/10/Orlando_Magic_logo.svg',
        ],
        [
          '76ers',
          'Philadelphia 76ers',
          'https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg',
        ],
        [
          'PS',
          'Phoenix Suns',
          'https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg',
        ],
        [
          'PTB',
          'Portland Trail Blazers',
          'https://upload.wikimedia.org/wikipedia/en/2/21/Portland_Trail_Blazers_logo.svg',
        ],
        [
          'SK',
          'Sacramento Kings',
          'https://upload.wikimedia.org/wikipedia/en/c/c7/SacramentoKings.svg',
        ],
        [
          'SAS',
          'San Antonio Spurs',
          'https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg',
        ],
        [
          'TR',
          'Toronto Raptors',
          'https://upload.wikimedia.org/wikipedia/en/3/36/Toronto_Raptors_logo.svg',
        ],
      ],
    },
  },
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




    // Mock ATL's scores
    uint8 altScore = 0;
    // Mock BOS's scores
    uint8 bosScore = 0;
    // if the scores are equal then nobody can get ETH in this contract
    require(altScore != bosScore);
    if (altScore > bosScore) {
      // if ATL win then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if BOS win then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}
  `,
    `
pragma solidity 0.5.9;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

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




    // Mock ATL's scores
    uint8 altScore = 0;
    // Mock BOS's scores
    uint8 bosScore = 0;
    // if the scores are equal then nobody can get ETH in this contract
    require(altScore != bosScore);
    if (altScore > bosScore) {
      // if ATL win then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if BOS win then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}
  `,
    `
pragma solidity 0.5.9;

interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

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
    (bytes32 rawData,,QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("20190427/ATL-BOS");
    // Query status should be OK to continue
    require(status == QueryInterface.QueryStatus.OK);
    // Get ATL's score from the first byte and then convert from byte to uint8
    uint8 altScore = uint8(rawData[0]);
    // Get BOS's score from the second byte and then convert from byte to uint8
    uint8 bosScore = uint8(rawData[1]);
    // if the scores are equal then nobody can get ETH in this contract
    require(altScore != bosScore);
    if (altScore > bosScore) {
      // if ATL win then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if BOS win then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}
  `,
  ],
}
