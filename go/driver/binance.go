package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type Binance struct{}

func (*Binance) Configure(*viper.Viper) {}

func (*Binance) QueryBinancePrice() (float64, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", nil)
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
	price := gjson.GetBytes(body,"price")
	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}
	return price.Float(), nil
}

func (a *Binance) Query(key []byte) dt.Answer {
	value, err := a.QueryBinancePrice()
	if err != nil {
		return dt.NotFoundAnswer
	}
	return dt.Answer{
		Option: dt.Answered,
		Value:  common.BigToHash(PriceToBigInt(value)),
	}
}
