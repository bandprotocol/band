package driver

import (
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type Driver interface {
	Configure(*viper.Viper)
	Query([]byte) (common.Hash, error)
}

func FromConfig(config *viper.Viper) map[common.Address]Driver {
	output := make(map[common.Address]Driver)
	drivers := config.GetStringMap("drivers")
	for datasetHex, _ := range drivers {
		dataset := common.HexToAddress(datasetHex)
		output[dataset] = FromConfigIndividual(config.Sub("drivers." + datasetHex))
	}
	return output
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
	case "CoinBase":
		adpt = &CoinBase{}
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
	multiplier.SetInt(big.NewInt(1000000000000000000))
	bigval.Mul(bigval, multiplier)

	result := new(big.Int)
	bigval.Int(result)

	return result
}
