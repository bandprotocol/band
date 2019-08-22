package adapter

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

var apikey = os.Getenv("CurrencyConverterApikey")
var caches = make(map[string]float64)
var lastUpdated int64

type CurrencyConverter struct{}

func updateCache() error {
	symbols := ""
	for k := range caches {
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
	q.Add("apiKey", apikey)
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Accept", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(res.Body).Decode(&result)

	for k := range caches {
		if val, ok := result[k]; ok {
			caches[k] = val.(float64)
		} else {
			delete(caches, k)
		}
	}
	lastUpdated = time.Now().Unix()
	return nil
}

func (*CurrencyConverter) QuerySpotPrice(symbol string) (float64, error) {
	splitKey := strings.Split(symbol, "-")
	if len(splitKey) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	key := splitKey[1] + "_" + splitKey[0]
	var err error
	if _, ok := caches[key]; ok {
		if lastUpdated == 0 || time.Now().Unix()-lastUpdated > 60 {
			err = updateCache()
		}
	} else {
		caches[key] = 0
		err = updateCache()
	}
	if err != nil {
		return 0, err
	}
	if _, ok := caches[key]; ok {
		return caches[key], nil
	}
	return 0, fmt.Errorf("Invalid key")

}
