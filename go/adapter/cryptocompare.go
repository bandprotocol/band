package adapter

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type CryptoCompare struct{}

func (*CryptoCompare) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://min-api.cryptocompare.com/data/price", nil)
	if err != nil {
		return 0, err
	}
	q := req.URL.Query()
	q.Add("fsym", pairs[0])
	q.Add("tsyms", pairs[1])
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Accept", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(res.Body).Decode(&result)
	price, ok := result[pairs[1]].(float64)
	if !ok {
		return 0, fmt.Errorf("spotpx: invalid response from remote %s", result[pairs[1]])
	}
	return price, nil
}
