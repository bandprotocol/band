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

type Binance struct{}

type BinanceResponse struct {
	Bids [][]string `json:bids`
	Asks [][]string `json:asks`
}

func (*Binance) Configure(*viper.Viper) {}

func (*Binance) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	timeoutDuration, _ := time.ParseDuration("3s")
	timeout3SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	if pairs[1] == "USD" {
		pairs[1] = "USDT"

	}
	response, err := grequests.Get(
		fmt.Sprintf("https://api.binance.com/api/v1/depth?symbol=%s%s&limit=5", pairs[0], pairs[1]),
		&timeout3SecondOption,
	)
	if err != nil {
		return 0, err
	}
	var result BinanceResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}
	if len(result.Bids) == 0 || len(result.Asks) == 0 {
		return 0, fmt.Errorf("Missing key")
	}
	bid, err := strconv.ParseFloat(result.Bids[0][0], 64)
	if err != nil {
		return 0, err
	}
	ask, err := strconv.ParseFloat(result.Asks[0][0], 64)
	if err != nil {
		return 0, err
	}
	rawPrice := (bid + ask) / 2
	return rawPrice, nil
}

func (a *Binance) Query(key []byte) dt.Answer {
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
