export default {
  PriceFeedCommunity: {
    description: [
      `Write a simple version of the smart contract. We set the price at 10 USD. As you can see buyTicket function allows anyone to buy a ticket. The only remaining hole to fill is the exchange rate between ETH and USD.`,
      `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32.`,
      `Instantiate a QueryInterface object with Price Feed smart contract address at 0x8B3dBb2Db70120Cf4D24c739E1c296DE98644238. ETH/USD exchange rate can be obtained by querying with key ETH/USD. Note that you need to convert bytes32 result to uint256. The returned value is the exchange rate multiplied by 10^18.`,
    ],
    h1: `Integrate Off-Chain Price Data to Your Smart Contracts in Minutes!`,
    h2: `Looking for a simple, decentralized, and secured way for your Dapps to consume trusted price information? We got you covered!`,
    example: `Say you have a simple smart contract for selling concert tickets. Users must pay in ETH, but we want the price of each ticket to be exactly 10 USD. In other words, a ticket costs whatever amount ETH worth 10 USD at the purchase time. The smart contract needs a real-time exchange rate of ETH/USD. 👇👇👇`,
    contractName: 'TicketSellerContract',
  },
  LotteryFeedCommunity: {
    description: [
      `Write a simple version of the Power ball rewarding contract. We mock the result of Power ball to bytes7(0) at first. We are going to replace the result by getting it from the Lottery community later.`,
      `Copy-paste QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes bytes and returns bytes32.`,
      `Instantiate a QueryInterface object with Lottery community contract address at 0x6863019Ec1A5f675ce64699020A338Ee2256B981. Power ball result can be obtained by querying with key PWB/20190420. Note Power ball result consist of 7 number, so we represent it by using bytes7.`,
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
      `Instantiate a QueryInterface object with Sport Feed smart contract address at 0x7d19771a15c1314be9Bd436092A727A70Edc6482. Scores of both team can be obtained by querying with key NBA2019/20190427/LAC-GSW and the scores was encoded in first byte and second byte of the return value.`,
    ],
    h1: `Integrate Off-Chain Sport Events Data to Your Smart Contracts in Minutes!`,
    h2: `Looking for a simple, decentralized, and secured way for your Dapps to consume trusted sport information? We got you covered!`,
    example: `Say you have a simple smart contract for sport betting. Contract creator has deposited some amount of ETH and assigned two bettors since the contract was created. If LAC (a basketball team) win first bettor will receive all ETH in the contract. If GSW (another basketball team) win second bettor will receive all ETH in the contract. If scores are equal then nobody can get ETH in this contract.👇👇👇`,
    contractName: 'SportBettingContract',
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
