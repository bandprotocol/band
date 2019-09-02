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

type OnChainFX struct{}

func (*OnChainFX) Configure(*viper.Viper) {}

func getPriceFromOnChainFX(key string) (float64, error) {
	var url strings.Builder
	url.WriteString("https://data.messari.io/api/v1/assets/")
	url.WriteString(strings.ToUpper(key))
	url.WriteString("/metrics")

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

	price := gjson.GetBytes(body, "data.market_data.price_usd")
	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return price.Float(), nil
}

func (*OnChainFX) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	if pairs[0] == "USD" && pairs[1] == "USD" {
		return 1.0, nil
	}

	price0 := 1.0
	if pairs[0] != "USD" {
		price, err := getPriceFromOnChainFX(pairs[0])
		if err != nil {
			return 0, err
		}
		price0 = price
	}

	price1 := 1.0
	if pairs[1] != "USD" {
		price, err := getPriceFromOnChainFX(pairs[1])
		if err != nil {
			return 0, err
		}
		price1 = price
	}

	return price0 / price1, nil
}

func (a *OnChainFX) Query(key []byte) Answer {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return NotFound
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return NotFound
		}
		return Answer{
			Option: "OK",
			Value:  common.BigToHash(PriceToBigInt(value)),
		}
	}
	return NotFound
}
