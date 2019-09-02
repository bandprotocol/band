package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type ValueWithLastUpdated struct {
	value       float64
	lastUpdated int64
}

var alphaVantageForexApikey = os.Getenv("AlphaVantageForexApikey")
var alphaVantageForexCaches = make(map[string]ValueWithLastUpdated)

type AlphaVantageForex struct{}

func queryValue(from string, to string) error {
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://www.alphavantage.co/query", nil)
	if err != nil {
		return err
	}

	q := req.URL.Query()
	q.Add("function", "CURRENCY_EXCHANGE_RATE")
	q.Add("from_currency", from)
	q.Add("to_currency", to)
	q.Add("apikey", alphaVantageForexApikey)
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Accept", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}
	value := gjson.GetBytes(body, "Realtime Currency Exchange Rate.5\\. Exchange Rate")
	if !value.Exists() {
		return fmt.Errorf("Key doesn't existed")
	}

	var temp ValueWithLastUpdated
	temp.value = value.Float()
	temp.lastUpdated = time.Now().Unix()
	alphaVantageForexCaches[from+"-"+to] = temp

	return nil
}

func (*AlphaVantageForex) Configure(config *viper.Viper) {
	alphaVantageForexApikey = config.GetString("apikey")
}

func (*AlphaVantageForex) QuerySpotPrice(symbol string) (float64, error) {
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

	var err error
	if _, ok := alphaVantageForexCaches[symbol]; ok {
		if lastUpdated == 0 || time.Now().Unix()-alphaVantageForexCaches[symbol].lastUpdated > 1200 {
			err = queryValue(from, to)
		}
	} else {
		err = queryValue(from, to)
	}

	if err != nil {
		return 0, err
	}
	if _, ok := alphaVantageForexCaches[from+"-"+to]; ok {
		return alphaVantageForexCaches[from+"-"+to].value, nil
	}
	return 0, fmt.Errorf("Invalid key")
}

func (a *AlphaVantageForex) Query(key []byte) (common.Hash, error) {
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
