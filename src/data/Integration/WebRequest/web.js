export default {
  overview: [
    `You can integrate WebRequest data to your DApps in 4 steps`,
    `Pick a query key for data lookup. For instance, key 0x1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931\nd422245396e5596dd736166654c6f7700 for getting current  (in this case is "safeLow") gas price from ªhttps://docs.ethgasstation.info/ªgasStation . Each dataset has its own method to construct a valid key.`,
    `
curl -X POST \\
  https://api.kovan.bandprotocol.com/data/request \\
  -H 'Content-Type: application/json' \\
  -d '{
    "key": "0x1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd736166654c6f7700",
    "tcd": "0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8",
    "broadcast": true
}'
`,
  ],
  description: [
    `First we begin by writing the •FreeCaller smart contract which has a function •call() that allows anyone to call •target contract. Another function that •FreeCaller has is •getFairGasPrice which is left to be implemented.`,
    `We then define •QueryInterface at the top of the contract. This gives us an accessibility to trusted data available on Band Protocol. Notice that the •query is a payable function that takes •bytes and returns •bytes32 together with a timestamp and a query status.`,
    `Finally we instantiate a •QueryInterface object with TCD address 0x61518CA6F924348465B5126C0c20e843E5E6aA41. The fair gas price can be obtained by calling the •query function with key ~0x1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931\nd422245396e5596dd736166654c6f7700 .`,
  ],
  label: 'price',
  example: `🌍 We have a smart contract( •target ) that we wish to call every hour. Then we need someone to help us call the contract and we will cover the fee for the person who help us. Our solution is creating another smart contract ( •FreeCaller ) to manage the calling schedule which will pay Ether back to the caller in fair price. With Band Protocol, this is easy to implement. Let's explore how we can build this contract in a few lines of code. 👇👇👇`,
  contractName: 'FreeCallerContract',
  dataFormat: {
    description: `The return value is a bytes32 that can be converted directly to uint256 . Note that to maintain arithmetic precision, the value is multiplied by 10^18 .`,
  },
  keyFormat: {
    crypto: {
      description: [
        `A •key can be constructed by •IPFSHash concat with variables which can be in any ªhttps://solidity.readthedocs.io/en/v0.5.10/types.html#integersªuint ( •uint8 , •uint16 , •uint24 , ... , •uint256 ) and •string .
        `,
        `ˆ_wkfˆ`,
        `•IPFSHash is a representation of JSON request. The JSON request has already uploaded to IPFS, so you can go IPFS and see how JSON request looks like.`,
        `For example 0x1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd is an •IPFSHash , therefore to see the JSON request you have to encode the •IPFSHash using base58 which in this case is •QmZwVoRZJY1kSk2aoCN4sDmiMkJWGNiUrPt6Hy4yCtSX6B .

Next step is visiting ªhttps://ipfs.io/ipfs/QmZwVoRZJY1kSk2aoCN4sDmiMkJWGNiUrPt6Hy4yCtSX6Bªhttps://ipfs.io/ipfs/QmZwVoRZJY1kSk2aoCN4sDmiMkJWGNiUrPt6Hy4yCtSX6B
( concatenation of •https://ipfs.io/ipfs/ and •QmZwVoRZJY1kSk2aoCN4sDmiMkJWGNiUrPt6Hy4yCtSX6B ).
`,
        `∆{"meta": {"version": "1", "info": {"image": "https://ethgasstation.info/images/ETHgas.png", "description": "ETH Gas Station API"}, "aggregation": "MEDIAN", "variables": ["string"]}, "request": {"url": "https://ethgasstation.info/json/ethgasAPI.json", "method": "GET"}, "response": {"path": ["{0}"], "type": "uint256", "multiplier": 1e+18}}`,
        `For the request that receive multiple string parameters, each string should end with •NULL string or 0x00.
         Examples for string in bytes format
            👉 •0x45544800 is "ETH"                          (Note that the last 00 is •NULL string in bytes format)
            👉 •0x4f4d4700 is "OMG"                         (Note that the last 00 is •NULL string in bytes format)
            👉 •0x736166654c6f7700 is "safeLow"     (Note that the last 00 is •NULL string in bytes format)
            👉 •0x4c494e4b00 is "LINK"                     (Note that the last 00 is •NULL string in bytes format)
        `,
        `For integer parameter the representation bytes will be the same size with the integer.
         Examples for uint in bytes format
            👉 •0x2c is uint8(44)
            👉 •0x002c is uint16(44)
            👉 •0x00115c is uint24(4444)
            👉 0x000000000000000000000000000000000000000000000000000000000000115c is uint256(4444)
        `,
        `So in solidity it would be easy for using •abi.encodePacked to encode all parameters at once.
        `,
        `ˆ_wkeˆ`,
      ],
      keys: [],
    },
  },
  solidity: [
    `
pragma solidity ^0.5.0;










interface Target { // the contract which we want to call every hour
    function call() external;
}

contract FreeCaller {
    Target target;
    uint256 lastCall;

    constructor(Target _target) public payable {
        target = _target;
    }

    function call() public {
        uint256 startGas = gasleft();
        require(lastCall < now - 1 hours);
        lastCall = now;
        target.call();
        uint256 remainingGas = gasleft();
        msg.sender.transfer((startGas - remainingGas) * getFairGasPrice());
    }

    function getFairGasPrice() internal returns (uint256) {






    }
}
`,
    `
pragma solidity ^0.5.0;

interface QueryInterface {
    enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

    function query(bytes calldata input)
        external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

    function queryPrice() external view returns (uint256);
}

interface Target { // the contract which we want to call every hour
    function call() external;
}

contract FreeCaller {
    Target target;
    uint256 lastCall;

    constructor(Target _target) public payable {
        target = _target;
    }

    function call() public {
        uint256 startGas = gasleft();
        require(lastCall < now - 1 hours);
        lastCall = now;
        target.call();
        uint256 remainingGas = gasleft();
        msg.sender.transfer((startGas - remainingGas) * getFairGasPrice());
    }

    function getFairGasPrice() internal returns (uint256) {






    }
}
`,
    `
pragma solidity ^0.5.0;

interface QueryInterface {
    enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

    function query(bytes calldata input)
        external payable returns (bytes32 output, uint256 updatedAt, QueryStatus status);

    function queryPrice() external view returns (uint256);
}

interface Target { // the contract which we want to call every hour
    function call() external;
}

contract FreeCaller {
    Target target;
    uint256 lastCall;

    constructor(Target _target) public payable {
        target = _target;
    }

    function call() public {
        uint256 startGas = gasleft();
        require(lastCall < now - 1 hours);
        lastCall = now;
        target.call();
        uint256 remainingGas = gasleft();
        msg.sender.transfer((startGas - remainingGas) * getFairGasPrice());
    }

    function getFairGasPrice() internal returns (uint256) {
        bytes memory ipfsHash = hex"1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd";
        bytes memory key = abi.encodePacked(ipfsHash,"safeLow",byte(0));
        QueryInterface q = QueryInterface(0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8);
        (bytes32 gasPrice,,QueryInterface.QueryStatus status) = q.query.value(q.queryPrice())(key);
        require(status == QueryInterface.QueryStatus.OK);
        return uint256(gasPrice);
    }
}
`,
  ],
}
