package driver

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type Uniswap struct{}

func (*Uniswap) Configure(*viper.Viper) {}

func (*Uniswap) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 || pairs[1] != "ETH" {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	url := "https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap"

	data := map[string]string{
		"query": fmt.Sprintf(`
		{
			exchangeHistoricalDatas(
				first: 1
				orderBy: timestamp
				orderDirection: desc
				where: {
					tokenSymbol: "%s"
				}
			) {
				tokenSymbol
				price
			}
		}`, pairs[0]),
	}
	jsonValue, _ := json.Marshal(data)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonValue))
	req.Header.Set("X-Custom-Header", "uniswap_request")
	req.Header.Set("Content-Type", "application/json")

	var client = &http.Client{}

	res, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}

	price := gjson.GetBytes(body, "data.exchangeHistoricalDatas.0.price")

	if !price.Exists() {
		return 0, fmt.Errorf("key does not exist")
	}

	return 1 / price.Float(), nil
}

func (a *Uniswap) Query(key []byte) Answer {
	keys := strings.Split(string(key), "/")
	if len(keys) != 2 {
		return NotFoundAnswer
	}
	if keys[0] == "SPOTPX" {
		value, err := a.QuerySpotPrice(keys[1])
		if err != nil {
			return NotFoundAnswer
		}
		return Answer{
			Option: OK,
			Value:  common.BigToHash(PriceToBigInt(value)),
		}
	}
	return NotFoundAnswer
}
