package driver

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type Driver interface {
	Configure(*viper.Viper)
	Query([]byte) Answer
}

type AnswerOption uint8

const (
	NotFound AnswerOption = iota
	OK
	Delegated
)

func (o AnswerOption) String() string {
	return toString[o]
}

var toString = map[AnswerOption]string{
	NotFound:  "Not found",
	OK:        "OK",
	Delegated: "Delegated",
}

var toID = map[string]AnswerOption{
	"Not found": NotFound,
	"OK":        OK,
	"Delegated": Delegated,
}

// MarshalJSON marshals the enum as a quoted json string
func (o AnswerOption) MarshalJSON() ([]byte, error) {
	buffer := bytes.NewBufferString(`"`)
	buffer.WriteString(toString[o])
	buffer.WriteString(`"`)
	return buffer.Bytes(), nil
}

// UnmarshalJSON unmashals a quoted json string to the enum value
func (o *AnswerOption) UnmarshalJSON(b []byte) error {
	var j string
	err := json.Unmarshal(b, &j)
	if err != nil {
		return err
	}
	// Note that if the string cannot be found then it will be set to the zero value, 'Created' in this case.
	*o = toID[j]
	return nil
}

type Answer struct {
	Option AnswerOption `json:"option"`
	Value  common.Hash  `json:"value"`
}

var NotFoundAnswer = Answer{
	Option: NotFound,
	Value:  common.Hash{},
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
	case "RegEx":
		adpt = &RegEx{}
	case "AggMedian":
		adpt = &AggMedian{}
	case "IdleDriver":
		adpt = &IdleDriver{}
	case "DelegateDriver":
		adpt = &DelegateDriver{}
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
