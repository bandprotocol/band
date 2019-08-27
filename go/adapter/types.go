package adapter

import (
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type Adapter interface {
	Configure(*viper.Viper)
	Query([]byte) (common.Hash, error)
}

func FromConfig(config *viper.Viper) map[common.Address]Adapter {
	output := make(map[common.Address]Adapter)
	adapters := config.GetStringMap("adapters")
	for datasetHex, _ := range adapters {
		dataset := common.HexToAddress(datasetHex)
		output[dataset] = FromConfigIndividual(config.Sub("adapters." + datasetHex))
	}
	return output
}

func FromConfigIndividual(config *viper.Viper) Adapter {
	name := config.GetString("name")
	if name == "" {
		panic("adapter.FromConfig: missing adapter name")
	}

	var adpt Adapter
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
	default:
		panic(fmt.Sprintf("adapter.FromConfig: unknown adapter name %s", name))
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
