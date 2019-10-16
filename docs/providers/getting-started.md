# Run Basic Provider Node

This subsection covers how you can run a simple data provider node to serve data to Band Protocol. It will primarily cover how to run the node. However, to be eligible for a data provider slot, you will also need to acquire dataset tokens and gain appropriate amount of stakes.

## Requirements

::: tip Beta Software
Provider node is not on its public release yet and will require building from source. APIs and interfaces may change without prior notices. We are working on its binary and Docker releases. Expect them to come soon!
:::

To build and run provider node, the followings are required.

- A computing machine with internet connection and can be reached through a HTTP request.
- [Go](https://golang.org) version >= 1.12

In addition, you will need to contact Band Foundation to add your node's URL to the coordinator's registry. This requirement will disappear as Band is moving towards a decentralized, leaderless provider network architecture.

## Installation

Download the binary of provider node.

```sh
$ wget https://github.com/bandprotocol/band/releases/download/0.0.1/node_linux_amd64
```

## Setup Configuration File

Band's provider
Next

- `port`: The port that this provide node will listen to the coordinator's request
- `privateKey`: Your private key for signing data
- `drivers`: The driver for each type of dataset. Note that different kinds of drivers take different types of arguments. Some drivers are _higher-order_ and contain child drivers. Band Protocol provides various types of builtin drivers below. Note that we regularly fix bugs, update, and make changes to this list.

```yaml
port: 5000
privateKey: YOUR_PRIVATE_KEY
drivers:
  "0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e": # Dataset Address
    name: AggMedian # Handle the query with "AggMedian" driver
    children: # "children" arguments of "AggMedian" driver
      kraken:
        name: Kraken
      gemini:
        name: Gemini
```

## Run Provider Node

Lastly, to run a provider node, simply run the binary with the full name of the configuration file (without `yaml` extension).

```sh
$ ./node_linux_amd64 node
```

## Available Drivers

The following is the list of currently supported drivers.

- `AggMedian`: (Meta) Median aggregation from child drivers.
- `PriceHttp`: Connect to a custom HTTP endpoint. See next subsection for more details.
- `AlphaVantageForex`: Connect to [AlphaVantage](https://www.alphavantage.co/) forex API.
- `AlphaVantageStock`: Connect to [AlphaVantage](https://www.alphavantage.co/) stock API.
- `Bancor`: Connect to [Bancor](https://bancor.network) price feeds.
- `Bitfinex`: Connect to [Bitfinex](https://www.bitfinex.com) price feeds.
- `Bittrex`: Connect to [Bittrex](https://bittrex.com) price feeds.
- `CoinBase`: Connect to [Coinbase](https://coinbase.com) price feeds.
- `CoinGecko`: Connect to [CoinGecko](https://coingecko.com) API.
- `CoinMarketCap`: Connect to [CoinMarketCap](https://coinmarketcap.com) API.
- `CryptoCompare`: Connect to [CryptoCompare](https://cryptocompare.com) API.
- `CurrencyConverter`: Connect to [CurrencyConverter](https://free.currencyconverterapi.com/) API.
- `FinancialModelPrep`: Connect to [FMP](https://financialmodelingprep.com/) API.
- `FreeForexApi`: Connect to [Free Forex API](https://www.freeforexapi.com/) API.
- `Gemini`: Connect to [Gemini](https://gemini.com) price feeds.
- `Kraken`: Connect to [Kraken](https://kraken.com) price feeds.
- `Kyber`: Connect to [Kyber](https://http://kyber.network) price feeds.
- `OnChainFX`: Connect to [OnchainFX](https://messari.io/screener) API.
- `OpenMarketCap`: Connect to [OpenMarketCap](https://openmarketcap.com) API.
- `Ratesapi`: Connect to [Rate API](http://ratesapi.io) API.
- `Uniswap`: Connect to [Uniswap](https://uniswap.io) price feeds.
- `WorldTradingData`: Connect to [WorldTradingData](https://www.worldtradingdata.com/) API.
