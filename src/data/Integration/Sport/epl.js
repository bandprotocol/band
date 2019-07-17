export default {
  overview: [
    `You can integrate the sport data to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •20190427/ARS-AFC for Arsenal vs AFC Bournemouth at 27/04/2019. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of smart contract for sport betting. We set the scores of both teams to 0 (just mock scores). We will replace these mock scores by real scores from Sport community later.`,
    `Copy-paste •QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 .`,
    `Instantiate a •QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by query with key •20190427/ARS-AFC and the scores was encoded in first byte and second byte of the return value.`,
  ],
  label: 'sport',
  example: `⚽️ Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If ARS (a basketball team) win first bettor will receive all ETH in the contract. If AFC (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
  contractName: 'SportBettingContract',
  dataFormat: {
    description: `Return value from community's contract always •bytes32 .　
      Sport Community will return score of home team and score of away team which are represented with first 2 bytes of the return value.
      For example
        👉 You have called •q.query.value(q.queryPrice())("20190427/ARS-AFC") 　
        👉 The return value is 0x1f3c000000000000000000000000000000000000000000000000000000000000 　
        👉 So the score of ARS is 0x1f (base 16) which is equal to 31 (base 10) 　
        👉 And the score of AFC is 0x3c (base 16) which is equal to 60 (base 10) 　
      `,
  },
  keyFormat: {
    nfl: {
      header: 'List of Available NFL Teams',
      description: `⚽️ EPL or Premier League dataset group has provided keys for query matches score.
      Format of the key is composed of Date(year,month,day)/home-away . For example •20190120/ARS-AFC which mean the key for query score of Arsenal(home team) and AFC Bournemouth(away team).
      The return result from query is 32 bytes , so the score of ARS will be encoded in first byte and score of AFC will be encoded in second byte .`,
      keys: [
        [
          'AFC',
          'AFC Bournemouth',
          'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
        ],
        [
          'ARS',
          'Arsenal',
          'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        ],
        [
          'AST',
          'Aston Villa',
          'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
        ],
        [
          'BRI',
          'Brighton & Hove Albion',
          'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
        ],
        [
          'BUR',
          'Burnley',
          'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg',
        ],
        [
          'CHE',
          'Chelsea',
          'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        ],
        [
          'CRY',
          'Crystal Palace',
          'https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg',
        ],
        [
          'EVE',
          'Everton',
          'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
        ],
        [
          'LEI',
          'Leicester City',
          'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
        ],
        [
          'LIV',
          'Liverpool',
          'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        ],
        [
          'MAN',
          'Manchester City',
          'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        ],
        [
          'MAN',
          'Manchester United',
          'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        ],
        [
          'NEW',
          'Newcastle United',
          'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
        ],
        [
          'NOR',
          'Norwich City',
          'https://upload.wikimedia.org/wikipedia/en/8/8c/Norwich_City.svg',
        ],
        [
          'SHE',
          'Sheffield United',
          'https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg',
        ],
        [
          'SOU',
          'Southampton',
          'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
        ],
        [
          'TOT',
          'Tottenham Hotspur',
          'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        ],
        [
          'WAT',
          'Watford',
          'https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg',
        ],
        [
          'WES',
          'West Ham United',
          'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
        ],
        [
          'WOL',
          'Wolverhampton Wanderers',
          'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
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




    // Mock ARS's scores
    uint8 arsScore = 0;
    // Mock AFC's scores
    uint8 afcScore = 0;
    // if the scores are equal then nobody can get ETH in this contract
    require(arsScore != afcScore);
    if (arsScore > afcScore) {
      // if ARS win then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if AFC win then give all ETH in this contract to the second bettor
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




    // Mock ARS's scores
    uint8 arsScore = 0;
    // Mock AFC's scores
    uint8 afcScore = 0;
    // if the scores are equal then nobody can get ETH in this contract
    require(arsScore != afcScore);
    if (arsScore > afcScore) {
      // if ARS win then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if AFC win then give all ETH in this contract to the second bettor
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
    (bytes32 rawData,,QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("20190427/ARS-AFC");
    // Query status should be OK to continue
    require(status == QueryInterface.QueryStatus.OK);
    // Get ARS's score from the first byte and then convert from byte to uint8
    uint8 arsScore = uint8(rawData[0]);
    // Get AFC's score from the second byte and then convert from byte to uint8
    uint8 afcScore = uint8(rawData[1]);
    // if the scores are equal then nobody can get ETH in this contract
    require(arsScore != afcScore);
    if (arsScore > afcScore) {
      // if ARS win then give all ETH in this contract to the first bettor
      bettor_1.transfer(address(this).balance);
    } else {
      // if AFC win then give all ETH in this contract to the second bettor
      bettor_2.transfer(address(this).balance);
    }
  }
}
    `,
  ],
}
