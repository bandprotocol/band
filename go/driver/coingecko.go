package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type CoinGecko struct{}

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

	var srcName string
	if val, ok := symbolToName[strings.ToUpper(pairs[0])]; ok {
		srcName = val
	} else {
		return 0, fmt.Errorf("key does not exist")
	}

	var url strings.Builder
	url.WriteString("https://api.coingecko.com/api/v3/simple/price?ids=")
	url.WriteString(srcName)
	url.WriteString("&vs_currencies=")
	url.WriteString(strings.ToUpper(pairs[1]))

	var client = &http.Client{}

	res, err := client.Get(url.String())
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}
	price := gjson.GetBytes(body, srcName+".usd")

	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return price.Float(), nil
}

func (a *CoinGecko) Query(key []byte) Answer {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return NotFoundAnswer
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return NotFoundAnswer
		}
		return Answer{
			Option: OK,
			Value:  common.BigToHash(PriceToBigInt(value)),
		}
	}
	return NotFoundAnswer
}
