export default {
  'Price Dataset': {
    description: [
      `Write a simple version of the smart contract. We set the price at 10 USD. As you can see buyTicket function allows anyone to buy a ticket. The only remaining hole to fill is the exchange rate between ETH and USD.`,
      `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32 .`,
      `Instantiate a QueryInterface object with PriceCommunity contract address at 0x8B3dBb2Db70120Cf4D24c739E1c296DE98644238 . ETH/USD exchange rate can be obtained by query with key ETH/USD . The return value is the (exchange rate) * 10^18 . Note that you need to convert bytes32 result to uint256 .`,
    ],
    h1: `Integrate Off-Chain Price Data to Your Smart Contracts in Minutes!`,
    h2: `Looking for a simple, decentralized, and secured way for your Dapps to consume trusted price information? We got you covered!`,
    example: `Say you have a simple smart contract for selling concert tickets. Users must pay in ETH, but we want the price of each ticket to be exactly 10 USD. In other words, a ticket costs whatever amount ETH worth 10 USD at the purchase time. The smart contract needs a real-time exchange rate of ETH/USD. 👇👇👇`,
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
          [
            'MKR/ETH',
            'Price of 1 Maker in Ethereum unit multiply by 10^18',
            '',
          ],
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
          [
            'ZRX/ETH',
            'Price of 1 ZeroX in Ethereum unit multiply by 10^18',
            '',
          ],
          ['DAI/ETH', 'Price of 1 Dai in Ethereum unit multiply by 10^18', ''],
          [
            'REP/ETH',
            'Price of 1 Augur in Ethereum unit multiply by 10^18',
            '',
          ],
          ['KNC/ETH', 'Price of 1 Band in Ethereum unit multiply by 10^18', ''],
        ],
      },
    },
  },
  LotteryFeedCommunity: {
    description: [
      `Write a simple version of the Power ball rewarding contract. We mock the result of Power ball to bytes7(0) at first. We are going to replace the result by getting it from the Lottery community later.`,
      `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32.`,
      `Instantiate a QueryInterface object with Lottery community contract address at 0x6863019Ec1A5f675ce64699020A338Ee2256B981. Power ball result can be obtained by query with key PWB/20190420. Note Power ball result consist of 7 number, so we represent it by using bytes7.`,
    ],
    h1: `Integrate Off-Chain lottery Data to Your Smart Contracts in Minutes!`,
    h2: `Looking for a simple, decentralized, and secured way for your Dapps to consume trusted lottery information? We got you covered!`,
    example: `Say you have a simple Power ball rewarding contract. Participant can pay 1 finney to submit his/her guess to the contract before 04/20/2019. Participant can claim reward (all ETH in the contract) if he/she has submitted the right guess. 👇👇👇`,
    contractName: 'PowerBallContract',
  },
  SportFeedCommunity: {
    description: [
      `Write a simple version of smart contract for sport betting. We set the scores of both teams to 0 (just mock scores). We will replace these mock scores by real scores from Sport community later.`,
      `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32.`,
      `Instantiate a QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by query with key 20190427/LAC-GSW and the scores was encoded in first byte and second byte of the return value.`,
    ],
    h1: `Integrate Off-Chain Sport Events Data to Your Smart Contracts in Minutes!`,
    h2: `Looking for a simple, decentralized, and secured way for your Dapps to consume trusted sport information? We got you covered!`,
    example: `Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If LAC (a basketball team) win first bettor will receive all ETH in the contract. If GSW (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
    contractName: 'SportBettingContract',
    dataFormat: {
      description: `Return value from community's contract always bytes32 .　
SportFeedCommunity will return score of home team and score of away team which are represented with first 2 bytes of the return value.
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
  },
  BandIdentity: {
    description: [
      `Write a simple version of poll contract. Current the hasIdentity variable is always true, so every address can participate in this voting contract. This is vulnerable to sybil attack, we can fix it by asking identity community whether the voter/sender has an idenity.`,
      `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32.`,
      `Instantiate a QueryInterface object with identity community contract address at 0x616aa37B3e630fce6d96Abc2Afa767aa98280743. Use sender's address to ask the identity community whether sender has identity or not. The community will return bytes32(0) if sender has no identity and return bytes32(1) if sender has identity.`,
    ],
    h1: `Integrate Off-Chain Identity Data to Your Smart Contracts in Minutes!`,
    h2: `Looking for a simple, decentralized, and secured way for your Dapps to consume trusted identity information? We got you covered!`,
    example: `Say you have a simple poll contract for election (in this case we only have 2 candidates). Every address with know identity can paticipate in voting. To protect our voting against sybil attack we will the idenity community before any address can commit the vote. 👇👇👇`,
  },
}
