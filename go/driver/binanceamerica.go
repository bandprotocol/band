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

type BinanceAmerica struct{}

func (*BinanceAmerica) Configure(*viper.Viper) {}

func (*BinanceAmerica) QuerySpotPrice(symbol string) (float64, error) {
	timeoutDuration, _ := time.ParseDuration("3s")
	timeout3SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	pairs := strings.Split(strings.ToUpper(symbol), "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	var url strings.Builder
	url.WriteString("https://api.binance.us/api/v1/depth?symbol=")
	url.WriteString(pairs[0])
	url.WriteString(pairs[1])
	url.WriteString("&limit=5")

	response, err := grequests.Get(url.String(), &timeout3SecondOption)
	if err != nil {
		return 0, err
	}
	var result BinanceResponse
	response.JSON(&result)
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
	return (bid + ask) / 2, nil
}

func (a *BinanceAmerica) Query(key []byte) dt.Answer {
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
