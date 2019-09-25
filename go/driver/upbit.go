package driver

import (
	"fmt"
	"strings"
	"time"

	"github.com/levigross/grequests"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type UpbitResponse struct {
	TradePrice float64 `json:"trade_price"`
}

type Upbit struct{}

func (*Upbit) Configure(*viper.Viper) {}

func (*Upbit) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	needConvert := false
	if pairs[1] == "USD" {
		pairs[1] = "KRW"
		needConvert = true
	}
	timeoutDuration, _ := time.ParseDuration("5s")
	timeout5SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}
	response, err := grequests.Get(
		fmt.Sprintf("https://api.upbit.com/v1/ticker?markets=%s-%s", pairs[1], pairs[0]),
		&timeout5SecondOption,
	)
	if err != nil {
		return 0, err
	}
	var result []UpbitResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}
	rawPrice := result[0].TradePrice
	if needConvert {
		res, err := grequests.Get(
			"https://min-api.cryptocompare.com/data/price?fsym=KRW&tsyms=USD",
			&timeout5SecondOption,
		)
		if err != nil {
			return 0, err
		}
		var output map[string]float64
		res.JSON(&output)
		rawPrice = rawPrice * output["USD"]
	}
	return rawPrice, nil
}

func (a *Upbit) Query(key []byte) dt.Answer {
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
