export default {
  overview: [
    `You can integrate sport data to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •20190427/ARI-BAL for baseball match Arizona Diamondbacks vs Baltimore Orioles at date 27/04/2019. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of smart contract for sport betting. We set the scores of both teams to 0 (just mock scores). We will replace these mock scores by real scores from Sport community later.`,
    `Copy-paste •QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 .`,
    `Instantiate a •QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by query with key •20190427/ARI-BAL and the scores was encoded in first byte and second byte of the return value.`,
  ],
  label: 'sport',
  example: `⚾️ Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If ARI (a baseball team) win first bettor will receive all ETH in the contract. If BAL (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
  contractName: 'SportBettingContract',
  dataFormat: {
    description: `Return value from community's contract always •bytes32 .　
      Sport Community will return score of home team and score of away team which are represented with first 2 bytes of the return value.
      For example
        👉 You have called •q.query.value(q.queryPrice())("20190427/ARI-BAL") 　
        👉 The return value is 0x1f3c000000000000000000000000000000000000000000000000000000000000 　
        👉 So the score of ARI is 0x1f (base 16) which is equal to 31 (base 10) 　
        👉 And the score of BAL is 0x3c (base 16) which is equal to 60 (base 10) 　
      `,
  },
  keyFormat: {
    nfl: {
      header: 'List of Available NFL Teams',
      description: `⚾️ MLB or Major League Baseball dataset group has provided keys for query matches score.
      Format of the key is composed of Date(year,month,day)/home-away . For example •20190427/ARI-BAL which mean the key for query score of Los Angeles Chargers(home team) and New England Patriots (away team).
      The return result from query is 32 bytes , so the score of ARI will be encoded in first byte and score of BAL will be encoded in second byte .`,
      keys: [
        [
          'ATL',
          'Atlanta Braves',
          'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
        ],
        [
          'MIA',
          'Miami Marlins',
          'https://upload.wikimedia.org/wikipedia/en/f/fd/Marlins_team_logo.svg',
        ],
        [
          'NEW',
          'New York Mets',
          'https://upload.wikimedia.org/wikipedia/en/7/7b/New_York_Mets.svg',
        ],
        [
          'PHI',
          'Philadelphia Phillies',
          'https://upload.wikimedia.org/wikipedia/en/4/47/New_Phillies_logo.png',
        ],
        [
          'WAS',
          'Washington Nationals',
          'https://upload.wikimedia.org/wikipedia/en/a/a3/Washington_Nationals_logo.svg',
        ],
        [
          'CHI',
          'Chicago Cubs',
          'https://upload.wikimedia.org/wikipedia/commons/8/80/Chicago_Cubs_logo.svg',
        ],
        [
          'CIN',
          'Cincinnati Reds',
          'https://upload.wikimedia.org/wikipedia/commons/0/01/Cincinnati_Reds_Logo.svg',
        ],
        [
          'MIL',
          'Milwaukee Brewers',
          'https://upload.wikimedia.org/wikipedia/en/1/11/Milwaukee_Brewers_Logo.svg',
        ],
        [
          'PIT',
          'Pittsburgh Pirates',
          'https://upload.wikimedia.org/wikipedia/commons/8/81/Pittsburgh_Pirates_logo_2014.svg',
        ],
        [
          'SLC',
          'St. Louis Cardinals',
          'https://upload.wikimedia.org/wikipedia/en/9/9d/St._Louis_Cardinals_logo.svg',
        ],
        [
          'ARI',
          'Arizona Diamondbacks',
          'https://upload.wikimedia.org/wikipedia/en/8/89/Arizona_Diamondbacks_logo.svg',
        ],
        [
          'COL',
          'Colorado Rockies',
          'https://upload.wikimedia.org/wikipedia/commons/3/31/Colorado_Rockies_logo.svg',
        ],
        [
          'LOS',
          'Los Angeles Dodgers',
          'https://upload.wikimedia.org/wikipedia/en/6/69/Los_Angeles_Dodgers_logo.svg',
        ],
        [
          'SAN',
          'San Diego Padres',
          'https://upload.wikimedia.org/wikipedia/commons/a/a4/SDPadres_logo.svg',
        ],
        [
          'SAN',
          'San Francisco Giants',
          'https://upload.wikimedia.org/wikipedia/en/5/58/San_Francisco_Giants_Logo.svg',
        ],
        [
          'BAL',
          'Baltimore Orioles',
          'https://upload.wikimedia.org/wikipedia/en/7/75/Baltimore_Orioles_cap.svg',
        ],
        [
          'BOS',
          'Boston Red Sox',
          'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
        ],
        [
          'NEW',
          'New York Yankees',
          'https://upload.wikimedia.org/wikipedia/en/2/25/NewYorkYankees_PrimaryLogo.svg',
        ],
        [
          'TAM',
          'Tampa Bay Rays',
          'https://upload.wikimedia.org/wikipedia/en/c/c6/Tampa_Bay_Rays.svg',
        ],
        [
          'TOR',
          'Toronto Blue Jays',
          'https://upload.wikimedia.org/wikipedia/en/b/ba/Toronto_Blue_Jays_logo.svg',
        ],
        [
          'CHI',
          'Chicago White Sox',
          'https://upload.wikimedia.org/wikipedia/commons/c/c1/Chicago_White_Sox.svg',
        ],
        [
          'CLE',
          'Cleveland Indians',
          'https://upload.wikimedia.org/wikipedia/commons/e/ee/Cleveland_Indians_primary_logo.svg',
        ],
        [
          'DET',
          'Detroit Tigers',
          'https://upload.wikimedia.org/wikipedia/commons/e/e3/Detroit_Tigers_logo.svg',
        ],
        [
          'KAN',
          'Kansas City Royals',
          'https://upload.wikimedia.org/wikipedia/en/1/1c/Kansas_City_Royals.svg',
        ],
        [
          'MIN',
          'Minnesota Twins',
          'https://upload.wikimedia.org/wikipedia/en/7/71/Minnesota_Twins_logo.svg',
        ],
        [
          'HOU',
          'Houston Astros',
          'https://upload.wikimedia.org/wikipedia/commons/6/6b/Houston-Astros-Logo.svg',
        ],
        [
          'LOS',
          'Los Angeles Angels',
          'https://upload.wikimedia.org/wikipedia/commons/8/8b/Los_Angeles_Angels_of_Anaheim.svg',
        ],
        [
          'OAK',
          'Oakland Athletics',
          'https://upload.wikimedia.org/wikipedia/commons/a/a4/Oakland_A%27s_logo.svg',
        ],
        [
          'SEA',
          'Seattle Mariners',
          'https://upload.wikimedia.org/wikipedia/en/b/b0/Seattle_Mariners_logo.svg',
        ],
        [
          'TEX',
          'Texas Rangers',
          'https://upload.wikimedia.org/wikipedia/en/4/41/Texas_Rangers.svg',
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




          // Mock ARI's scores
          uint8 ariScore = 0;
          // Mock BAL's scores
          uint8 balScore = 0;
          // if the scores are equal then nobody can get ETH in this contract
          require(ariScore != balScore);
          if (ariScore > balScore) {
              // if ARI win then give all ETH in this contract to the first bettor
              bettor_1.transfer(address(this).balance);
          } else {
              // if BAL win then give all ETH in this contract to the second bettor
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




          // Mock ARI's scores
          uint8 ariScore = 0;
          // Mock BAL's scores
          uint8 balScore = 0;
          // if the scores are equal then nobody can get ETH in this contract
          require(ariScore != balScore);
          if (ariScore > balScore) {
              // if ARI win then give all ETH in this contract to the first bettor
              bettor_1.transfer(address(this).balance);
          } else {
              // if BAL win then give all ETH in this contract to the second bettor
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
          (bytes32 rawData,,QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())("20190427/ARI-BAL");
          // Query status should be OK to continue
          require(status == QueryInterface.QueryStatus.OK);
          // Get ARI's score from the first byte and then convert from byte to uint8
          uint8 ariScore = uint8(rawData[0]);
          // Get BAL's score from the second byte and then convert from byte to uint8
          uint8 balScore = uint8(rawData[1]);
          // if the scores are equal then nobody can get ETH in this contract
          require(ariScore != balScore);
          if (ariScore > balScore) {
              // if ARI win then give all ETH in this contract to the first bettor
              bettor_1.transfer(address(this).balance);
          } else {
              // if BAL win then give all ETH in this contract to the second bettor
              bettor_2.transfer(address(this).balance);
          }
      }
    }
    `,
  ],
}
