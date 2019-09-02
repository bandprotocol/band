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

type OpenMarketCap struct{}

func (*OpenMarketCap) Configure(*viper.Viper) {}

func (*OpenMarketCap) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(strings.ToUpper(symbol), "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var client = &http.Client{}

	res, err := client.Get("http://api.openmarketcap.com/api/v1/tokens?size=600")
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}
	data := gjson.GetBytes(body, "data").Array()

	if len(data) == 0 {
		return 0, fmt.Errorf("No data point found")
	}

	prices := map[string]float64{}
	for _, e := range data {
		each := e.Map()
		eachSymbol := each["symbol"].String()
		if eachSymbol == pairs[0] || eachSymbol == pairs[1] {
			if _, ok := prices[eachSymbol]; !ok {
				prices[eachSymbol] = each["price_usd"].Float()
			}
		}
	}

	if _, ok := prices[pairs[0]]; !ok {
		return 0, fmt.Errorf("key %s does not exist", pairs[0])
	}

	if pairs[1] == "USD" {
		return prices[pairs[0]], nil
	}

	if _, ok := prices[pairs[1]]; !ok {
		return 0, fmt.Errorf("key %s does not exist", pairs[1])
	}

	return prices[pairs[0]] / prices[pairs[1]], nil
}

func (a *OpenMarketCap) Query(key []byte) Answer {
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
