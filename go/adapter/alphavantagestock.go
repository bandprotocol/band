package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/tidwall/gjson"
)

type ValueWithLastUpdated struct {
	value       float64
	lastUpdated int64
}

var alphaVantageStockApikey = os.Getenv("AlphaVantageStockApikey")
var alphaVantageStockCaches = make(map[string]ValueWithLastUpdated)

type AlphaVantageStock struct{}

func queryValue(from string) error {
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://www.alphavantage.co/query", nil)
	if err != nil {
		return err
	}

	q := req.URL.Query()
	q.Add("function", "GLOBAL_QUOTE")
	q.Add("symbol", from)
	q.Add("apikey", alphaVantageStockApikey)
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
	value := gjson.GetBytes(body, "Global Quote.05\\. price")
	if !value.Exists() {
		return fmt.Errorf("Key doesn't existed")
	}

	var temp ValueWithLastUpdated
	temp.value = value.Float()
	temp.lastUpdated = time.Now().Unix()
	alphaVantageStockCaches[from] = temp

	return nil
}

func (*AlphaVantageStock) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 1 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var err error
	if _, ok := alphaVantageStockCaches[symbol]; ok {
		if lastUpdated == 0 || time.Now().Unix()-alphaVantageStockCaches[symbol].lastUpdated > 1200 {
			err = queryValue(symbol)
		}
	} else {
		err = queryValue(symbol)
	}

	if err != nil {
		return 0, err
	}
	if _, ok := alphaVantageStockCaches[symbol]; ok {
		return alphaVantageStockCaches[symbol].value, nil
	}
	return 0, fmt.Errorf("Invalid key")
}
