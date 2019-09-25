package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type BinanceAmerica struct{}

func (*BinanceAmerica) Configure(*viper.Viper) {}

func (*BinanceAmerica) QuerySpotPrice(symbol string) (float64, error) {
	client := &http.Client{}

	pairs := strings.Split(strings.ToUpper(symbol), "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}
	var url strings.Builder
	url.WriteString("https://api.binance.us/api/v1/depth?symbol=")
	url.WriteString(pairs[0])
	url.WriteString(pairs[1])
	url.WriteString("&limit=5")

	req, err := http.NewRequest("GET", url.String(), nil)
	if err != nil {
		return 0, err
	}
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
	prices := gjson.GetManyBytes(body, "bids.0.0", "asks.0.0")
	if !prices[0].Exists() || !prices[1].Exists() {
		return 0, fmt.Errorf("key does not exist")
	}
	return (prices[0].Float() + prices[1].Float()) / 2, nil
}

func (a *BinanceAmerica) Query(key []byte) dt.Answer {
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
