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
	case "AggMedian":
		adpt = &AggMedian{}
	case "Bittrex":
		adpt = &Bittrex{}
	case "CryptoCompare":
		adpt = &CryptoCompare{}
	case "Gemini":
		adpt = &Gemini{}
	case "Coinbase":
		adpt = &Coinbase{}
	case "CoinMarketCap":
		adpt = &CoinMarketCap{}
	case "Kraken":
		adpt = &Kraken{}
	case "Bitfinex":
		adpt = &Bitfinex{}
	case "CoinGecko":
		adpt = &CoinGecko{}
	case "BinanceAmerica":
		adpt = &BinanceAmerica{}
	case "Binance":
		adpt = &Binance{}
	case "Huobi":
		adpt = &Huobi{}
	case "Upbit":
		adpt = &Upbit{}
	case "Coinone":
		adpt = &Coinone{}
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
