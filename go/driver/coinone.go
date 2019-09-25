package driver

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/levigross/grequests"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type Coinone struct{}

type CoinoneResponse struct {
	Last string `json"last"`
}

func (*Coinone) Configure(*viper.Viper) {}

func (*Coinone) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 || pairs[1] != "USD" {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	timeoutDuration, _ := time.ParseDuration("5s")
	timeout5SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	response, err := grequests.Get(
		fmt.Sprintf("https://api.coinone.co.kr/ticker?currency=%s&format=json", pairs[0]),
		&timeout5SecondOption,
	)
	if err != nil {
		return 0, err
	}
	var result CoinoneResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}
	if result.Last == "" {
		return 0, fmt.Errorf("Missing key in response")
	}
	res, err := grequests.Get(
		"https://min-api.cryptocompare.com/data/price?fsym=KRW&tsyms=USD",
		&timeout5SecondOption,
	)
	if err != nil {
		return 0, err
	}
	var output map[string]float64
	if res.JSON(&output) != nil {
		return 0, err
	}

	rawPrice, err := strconv.ParseFloat(result.Last, 64)
	if err != nil {
		return 0, err
	}
	return rawPrice * output["USD"], nil
}

func (a *Coinone) Query(key []byte) dt.Answer {
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
