package driver

import (
	"encoding/hex"
	"io/ioutil"
	"math/big"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"

	"github.com/btcsuite/btcutil/base58"
	shell "github.com/ipfs/go-ipfs-api"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type WebRequest struct {
	store *shell.Shell
}

func (w *WebRequest) Configure(*viper.Viper) {
	w.store = shell.NewShell("https://ipfs.bandprotocol.com")
}

func GetMultiplierValue(price float64, m int64) *big.Int {
	bigval := new(big.Float)
	bigval.SetFloat64(price)

	multiplier := new(big.Float)
	multiplier.SetInt(big.NewInt(m))
	bigval.Mul(bigval, multiplier)

	result := new(big.Int)
	bigval.Int(result)

	return result
}

func replaceString(
	original string,
	regex *regexp.Regexp,
	params []interface{},
	pt []string,
) string {
	paramURLIndex := regex.FindAllStringIndex(original, -1)
	var output strings.Builder
	lastIndex := 0
	for _, match := range paramURLIndex {
		st := match[0]
		ed := match[1]
		output.WriteString(original[lastIndex:st])
		index, _ := strconv.Atoi(original[st+1 : ed-1])
		if pt[index] == "string" {
			output.WriteString(params[index].(string))
		}
		lastIndex = ed
	}
	output.WriteString(original[lastIndex:])
	return output.String()
}

func (w *WebRequest) Query(_key []byte) dt.Answer {
	paramRegex, _ := regexp.Compile(`\{\d*\}`)
	key := hex.EncodeToString(_key)
	params := make([]interface{}, 0)
	paramsType := make([]string, 0)
	var answer gjson.Result

	// Minimum ipfs (hex) hash length is 2(0x) + 4 (1220) + 64(32 byte)
	if len(key) < 68 {
		return dt.NotFoundAnswer
	}
	hexKey := string(key)
	ipfsHash, err := hex.DecodeString(hexKey[:68])
	if err != nil {
		return dt.NotFoundAnswer
	}
	read, err := w.store.Cat(base58.Encode(ipfsHash))
	if err != nil {
		return dt.NotFoundAnswer
	}
	defer read.Close()

	rawBytes, err := ioutil.ReadAll(read)
	if err != nil {
		return dt.NotFoundAnswer
	}

	results := gjson.GetManyBytes(rawBytes, "meta", "request", "response")
	meta := results[0].Map()
	request := results[1].Map()
	response := results[2].Map()

	rawParamType := meta["variables"].Array()
	parameterBytes, err := hex.DecodeString((hexKey[68:]))
	if err != nil {
		return dt.NotFoundAnswer
	}

	for _, pt := range rawParamType {
		word := make([]byte, 0)
		for parameterBytes[0] != 0 {
			word = append(word, parameterBytes[0])
			parameterBytes = parameterBytes[1:]
			if len(parameterBytes) == 0 {
				return dt.NotFoundAnswer
			}
		}
		parameterBytes = parameterBytes[1:]
		paramsType = append(paramsType, pt.String())
		if pt.String() == "string" {
			params = append(params, string(word))
		}
	}

	// Must use all parameter
	if len(parameterBytes) != 0 {
		return dt.NotFoundAnswer
	}

	url := replaceString(request["url"].String(), paramRegex, params, paramsType)
	method := request["method"].String()
	if method == "GET" {
		client := &http.Client{}

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return dt.NotFoundAnswer
		}
		if reqParams, ok := request["params"]; ok {
			q := req.URL.Query()
			for name, arg := range reqParams.Map() {
				q.Add(name, replaceString(arg.String(), paramRegex, params, paramsType))
			}
			req.URL.RawQuery = q.Encode()
		}

		req.Header.Add("Accept", "application/json")
		res, err := client.Do(req)
		if err != nil {
			return dt.NotFoundAnswer
		}
		defer res.Body.Close()

		var responsePath strings.Builder
		body, err := ioutil.ReadAll(res.Body)
		for i, path := range response["path"].Array() {

			responsePath.WriteString(replaceString(path.String(), paramRegex, params, paramsType))

			if i != len(response["path"].Array())-1 {
				responsePath.WriteString(".")
			}
		}
		answer = gjson.GetBytes(body, responsePath.String())
	} else {
		return dt.NotFoundAnswer
	}

	if response["type"].String() == "uint256" {
		var mutilplier int64
		if m, ok := response["multiplier"]; ok {
			mutilplier = m.Int()
		} else {
			mutilplier = 1
		}
		return dt.Answer{
			Option: dt.Answered,
			Value:  common.BigToHash(GetMultiplierValue(answer.Float(), mutilplier)),
		}
	}
	return dt.NotFoundAnswer
}
