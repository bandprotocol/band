package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type Coingecko struct{}

var symbolToName = map[string]string{
	"BTC": "bitcoin",
	"ETH": "ethereum",
}

func (*Coingecko) Configure(*viper.Viper) {}

func (*Coingecko) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var srcName string
	if val, ok := symbolToName[strings.ToUpper(pairs[0])]; ok {
		srcName = val
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

func (a *Coingecko) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return common.Hash{}, err
		}
		return common.BigToHash(PriceToBigInt(value)), nil
	}
	return common.Hash{}, fmt.Errorf("Doesn't supported %s query", keys[0])
}
