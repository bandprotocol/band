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

type FreeForexApi struct{}

func (*FreeForexApi) Configure(*viper.Viper) {}

func (*FreeForexApi) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	var from, to string
	if len(pairs) == 1 && (pairs[0] == "XAU" || pairs[0] == "XAG") {
		from = "USD"
		to = pairs[0]
	} else if len(pairs) == 2 {
		from = pairs[1]
		to = pairs[0]
	} else {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	key := from + to
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://www.freeforexapi.com/api/live", nil)
	if err != nil {
		return 0, err
	}

	q := req.URL.Query()
	q.Add("pairs", key)
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
	value := gjson.GetBytes(body, "rates."+key+".rate")
	if !value.Exists() {
		return 0, fmt.Errorf("Key doesn't existed")
	}
	return 1 / value.Float(), nil
}

func (a *FreeForexApi) Query(key []byte) Answer {
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
