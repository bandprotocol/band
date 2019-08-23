package adapter

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/tidwall/gjson"
)

type Kyber struct{}

var tokenNameToAddress = map[string]string{
	"ETH":  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	"MKR":  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
	"BAT":  "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
	"USDC": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
	"OMG":  "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
	"ZRX":  "0xe41d2489571d322189246dafa5ebde1f4699f498",
	"DAI":  "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
	"REP":  "0x1985365e9f78359a9b6ad760e32412f4a445e862",
	"KNC":  "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
	"LINK": "0x514910771af9ca656af840dff83e8264ecf986ca",
}

func Kyber_Token2ETH(singleSymbol string) (float64, error) {
	var url strings.Builder
	url.WriteString("https://tracker.kyber.network/api/trades?limit=100&page=0&address=")
	url.WriteString(tokenNameToAddress[strings.ToUpper(singleSymbol)])
	url.WriteString("&official=true")

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
	data := gjson.GetBytes(body, "data").Array()
	for _, val := range data {
		each := val.Map()

		taker_token := each["takerTokenSymbol"].String()
		taker_amount := each["takerTokenAmount"].Float()
		maker_token := each["makerTokenSymbol"].String()
		maker_amount := each["makerTokenAmount"].Float()

		power := 1.0
		if singleSymbol == "USDC" {
			power = 1e-12
		}
		var ans = 0.0
		if taker_token == "ETH" {
			ans = (float64(taker_amount) * power) / float64(maker_amount)
		} else if maker_token == "ETH" {
			ans = (float64(maker_amount) * power) / float64(taker_amount)
		} else {
			continue
		}

		return ans, nil
	}
	return 0, fmt.Errorf("Token '%s' not found in 100 block", singleSymbol)
}

func (*Kyber) QuerySpotPrice(symbol string) (float64, error) {
	pairs := strings.Split(symbol, "-")
	if len(pairs) != 2 {
		return 0, fmt.Errorf("spotpx: symbol %s is not valid", symbol)
	}

	for _, t := range pairs {
		if _, ok := tokenNameToAddress[strings.ToUpper(t)]; !ok {
			return 0, fmt.Errorf("Kyber does not support this key %s", t)
		}
	}

	if pairs[0] != "ETH" && pairs[1] == "ETH" {
		price, err := Kyber_Token2ETH(pairs[0])
		if err != nil {
			return 0, err
		}
		return price, nil
	} else if pairs[0] == "ETH" && pairs[1] != "ETH" {
		price, err := Kyber_Token2ETH(pairs[1])
		if err != nil {
			return 0, err
		}
		return 1.0 / price, nil
	} else if pairs[0] != "ETH" && pairs[1] != "ETH" {
		price0, err := Kyber_Token2ETH(pairs[0])
		if err != nil {
			return 0, err
		}
		price1, err := Kyber_Token2ETH(pairs[1])
		if err != nil {
			return 0, err
		}
		return price0 / price1, nil
	}

	return 1.0, nil
}

func (a *Kyber) Query(key []byte) (common.Hash, error) {
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
