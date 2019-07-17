export default {
  overview: [
    `You can integrate lottery data to your DApps with 3 simple steps`,
    `Pick the query key for data lookup. For instance, key •JPY/CNY for Japanese Yen to Chinese Yuan conversion rate. Each dataset has its own method to construct a valid key.`,
  ],
  description: [
    `Write a simple version of the Mega Millions rewarding contract. We mock the result of Mega Millions to bytes6(0) at first. We are going to replace the result by getting it from the Lottery community later.`,
    `Copy-paste •QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 .`,
    `Instantiate a •QueryInterface object with Lottery community contract address at 0x6863019Ec1A5f675ce64699020A338Ee2256B981. Mega Millions result can be obtained by query with key •MMN/20190420. Note Mega Millions result consist of 6 number, so we represent it by using bytes6.`,
  ],
  label: 'lottery',
  example: `Say you have a simple Mega Millions rewarding contract. Participant can pay 1 finney to submit his/her guess to the contract before 04/20/2019. Participant can claim reward (all ETH in the contract) if he/she has submitted the right guess. 👇👇👇`,
  contractName: 'MegaMillionContract',
  dataFormat: {
    description: `The return value from community's contract always bytes32. For ... TODO`,
  },
  keyFormat: {
    crypto: {
      header: 'List of Available Pairs',
      description:
        'The query key is •MMN/YYYYMMDD where YYYY, MM, and DD is the year, month, and date of the lottery respectively.',
      keys: [],
    },
  },
  solidity: [
    `
  pragma solidity 0.5.9;










  contract MegaMillionContract {
    // keep the record of guesses submitted by each participant
    mapping (address => bytes6) public guesses;

    function guess(bytes6 _guess) public payable  {
        // sender should never submit his/her guess before
        require(guesses[msg.sender] == bytes6(0));
        // Anyone can particippate util 04/20/2019 @ 12:00am (UTC)
        require(now <= 1555718400);
        // sender should pay 1 finney to submit his/her guess
        require(msg.value == 1 finney);
        guesses[msg.sender] = _guess;
    }

    function claimReward() public payable {


        // Mock MegaMillion result
        bytes6 result = bytes6(0);
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
    enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

    function query(bytes calldata input)
      external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

    function queryPrice() external view returns (uint256);
  }

  contract MegaMillionContract {
    // keep the record of guesses submitted by each participant
    mapping (address => bytes6) public guesses;

    function guess(bytes6 _guess) public payable  {
        // sender should never submit his/her guess before
        require(guesses[msg.sender] == bytes6(0));
        // Anyone can particippate util 04/20/2019 @ 12:00am (UTC)
        require(now <= 1555718400);
        // sender should pay 1 finney to submit his/her guess
        require(msg.value == 1 finney);
        guesses[msg.sender] = _guess;
    }

    function claimReward() public payable {


        // Mock MegaMillion result
        bytes6 result = bytes6(0);
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
    enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

    function query(bytes calldata input)
      external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

    function queryPrice() external view returns (uint256);
  }

  contract MegaMillionContract {
    // keep the record of guesses submitted by each participant
    mapping (address => bytes6) public guesses;

    function guess(bytes6 _guess) public payable  {
        // sender should never submit his/her guess before
        require(guesses[msg.sender] == bytes6(0));
        // Anyone can particippate util 04/20/2019 @ 12:00am (UTC)
        require(now <= 1555718400);
        // sender should pay 1 finney to submit his/her guess
        require(msg.value == 1 finney);
        guesses[msg.sender] = _guess;
    }

    function claimReward() public payable {
        // Create a QueryInterface pointing to Lottery community contract
        QueryInterface q = QueryInterface(0x6863019Ec1A5f675ce64699020A338Ee2256B981);
        // Get MegaMillion result from Lottery community
        bytes6 result = bytes6(q.query.value(q.queryPrice())("MMN/20190420"));
        // sender should provide the right guess before getting reward (all ETH in this contract)
        require(result == guesses[msg.sender]);
        // give all ETH in this contract to the sender
        msg.sender.transfer(address(this).balance);
    }
  }
  `,
  ],
}
