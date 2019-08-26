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
	case "Coinbase":
		adpt = &CoinBase{}
	case "Gemini":
		adpt = &Gemini{}
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
