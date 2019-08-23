package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/tidwall/gjson"
)

type Bitfinex struct{}

func (*Bitfinex) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://api-pub.bitfinex.com/v2/trades/t")
	url.WriteString(strings.ToUpper(strings.Replace(pairs[0], "BCH", "BAB", 1)))
	url.WriteString(strings.ToUpper(strings.Replace(pairs[1], "BCH", "BAB", 1)))
	url.WriteString("/hist")

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

	price := gjson.GetBytes(body, "0.3")

	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return price.Float(), nil
}

func (a *Bitfinex) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return common.HexToHash("0"), fmt.Errorf("Invalid key format")
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return common.HexToHash("0"), err
		}
		return common.BigToHash(PriceToBigInt(value)), nil
	}
	return common.HexToHash("0"), fmt.Errorf("Doesn't supported %s query", keys[0])
}
