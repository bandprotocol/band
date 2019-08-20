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

An input key consists of two parts. The first part, [Query Type](#supported-query-types), is a 4-byte unique identifier that specifies the type of financial data query. The second part, [Asset Symbol](#asset-symbols), is a variable length string that uniquely identifies the asset to query. Both parts are concatnated without a delimiter. Examples are provided as follows.

| Key (hex)                | Key (ascii)   | Explanation                |
| ------------------------ | ------------- | -------------------------- |
| `80dec7374554482f555344` | `....ETH/USD` | Spot price of ETH/USD pair |
| `80dec7374441492f455448` | `....DAI/ETH` | Spot price of DAI/ETH pair |

### Output Value

An output value is a 256-bit unsigned integer that represents the output result. Depending on query type, output value may be multiplied by 10<sup>18</sup> to maintain arithmetic precision.

## Query Types

Below is the list of query types currently supported in Financial Data Feeds. Each query type comes with its unique _keyword_ and 4-byte unique identifier defined as the first 4 bytes of [keccak256](https://emn178.github.io/online-tools/keccak_256.html) of the keyword.

### Asset Spot Price

| Keyword            | Hex ID     | Asset Classes |
| ------------------ | ---------- | ------------- |
| `asset_spot_price` | `80dec737` | TODO          |

This query returns the _current_ fair trade price of the given asset. Different providers may have different interpretation of what a fair price is (the current mid price between spread, the last traded price, etc). The final result of this dataset is the _median_ value across all data providers. The final result is multiplied by 10<sup>18</sup>.

## Asset Symbols

Financial dataset split asset symbols into several _asset classes_. Each asset class has their own method of naming ticker symbol. It is also important to note that some query types only support certain asset classes.

### Crypto-Fiat

TODO

### US Equity

TODO

### Foreign Exchange

TODO

### Commodity

TODO
