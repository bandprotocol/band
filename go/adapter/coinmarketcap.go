package adapter

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

var coinMarketCapApikey = os.Getenv("CoinMarketCapApikey")
var coinMarketCapCache = make(map[string]float64)
var coinMarketCapLastUpdated int64
var symbols string

type CoinMarketCap struct{}

func (*CoinMarketCap) Configure(config *viper.Viper) {
	if config.GetString("apikey") != "" {
		coinMarketCapApikey = config.GetString("apikey")
	}
	tokenList := []string{"BCH", "BTC", "ETH", "LTC", "XRP", "BAT", "DAI", "KNC", "LINK", "MKR", "OMG", "REP", "USDC", "ZRX"}
	for _, token := range tokenList {
		coinMarketCapCache[token] = 0
	}
	symbols = strings.Join(tokenList, ",")
}

func (*CoinMarketCap) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	if _, ok := coinMarketCapCache[pairs[0]]; !ok {
		return 0, fmt.Errorf("spotpx: symbol %s[%s] is not supported", symbol, pairs[0])
	}

	if _, ok := coinMarketCapCache[pairs[1]]; !ok && pairs[1] != "USD" {
		return 0, fmt.Errorf("spotpx: symbol %s[%s] is not supported", symbol, pairs[1])
	}

	if time.Now().Unix()-coinMarketCapLastUpdated >= 300 {
		var url strings.Builder
		url.WriteString("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=")
		url.WriteString(symbols)
		url.WriteString("&convert=USD")

		client := &http.Client{}
		req, err := http.NewRequest("GET", url.String(), nil)
		if err != nil {
			return 0, err
		}
		req.Header.Add("X-CMC_PRO_API_KEY", coinMarketCapApikey)
		res, err := client.Do(req)
		if err != nil {
			return 0, err
		}
		defer res.Body.Close()

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			return 0, err
		}

		tokenList := strings.Split(symbols, ",")
		keys := []string{"status.error_code", "status.error_message"}
		for _, token := range tokenList {
			keys = append(keys, fmt.Sprintf("data.%s.quote.USD.price", token))
		}

		result := gjson.GetManyBytes(body, keys...)

		if result[0].Exists() && result[0].Int() != 0 {
			return 0, fmt.Errorf("%s", result[1].String())
		}

		for i, token := range tokenList {
			coinMarketCapCache[token] = result[i+2].Float()
		}
		coinMarketCapLastUpdated = time.Now().Unix()
	}

	divisor := 1.0
	if pairs[1] != "USD" {
		divisor = coinMarketCapCache[pairs[1]]
	}

	return coinMarketCapCache[pairs[0]] / divisor, nil
}

func (a *CoinMarketCap) Query(key []byte) (common.Hash, error) {
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
