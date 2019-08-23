package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/tidwall/gjson"
)

var worldTradingDataApikey = os.Getenv("WorldTradingDataApikey")

type WorldTradingData struct{}

func (*WorldTradingData) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 1 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	client := http.Client{}
	req, err := http.NewRequest("GET", "https://api.worldtradingdata.com/api/v1/stock", nil)
	if err != nil {
		return 0, err
	}

	q := req.URL.Query()
	q.Add("symbol", symbol)
	q.Add("api_token", worldTradingDataApikey)
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
	value := gjson.GetManyBytes(body, "symbols_returned", "data.0.price")
	if !value[0].Exists() {
		return 0, fmt.Errorf("Request failed")
	}
	if value[0].Int() != 1 || !value[1].Exists() {
		return 0, fmt.Errorf("Cannot find price for %s stock symbol", symbol)
	}
	return value[1].Float(), nil
}
