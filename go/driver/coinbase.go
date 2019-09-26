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

type Coinbase struct{}

type CoinbaseResponse struct {
	Price string `json:"price"`
}

func (*Coinbase) Configure(*viper.Viper) {}

func (*Coinbase) QuerySpotPrice(symbol string) (float64, error) {
	timeoutDuration, _ := time.ParseDuration("3s")
	timeout3SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://api.pro.coinbase.com/products/")
	url.WriteString(strings.ToUpper(symbol))
	url.WriteString("/trades?limit=1")

	response, err := grequests.Get(url.String(), &timeout3SecondOption)
	if err != nil {
		return 0, err
	}
	var result []CoinbaseResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}
	if len(result) == 0 || result[0].Price == "" {
		return 0, fmt.Errorf("Missing key")
	}
	price, err := strconv.ParseFloat(result[0].Price, 64)
	if err != nil {
		return 0, err
	}

	return price, nil
}

func (a *Coinbase) Query(key []byte) dt.Answer {
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
