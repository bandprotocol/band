export default {
  overview: [
    `You can integrate sport data to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key JPY/CNY for Japanese Yen to Chinese Yuan conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of smart contract for sport betting. We set the scores of both teams to 0 (just mock scores). We will replace these mock scores by real scores from Sport community later.`,
    `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32.`,
    `Instantiate a QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by query with key 20190427/LAC-GSW and the scores was encoded in first byte and second byte of the return value.`,
  ],
  label: 'sport',
  example: `⚽️ Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If LAC (a basketball team) win first bettor will receive all ETH in the contract. If GSW (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
  contractName: 'SportBettingContract',
  dataFormat: {
    description: `Return value from community's contract always bytes32 .　
      Sport Community will return score of home team and score of away team which are represented with first 2 bytes of the return value.
      For example
        👉 You have called q.query.value(q.queryPrice())("20190427/LAC-GSW") 　
        👉 The return value is 0x1f3c000000000000000000000000000000000000000000000000000000000000 　
        👉 So the score of LAC is 0x1f (base 16) which is equal to 31 (base 10) 　
        👉 And the score of GSW is 0x3c (base 16) which is equal to 60 (base 10) 　
      `,
  },
  keyFormat: {
    nfl: {
      header: 'List of Available NFL Teams',
      description: `🇺🇸 🏈
      NFL or National Football League community has provided keys for query matches score.
      Format of the key is composed of Date(year,month,day)/home-away . For example 20190120/LAC-NE which mean the key for query score of Los Angeles Chargers(home team) and New England Patriots (away team).
      The return result from query is 32 bytes , so the score of LAC will be encoded in first byte and score of NE will be encoded in second byte .`,
      keys: [
        [
          'ARI',
          'Arizona Cardinals',
          'https://static.nfl.com/static/site/img/logos/svg/teams/ARI.svg',
        ],
        [
          'ATL',
          'Atlanta Falcons',
          'https://static.nfl.com/static/site/img/logos/svg/teams/ATL.svg',
        ],
        [
          'BAL',
          'Baltimore Ravens',
          'https://static.nfl.com/static/site/img/logos/svg/teams/BAL.svg',
        ],
        [
          'BUF',
          'Buffalo Bills',
          'https://static.nfl.com/static/site/img/logos/svg/teams/BUF.svg',
        ],
        [
          'CHI',
          'Chicago Bears',
          'https://static.nfl.com/static/site/img/logos/svg/teams/CHI.svg',
        ],
        [
          'CIN',
          'Cincinnati Bengals',
          'https://static.nfl.com/static/site/img/logos/svg/teams/CIN.svg',
        ],
        [
          'DAL',
          'Dallas Cowboys',
          'https://static.nfl.com/static/site/img/logos/svg/teams/DAL.svg',
        ],
        [
          'DEN',
          'Denver Broncos',
          'https://static.nfl.com/static/site/img/logos/svg/teams/DEN.svg',
        ],
        [
          'HOU',
          'Houston Texans',
          'https://static.nfl.com/static/site/img/logos/svg/teams/HOU.svg',
        ],
        [
          'IND',
          'Indianapolis Colts',
          'https://static.nfl.com/static/site/img/logos/svg/teams/IND.svg',
        ],
        [
          'KC',
          'Kansas City Chiefs',
          'https://static.nfl.com/static/site/img/logos/svg/teams/KC.svg',
        ],
        [
          'LAC',
          'Los Angeles Chargers',
          'https://static.nfl.com/static/site/img/logos/svg/teams/LAC.svg',
        ],
        [
          'LAR',
          'Los Angeles Rams',
          'https://static.nfl.com/static/site/img/logos/svg/teams/LA.svg',
        ],
        [
          'NE',
          'New England Patriots',
          'https://static.nfl.com/static/site/img/logos/svg/teams/NE.svg',
        ],
        [
          'NO',
          'New Orleans Saints',
          'https://static.nfl.com/static/site/img/logos/svg/teams/NO.svg',
        ],
        [
          'PHI',
          'Philadelphia Eagles',
          'https://static.nfl.com/static/site/img/logos/svg/teams/PHI.svg',
        ],
        [
          'PIT',
          'Pittsburgh Steelers',
          'https://static.nfl.com/static/site/img/logos/svg/teams/PIT.svg',
        ],
        [
          'SEA',
          'Seattle Seahawks',
          'https://static.nfl.com/static/site/img/logos/svg/teams/SEA.svg',
        ],
        [
          'SF',
          'San Francisco',
          'https://static.nfl.com/static/site/img/logos/svg/teams/SF.svg',
        ],
        [
          'TB',
          'Tampa Bay Buccaneers',
          'https://static.nfl.com/static/site/img/logos/svg/teams/TB.svg',
        ],
        [
          'TEN',
          'Tennessee Titans',
          'https://static.nfl.com/static/site/img/logos/svg/teams/TEN.svg',
        ],
        [
          'WAS',
          'Washington Redskins',
          'https://static.nfl.com/static/site/img/logos/svg/teams/WAS.svg',
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
}
