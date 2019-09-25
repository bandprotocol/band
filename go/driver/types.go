package driver

import (
	"fmt"
	"math/big"

	"github.com/bandprotocol/band/go/dt"
	"github.com/spf13/viper"
)

type Driver interface {
	Configure(*viper.Viper)
	Query([]byte) dt.Answer
}

func FromConfig(config *viper.Viper) Driver {
	return FromConfigIndividual(config.Sub("driver"))
}

func FromConfigIndividual(config *viper.Viper) Driver {
	name := config.GetString("name")
	if name == "" {
		panic("driver.FromConfig: missing driver name")
	}

	var adpt Driver
	switch name {
	case "RegEx":
		adpt = &RegEx{}
	case "AggMedian":
		adpt = &AggMedian{}
	case "AggMajority":
		adpt = &AggMajority{}
	case "IdleDriver":
		adpt = &IdleDriver{}
	case "DelegateDriver":
		adpt = &DelegateDriver{}
	case "WebRequest":
		adpt = &WebRequest{}
	case "AlphaVantageStock":
		adpt = &AlphaVantageStock{}
	case "WorldTradingData":
		adpt = &WorldTradingData{}
	case "Bittrex":
		adpt = &Bittrex{}
	case "Kyber":
		adpt = &Kyber{}
	case "CryptoCompare":
		adpt = &CryptoCompare{}
	case "Ratesapi":
		adpt = &Ratesapi{}
	case "Bitstamp":
		adpt = &Bitstamp{}
	case "Gemini":
		adpt = &Gemini{}
	case "FinancialModelPrep":
		adpt = &FinancialModelPrep{}
	case "Coinbase":
		adpt = &Coinbase{}
	case "OpenMarketCap":
		adpt = &OpenMarketCap{}
	case "FreeForexApi":
		adpt = &FreeForexApi{}
	case "CurrencyConverter":
		adpt = &CurrencyConverter{}
	case "CoinMarketCap":
		adpt = &CoinMarketCap{}
	case "Kraken":
		adpt = &Kraken{}
	case "OnChainFX":
		adpt = &OnChainFX{}
	case "Bitfinex":
		adpt = &Bitfinex{}
	case "Uniswap":
		adpt = &Uniswap{}
	case "Bancor":
		adpt = &Bancor{}
	case "AlphaVantageForex":
		adpt = &AlphaVantageForex{}
	case "PriceHttp":
		adpt = &PriceHttp{}
	case "CoinGecko":
		adpt = &CoinGecko{}
	case "BinanceAmerica":
		adpt = &BinanceAmerica{}
	case "Binance":
		adpt = &Binance{}
	case "EplEspn":
		adpt = &EplEspn{}
	case "EplSport":
		adpt = &EplSport{}
	case "NbaEspn":
		adpt = &NbaEspn{}
	case "DataNba":
		adpt = &DataNba{}
	case "MlbEspn":
		adpt = &MlbEspn{}
	case "NflEspn":
		adpt = &NflEspn{}
	default:
		panic(fmt.Sprintf("driver.FromConfig: unknown driver name %s", name))
	}

	adpt.Configure(config)
	return adpt
}

func PriceToBigInt(price float64) *big.Int {
	bigval := new(big.Float)
	bigval.SetFloat64(price)

	multiplier := new(big.Float)
	multiplier.SetInt(big.NewInt(100))
	bigval.Mul(bigval, multiplier)

	result := new(big.Int)
	bigval.Int(result)

	return result.Mul(result, big.NewInt(10000000000000000))
}
