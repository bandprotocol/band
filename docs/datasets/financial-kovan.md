# Financial Data Feeds (Kovan)

This dataset provides near real-time update financial data across multiple asset classes. You can utilize financial data feeds to power your DeFi appplications. Below is the addresses of smart contrats associated with Financial Data Feeds (Kovan).

| Contract              | Address                                    |
| --------------------- | ------------------------------------------ |
| Dataset Token         | 0x79febf6b9f76853edbcbc913e6aae8232cfb9de9 |
| Dataset Oracle        | 0x79febf6b9f76853edbcbc913e6aae8232cfb9de9 |
| Governance Parameters | 0x79febf6b9f76853edbcbc913e6aae8232cfb9de9 |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for financial data by providing an _input key_ in return for an _output value_. We cover the specification in this subsection.

### Input Key

An input key consists of three parts. All three parts are concatnated without a delimiter. Examples are provided as follows.

- The first part is one byte version number. The current version is `0x01`.
- The second part, [Query Type](#supported-query-types), is a 4-byte unique identifier that identifies query type.
- The third part is a variable length parameter as required from corresponding query type.

| Key (hex)                  | Key (ascii)    | Explanation                  |
| -------------------------- | -------------- | ---------------------------- |
| `0180dec7374642`           | `.....FB`      | Spot price of Facebook stock |
| `0180dec7374554482f555344` | `.....ETH/USD` | Spot price of ETH/USD pair   |

### Output Value

An output value is a 256-bit unsigned integer that represents the output result. Depending on query type, output value may be multiplied by 10<sup>18</sup> to maintain arithmetic precision.

## Query Types

Below is the list of query types currently supported in Financial Data Feeds. Each query type comes with its unique _keyword_ and 4-byte unique identifier defined as the first 4 bytes of [keccak256](https://emn178.github.io/online-tools/keccak_256.html) of the keyword.

### Asset Spot Price

| Keyword            | Hex ID     | Asset classes |
| ------------------ | ---------- | ------------- |
| `asset_spot_price` | `80dec737` | All           |

This query returns the _current_ fair price of the given asset. Different providers may have different interpretation of what a fair price is (mid price between spread, last traded price, etc).

- **parameter**: For currency pairs, the parameter is two currency symbols separated by `/` (e.g. `ETH/USD` for `ETH` price in terms of `USD`). For other assets, the parameter is the asset symbol (e.g. `FB` for Facebook price in terms of its quote currency, `USD`).

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
| `USD`  | United States Dollar    |
| `THB`  | Thai Baht               |

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
