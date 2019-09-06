package driver

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

var currencyConverterapikey = os.Getenv("CurrencyConverterApikey")
var currencyConverterCaches = make(map[string]float64)
var lastUpdated int64

type CurrencyConverter struct{}

func updateCache() error {
	symbols := ""
	for k := range currencyConverterCaches {
		symbols += k + ","
	}
	symbols = symbols[:len(symbols)-1]

	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://free.currconv.com/api/v7/convert", nil)
	if err != nil {
		return err
	}
	q := req.URL.Query()
	q.Add("q", symbols)
	q.Add("compact", "ultra")
	q.Add("apiKey", currencyConverterapikey)
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Accept", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(res.Body).Decode(&result)

	for k := range currencyConverterCaches {
		if val, ok := result[k]; ok {
			currencyConverterCaches[k] = val.(float64)
		} else {
			delete(currencyConverterCaches, k)
		}
	}
	lastUpdated = time.Now().Unix()
	return nil
}

func (*CurrencyConverter) Configure(config *viper.Viper) {
	currencyConverterapikey = config.GetString("apikey")
}

func (*CurrencyConverter) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	var from, to string
	if len(pairs) == 1 && (pairs[0] == "XAU" || pairs[0] == "XAG") {
		from = pairs[0]
		to = "USD"
	} else if len(pairs) == 2 {
		from = pairs[0]
		to = pairs[1]
	} else {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	key := from + "_" + to
	var err error
	if _, ok := currencyConverterCaches[key]; ok {
		if lastUpdated == 0 || time.Now().Unix()-lastUpdated > 60 {
			err = updateCache()
		}
	} else {
		currencyConverterCaches[key] = 0
		err = updateCache()
	}
	if err != nil {
		return 0, err
	}
	if _, ok := currencyConverterCaches[key]; ok {
		return currencyConverterCaches[key], nil
	}
	return 0, fmt.Errorf("Invalid key")
}

func (a *CurrencyConverter) Query(key []byte) dt.Answer {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return dt.NotFoundAnswer
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return dt.NotFoundAnswer
		}
		return dt.Answer{
			Option: dt.Answered,
			Value:  common.BigToHash(PriceToBigInt(value)),
		}
	}
	return dt.NotFoundAnswer
}
