package driver

import (
	"fmt"
	"strings"
	"time"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/levigross/grequests"
	"github.com/spf13/viper"
)

type Bitfinex struct{}

type BitfinexResponse [][]float64

func (*Bitfinex) Configure(*viper.Viper) {}

func (*Bitfinex) QuerySpotPrice(symbol string) (float64, error) {
	timeoutDuration, _ := time.ParseDuration("3s")
	timeout3SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://api-pub.bitfinex.com/v2/trades/t")
	url.WriteString(strings.ToUpper(strings.Replace(pairs[0], "BCH", "BAB", 1)))
	url.WriteString(strings.ToUpper(strings.Replace(pairs[1], "BCH", "BAB", 1)))
	url.WriteString("/hist?limit=1")

	response, err := grequests.Get(url.String(), &timeout3SecondOption)
	if err != nil {
		return 0, err
	}

	var result BitfinexResponse
	err = response.JSON(&result)
	if len(result) == 0 || len(result[0]) < 4 {
		return 0, fmt.Errorf("Invalid response")
	}

	return result[0][3], nil
}

func (a *Bitfinex) Query(key []byte) dt.Answer {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return dt.NotFoundAnswer
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return dt.NotFoundAnswer
		}
		return dt.Answer{
			Option: dt.Answered,
			Value:  common.BigToHash(PriceToBigInt(value)),
		}
	}
	return dt.NotFoundAnswer
}
