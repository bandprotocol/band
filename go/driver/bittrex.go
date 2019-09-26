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

type Bittrex struct{}

type BittrexResponse struct {
	Result struct {
		Last float64 `json:"Last`
	} `json:"result"`
}

func (*Bittrex) Configure(*viper.Viper) {}

func (*Bittrex) QuerySpotPrice(symbol string) (float64, error) {
	timeoutDuration, _ := time.ParseDuration("3s")
	timeout3SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://api.bittrex.com/api/v1.1/public/getticker?market=")
	url.WriteString(strings.ToUpper(pairs[1]))
	url.WriteString("-")
	url.WriteString(strings.ToUpper(pairs[0]))

	response, err := grequests.Get(url.String(), &timeout3SecondOption)
	if err != nil {
		return 0, err
	}
	var result BittrexResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}
	if result.Result.Last == 0 {
		return 0, fmt.Errorf("Invalid response")
	}

	return result.Result.Last, nil
}

func (a *Bittrex) Query(key []byte) dt.Answer {
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
