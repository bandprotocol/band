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

type Ratesapi struct{}

func (*Ratesapi) Configure(*viper.Viper) {}

func (*Ratesapi) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://api.ratesapi.io/api/latest", nil)
	if err != nil {
		return 0, err
	}

	q := req.URL.Query()
	q.Add("base", pairs[0])
	q.Add("symbols", pairs[1])
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Accept", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return 0, err
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}
	value := gjson.GetBytes(body, "rates."+pairs[1])
	if !value.Exists() {
		return 0, fmt.Errorf("Key doesn't existed")
	}
	return value.Float(), nil
}

func (a *Ratesapi) Query(key []byte) Answer {
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
