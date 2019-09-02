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

type FinancialModelPrep struct{}

func (*FinancialModelPrep) Configure(*viper.Viper) {}

func (*FinancialModelPrep) QuerySpotPrice(symbol string) (float64, error) {
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://financialmodelingprep.com/api/company/price/"+symbol, nil)
	if err != nil {
		return 0, err
	}

	q := req.URL.Query()
	q.Add("datatype", "json")
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
	value := gjson.GetBytes(body, symbol+".price")
	if !value.Exists() {
		return 0, fmt.Errorf("Key doesn't existed")
	}
	return value.Float(), nil
}

func (a *FinancialModelPrep) Query(key []byte) Answer {
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
