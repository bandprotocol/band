package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/tidwall/gjson"
)

type CoinBase struct{}

func (*CoinBase) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://api.pro.coinbase.com/products/")
	url.WriteString(strings.ToUpper(symbol))
	url.WriteString("/trades")

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
	price := gjson.GetBytes(body, "0.price")

	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return price.Float(), nil
}
