package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/tidwall/gjson"
)

type Bitstamp struct{}

func (*Bitstamp) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(strings.ToUpper(symbol), "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://www.bitstamp.net/api/v2/ticker/")
	url.WriteString(pairs[0])
	url.WriteString(pairs[1])
	url.WriteString("/")

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
	price := gjson.GetBytes(body, "last")

	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return price.Float(), nil
}

func (a *Bitstamp) Query(key []byte) (common.Hash, error) {
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
