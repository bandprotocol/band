# Financial Data Feeds (Kovan)

This dataset provides near real-time update financial data across multiple asset classes. You can utilize financial data feeds to power your DeFi appplications. Below is the addresses of smart contrats associated with Financial Data Feeds (Kovan).

| Contract              | Address                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dataset Token         | [0x6566bE6fb21CA90F85b3D22D5D94FEece78B9909](https://kovan.etherscan.io/address/0x6566bE6fb21CA90F85b3D22D5D94FEece78B9909) |
| Dataset Oracle        | [0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e](https://kovan.etherscan.io/address/0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e) |
| Governance Parameters | [0x8eE1b01666bCe3889321B12D2b3cD30EaE627efE](https://kovan.etherscan.io/address/0x8eE1b01666bCe3889321B12D2b3cD30EaE627efE) |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for financial data by providing an _input key_ in return for an _output value_. We cover the specification in this subsection.

### Input Key

An input key consists of two parts, concatnated with `/` as the delimiter.

- The first part, [Query Type](#supported-query-types), is a unique identifier that identifies query type.
- The second part is a variable length parameter as required from corresponding query type.

Examples are provided as follows.

| Key (hex)                      | Key (ascii)      | Explanation                  |
| ------------------------------ | ---------------- | ---------------------------- |
| `53504f5450582f4642`           | `SPOTPX/FB`      | Spot price of Facebook stock |
| `53504f5450582f4554482d555344` | `SPOTPX/ETH-USD` | Spot price of ETH/USD pair   |

### Output Value

An output value is a 256-bit unsigned integer that represents the output result. Depending on query type, output value may be multiplied by 10<sup>18</sup> to maintain arithmetic precision.

## Query Types

Below is the list of query types currently supported in Financial Data Feeds. Each query type comes with its unique _keyword_ to use as the first part of query keys.

### Asset Spot Price - `SPOTPX`

This query returns the _current_ fair price of the given asset. Different providers may have different interpretation of what a fair price is (mid price between spread, last traded price, etc).

- **parameter**: For currency pairs, the parameter is two currency symbols separated by `-` (e.g. `ETH-USD` for `ETH` price in terms of `USD`). For other assets, the parameter is the asset symbol (e.g. `FB` for Facebook price in terms of its quote currency, `USD`).

- **output**: The final result of this dataset is the _median_ value across all data providers. The final result is multiplied by 10<sup>18</sup>.

## Asset Symbols

Financial dataset split asset symbols into several _asset classes_. Each asset class has its own method to name ticker symbols. Note that some query types only support certain asset classes.

### Currency

**Fiat currencies**

| Symbol | Description             |
| ------ | ----------------------- |
| `CNY`  | Renminbi (Chinese) Yuan |
| `JPY`  | Japanese Yen            |
| `GBP`  | Pound Sterling          |
| `THB`  | Thai Baht               |
| `USD`  | United States Dollar    |

**Cryptocurrencies**

| Symbol | Description           |
| ------ | --------------------- |
| `BTC`  | Bitcoin               |
| `ETH`  | Ethereum              |
| `XRP`  | XRP                   |
| `LTC`  | Litecoin              |
| `BCH`  | Bitcoin Cash          |
| `BAT`  | Basic Attention Token |
| `DAI`  | Dai                   |
| `OMG`  | OmiseGo               |
| `REP`  | Augur                 |
| `KNC`  | Kyber Network         |
| `USDC` | USD Coin              |
| `ZRX`  | 0x                    |

### US Equity 🇺🇸

**Quote currency**: `USD`

| Symbol | Company   |
| ------ | --------- |
| AAPL   | Apple     |
| AMZN   | Amazon    |
| FB     | Facebook  |
| GOOG   | Alphabet  |
| MSFT   | Microsoft |
| NFLX   | Netflix   |
| ORCL   | Oracle    |

### Commodity

**Quote currency**: `USD`

| Symbol | Description | Unit  |
| ------ | ----------- | ----- |
| XAU    | Gold        | Ounce |
| XAG    | Silver      | Ounce |
