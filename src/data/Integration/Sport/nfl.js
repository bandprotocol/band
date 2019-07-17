export default {
  overview: [
    `You can integrate sport data to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •20190427/BAL-BUF for Baltimore Ravens vs Buffalo Bills at 27/04/2019. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of smart contract for sport betting. We set the scores of both teams to 0 (just mock scores). We will replace these mock scores by real scores from Sport community later.`,
    `Copy-paste •QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 .`,
    `Instantiate a •QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by query with key •20190427/BAL-BUF and the scores was encoded in first byte and second byte of the return value.`,
  ],
  label: 'sport',
  example: `🏈 Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If BAL (an american football team) win first bettor will receive all ETH in the contract. If BUF (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
  contractName: 'SportBettingContract',
  dataFormat: {
    description: `Return value from community's contract always •bytes32 .　
      Sport Community will return score of home team and score of away team which are represented with first 2 bytes of the return value.
      For example
        👉 You have called •q.query.value(q.queryPrice())("20190427/BAL-BUF") 　
        👉 The return value is 0x1f3c000000000000000000000000000000000000000000000000000000000000 　
        👉 So the score of BAL is 0x1f (base 16) which is equal to 31 (base 10) 　
        👉 And the score of BUF is 0x3c (base 16) which is equal to 60 (base 10) 　
      `,
  },
  keyFormat: {
    nfl: {
      header: 'List of Available NFL Teams',
      description: `🇺🇸 🏈 NFL or National Football League dataset group has provided keys for query matches score.
      Format of the key is composed of Date(year,month,day)/home-away . For example •20190120/BAL-BUF which mean the key for query score of Baltimore Ravens(home team) and Buffalo Bills(away team).
      The return result from query is 32 bytes , so the score of BAL will be encoded in first byte and score of BUF will be encoded in second byte .`,
      keys: [
        [
          'ARI',
          'Arizona Cardinals',
          'https://upload.wikimedia.org/wikipedia/en/7/72/Arizona_Cardinals_logo.svg',
        ],
        [
          'ATL',
          'Atlanta Falcons',
          'https://upload.wikimedia.org/wikipedia/en/c/c5/Atlanta_Falcons_logo.svg',
        ],
        [
          'BAL',
          'Baltimore Ravens',
          'https://upload.wikimedia.org/wikipedia/en/1/16/Baltimore_Ravens_logo.svg',
        ],
        [
          'BUF',
          'Buffalo Bills',
          'https://upload.wikimedia.org/wikipedia/en/7/77/Buffalo_Bills_logo.svg',
        ],
        [
          'CAR',
          'Carolina Panthers',
          'https://upload.wikimedia.org/wikipedia/en/1/1c/Carolina_Panthers_logo.svg',
        ],
        [
          'CHI',
          'Chicago Bears',
          'https://upload.wikimedia.org/wikipedia/commons/5/5c/Chicago_Bears_logo.svg',
        ],
        [
          'CIN',
          'Cincinnati Bengals',
          'https://upload.wikimedia.org/wikipedia/commons/8/81/Cincinnati_Bengals_logo.svg',
        ],
        [
          'CLE',
          'Cleveland Browns',
          'https://upload.wikimedia.org/wikipedia/en/d/d9/Cleveland_Browns_logo.svg',
        ],
        [
          'DAL',
          'Dallas Cowboys',
          'https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg',
        ],
        [
          'DEN',
          'Denver Broncos',
          'https://upload.wikimedia.org/wikipedia/en/4/44/Denver_Broncos_logo.svg',
        ],
        [
          'DET',
          'Detroit Lions',
          'https://upload.wikimedia.org/wikipedia/en/7/71/Detroit_Lions_logo.svg',
        ],
        [
          'GRE',
          'Green Bay Packers',
          'https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg',
        ],
        [
          'HOU',
          'Houston Texans',
          'https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Texans_logo.svg',
        ],
        [
          'IND',
          'Indianapolis Colts',
          'https://upload.wikimedia.org/wikipedia/commons/0/00/Indianapolis_Colts_logo.svg',
        ],
        [
          'JAC',
          'Jacksonville Jaguars',
          'https://upload.wikimedia.org/wikipedia/en/7/74/Jacksonville_Jaguars_logo.svg',
        ],
        [
          'KAN',
          'Kansas City Chiefs',
          'https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg',
        ],
        [
          'BAL',
          'Los Angeles Chargers',
          'https://upload.wikimedia.org/wikipedia/en/7/72/NFL_Chargers_logo.svg',
        ],
        [
          'LAR',
          'Los Angeles Rams',
          'https://upload.wikimedia.org/wikipedia/en/8/8a/Los_Angeles_Rams_logo.svg',
        ],
        [
          'MIA',
          'Miami Dolphins',
          'https://upload.wikimedia.org/wikipedia/en/3/37/Miami_Dolphins_logo.svg',
        ],
        [
          'MIN',
          'Minnesota Vikings',
          'https://upload.wikimedia.org/wikipedia/en/4/48/Minnesota_Vikings_logo.svg',
        ],
        [
          'NEW',
          'New England Patriots',
          'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg',
        ],
        [
          'NEW',
          'New Orleans Saints',
          'https://upload.wikimedia.org/wikipedia/commons/5/50/New_Orleans_Saints_logo.svg',
        ],
        [
          'NYG',
          'New York Giants',
          'https://upload.wikimedia.org/wikipedia/commons/6/60/New_York_Giants_logo.svg',
        ],
        [
          'NYJ',
          'New York Jets',
          'https://upload.wikimedia.org/wikipedia/en/6/6b/New_York_Jets_logo.svg',
        ],
        [
          'OAK',
          'Oakland Raiders',
          'https://upload.wikimedia.org/wikipedia/en/e/ec/Oakland_Raiders_logo.svg',
        ],
        [
          'PHI',
          'Philadelphia Eagles',
          'https://upload.wikimedia.org/wikipedia/en/8/8e/Philadelphia_Eagles_logo.svg',
        ],
        [
          'PIT',
          'Pittsburgh Steelers',
          'https://upload.wikimedia.org/wikipedia/commons/d/de/Pittsburgh_Steelers_logo.svg',
        ],
        [
          'SAN',
          'San Francisco 49ers',
          'https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg',
        ],
        [
          'SEA',
          'Seattle Seahawks',
          'https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg',
        ],
        [
          'TAM',
          'Tampa Bay Buccaneers',
          'https://upload.wikimedia.org/wikipedia/en/a/a2/Tampa_Bay_Buccaneers_logo.svg',
        ],
        [
          'TEN',
          'Tennessee Titans',
          'https://upload.wikimedia.org/wikipedia/en/c/c1/Tennessee_Titans_logo.svg',
        ],
        [
          'WAS',
          'Washington Redskins',
          'https://upload.wikimedia.org/wikipedia/en/6/63/Washington_Redskins_logo.svg',
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




          // Mock BAL's scores
          uint8 balScore = 0;
          // Mock BUF's scores
          uint8 bufScore = 0;
          // if the scores are equal then nobody can get ETH in this contract
          require(balScore != bufScore);
          if (balScore > bufScore) {
              // if BAL win then give all ETH in this contract to the first bettor
              bettor_1.transfer(address(this).balance);
          } else {
              // if BUF win then give all ETH in this contract to the second bettor
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




          // Mock BAL's scores
          uint8 balScore = 0;
          // Mock BUF's scores
          uint8 bufScore = 0;
          // if the scores are equal then nobody can get ETH in this contract
          require(balScore != bufScore);
          if (balScore > bufScore) {
              // if BAL win then give all ETH in this contract to the first bettor
              bettor_1.transfer(address(this).balance);
          } else {
              // if BUF win then give all ETH in this contract to the second bettor
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
          bytes32 rawData = q.query.value(q.queryPrice())("20190427/BAL-BUF");
          // Get BAL's score from the first byte and then convert from byte to uint8
          uint8 balScore = uint8(rawData[0]);
          // Get BUF's score from the second byte and then convert from byte to uint8
          uint8 bufScore = uint8(rawData[1]);
          // if the scores are equal then nobody can get ETH in this contract
          require(balScore != bufScore);
          if (balScore > bufScore) {
              // if BAL win then give all ETH in this contract to the first bettor
              bettor_1.transfer(address(this).balance);
          } else {
              // if BUF win then give all ETH in this contract to the second bettor
              bettor_2.transfer(address(this).balance);
          }
      }
    }
    `,
  ],
}
