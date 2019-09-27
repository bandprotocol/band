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

type CoinGecko struct{}

type CoinGeckoResponse map[string]interface{}

var symbolToName = map[string]string{
	"BTC": "bitcoin",
	"ETH": "ethereum",
}

func (*CoinGecko) Configure(*viper.Viper) {}

func (*CoinGecko) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	timeoutDuration, _ := time.ParseDuration("3s")
	timeout3SecondOption := grequests.RequestOptions{RequestTimeout: timeoutDuration}

	var srcName string
	if val, ok := symbolToName[strings.ToUpper(pairs[0])]; ok {
		srcName = val
	} else {
		return 0, fmt.Errorf("QuerySpotPrice: key does not exist")
	}

	var url strings.Builder
	url.WriteString("https://api.coingecko.com/api/v3/simple/price?ids=")
	url.WriteString(srcName)
	url.WriteString("&vs_currencies=")
	url.WriteString(strings.ToUpper(pairs[1]))

	response, err := grequests.Get(url.String(), &timeout3SecondOption)
	if err != nil {
		return 0, err
	}
	var result CoinGeckoResponse
	err = response.JSON(&result)
	if err != nil {
		return 0, err
	}

	return result[srcName].(map[string]interface{})[strings.ToLower(pairs[1])].(float64), nil
}

func (a *CoinGecko) Query(key []byte) dt.Answer {
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
