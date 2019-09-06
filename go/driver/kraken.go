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

type Kraken struct{}

var tokenMap = map[string]string{
	"ETH": "XETH",
	"LTC": "XLTC",
	"XRP": "XXRP",
	"USD": "ZUSD",
}

func (*Kraken) Configure(*viper.Viper) {}

func (*Kraken) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	if pairs[0] == "BCH" || pairs[1] == "BCH" {
		pairs[0] = "BCH"
		pairs[1] = "USD"
	}

	if val, ok := tokenMap[pairs[0]]; ok {
		pairs[0] = val
	}
	if val, ok := tokenMap[pairs[1]]; ok {
		pairs[1] = val
	}

	var url strings.Builder
	url.WriteString("https://api.kraken.com/0/public/Trades?pair=")
	url.WriteString(pairs[0])
	url.WriteString(pairs[1])

	var client = &http.Client{}

	res, err := client.Get(url.String())
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}

	arr := gjson.GetBytes(body, fmt.Sprintf("result.%s%s", pairs[0], pairs[1])).Array()
	if len(arr) == 0 {
		return 0, fmt.Errorf("key does not exist")
	}

	lastElement := arr[len(arr)-1].Array()
	if len(lastElement) == 0 {
		return 0, fmt.Errorf("key does not exist")
	}

	if !lastElement[0].Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return lastElement[0].Float(), nil
}

func (a *Kraken) Query(key []byte) dt.Answer {
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
