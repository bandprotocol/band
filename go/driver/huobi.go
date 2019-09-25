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

type Huobi struct{}

type HuobiResponse struct {
	Tick struct {
		Ask []float64 `json:ask`
		Bid []float64 `json:bid`
	} `json:"tick`
}

func (*Huobi) Configure(*viper.Viper) {}

func (*Huobi) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(strings.ToLower(symbol), "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	needConvert := false
	if pairs[1] == "usd" {
		pairs[1] = "usdt"
		needConvert = true
	}
	timeoutDuration, _ := time.ParseDuration("5s")
	timeout5SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	response, err := grequests.Get(
		fmt.Sprintf("https://api.huobi.pro/market/detail/merged?symbol=%s%s", pairs[0], pairs[1]),
		&timeout5SecondOption,
	)

	if err != nil {
		return 0, err
	}
	var result HuobiResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}
	if len(result.Tick.Ask) == 0 || len(result.Tick.Bid) == 0 {
		return 0, fmt.Errorf("Missing ask and bid field")
	}
	rawPrice := (result.Tick.Ask[0] + result.Tick.Bid[0]) / 2
	if needConvert {
		res, err := grequests.Get(
			"https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=USD",
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

func (a *Huobi) Query(key []byte) dt.Answer {
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
