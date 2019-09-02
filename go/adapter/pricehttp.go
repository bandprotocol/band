package driver

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type PriceHttp struct {
	Endpoint string
	Method   string
}

func getResult(res *http.Response) (float64, error) {
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}

	result := gjson.GetManyBytes(body, "price", "error")

	if !result[0].Exists() {
		if result[1].Exists() {
			return 0, fmt.Errorf("%s", result[1].String())
		}
		return 0, fmt.Errorf("Error with unknown reason")
	}
	return result[0].Float(), nil
}

func (a *PriceHttp) Configure(config *viper.Viper) {
	a.Endpoint = config.GetString("endpoint")
	a.Method = strings.ToUpper(config.GetString("method"))
}

func (a *PriceHttp) QuerySpotPrice(symbol string) (float64, error) {
	client := &http.Client{}

	switch a.Method {
	case "GET":
		{
			req, err := http.NewRequest("GET", a.Endpoint, nil)
			if err != nil {
				return 0, err
			}

			q := req.URL.Query()
			q.Add("type", "SPOTPX")
			q.Add("symbol", symbol)
			req.URL.RawQuery = q.Encode()
			req.Header.Add("Accept", "application/json")
			res, err := client.Do(req)
			if err != nil {
				return 0, err
			}
			defer res.Body.Close()
			return getResult(res)
		}
	case "POST":
		{
			values := map[string]string{"symbol": symbol, "type": "SPOTPX"}
			jsonValue, _ := json.Marshal(values)
			res, err := http.Post(a.Endpoint, "application/json", bytes.NewBuffer(jsonValue))
			if err != nil {
				return 0, err
			}
			defer res.Body.Close()
			return getResult(res)
		}
	default:
		{
			return 0, fmt.Errorf("Method type doesn't supported")
		}
	}
}

func (a *PriceHttp) Query(key []byte) (common.Hash, error) {
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
