# Financial Data Feeds (Mainnet)

This dataset provides near real-time update financial data across multiple asset classes. You can utilize financial data feeds to power your DeFi appplications. Below is the addresses of smart contrats associated with Financial Data Feeds.

| Contract              | Address                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Dataset Token         | [0x33d3f653c9D86dC726337Cf395FaB39583A35988](https://etherscan.io/address/0x33d3f653c9D86dC726337Cf395FaB39583A35988) |
| Dataset Oracle        | [0xD5D2b9e9bcd172D5fC8521AFd2C98Dd239F5b607](https://etherscan.io/address/0xD5D2b9e9bcd172D5fC8521AFd2C98Dd239F5b607) |
| Governance Parameters | [0x584DD3Df26BD6F6CDfD9b08B85130e9c53709CEc](https://etherscan.io/address/0x584DD3Df26BD6F6CDfD9b08B85130e9c53709CEc) |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for financial data by providing an _input key_ in return for an _output value_. We cover the specification in this subsection.

### Input Key

An input key consists of two parts, concatnated with `/` as the delimiter.

- The first part, [Query Type](#supported-query-types), is a unique identifier that identifies query type.
- The second part is a variable length parameter as required from corresponding query type.

Examples are provided as follows.

| Key (hex)                      | Key (ascii)      | Explanation                |
| ------------------------------ | ---------------- | -------------------------- |
| `53504f5450582f4254432d555344` | `SPOTPX/BTC-USD` | Spot price of BTC/USD pair |
| `53504f5450582f4554482d555344` | `SPOTPX/ETH-USD` | Spot price of ETH/USD pair |

### Output Value

An output value is a 256-bit unsigned integer that represents the output result. Depending on query type, output value may be multiplied by 10<sup>18</sup> to maintain arithmetic precision.

## Query Types

Below is the list of query types currently supported in Financial Data Feeds. Each query type comes with its unique _keyword_ to use as the first part of query keys.

### Asset Spot Price - `SPOTPX`

This query returns the _current_ fair price of the given asset. Different providers may have different interpretation of what a fair price is (mid price between spread, last traded price, etc).

- **parameter**: As of the current release, two parameters are supported: `BTC-USD` for BTC/USD price, and `ETH-USD` for ETH/USD price.

- **output**: The final result of this dataset is the _median_ value across all data providers. The final result is multiplied by 10<sup>18</sup>.
