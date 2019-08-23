package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/tidwall/gjson"
)

type CoinMarketcap struct{}

func (*CoinMarketcap) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	var url strings.Builder
	url.WriteString("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=")
	url.WriteString(strings.ToUpper(pairs[0]))
	url.WriteString("&convert=")
	url.WriteString(strings.ToUpper(pairs[1]))

	client := &http.Client{}
	req, err := http.NewRequest("GET", url.String(), nil)
	if err != nil {
		return 0, err
	}
	req.Header.Add("X-CMC_PRO_API_KEY", os.Getenv("X-CMC_PRO_API_KEY"))
	res, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}

	result := gjson.GetManyBytes(body, fmt.Sprintf("data.%s.quote.%s.price", pairs[0], pairs[1]), "status.error_code", "status.error_message")

	if !result[0].Exists() {
		if result[1].Exists() {
			return 0, fmt.Errorf(result[2].String())
		}
		return 0, fmt.Errorf("key does not exist")
	}

	return result[0].Float(), nil
}

func (a *CoinMarketcap) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return common.HexToHash("0"), fmt.Errorf("Invalid key format")
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return common.HexToHash("0"), err
		}
		return common.BigToHash(PriceToBigInt(value)), nil
	}
	return common.HexToHash("0"), fmt.Errorf("Doesn't supported %s query", keys[0])
}
