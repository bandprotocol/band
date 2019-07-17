export default {
  description: [
    `Write a simple version of poll contract. Current the hasIdentity variable is always true, so every address can participate in this voting contract. This is vulnerable to sybil attack, we can fix it by asking identity community whether the voter/sender has an idenity.`,
    `Copy-paste •QueryInterface to the top of your smart contract. This interface acts as the gateway to access curated data available on Band Protocol securely. Notice that its query function takes •bytes and returns •bytes32 .`,
    `Instantiate a •QueryInterface object with identity community contract address at 0x616aa37B3e630fce6d96Abc2Afa767aa98280743. Use sender's address to ask the identity community whether sender has identity or not. The community will return bytes32(0) if sender has no identity and return bytes32(1) if sender has identity.`,
  ],
  label: 'identitity',
  example: `Say you have a simple poll contract for election (in this case we only have 2 candidates). Every address with know identity can paticipate in voting. To protect our voting against sybil attack we will the idenity community before any address can commit the vote. 👇👇👇`,
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
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

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
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  function query(bytes calldata input)
    external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

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
}
