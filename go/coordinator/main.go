package main

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sort"
	"strings"

	"github.com/bandprotocol/band/go/reqmsg"

	"github.com/bandprotocol/band/go/eth"
	"github.com/ethereum/go-ethereum/accounts/abi"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type RequestObject struct {
	Dataset   common.Address `json:"dataset"`
	Key       string         `json:"key"`
	Broadcast bool           `json:"broadcast"`
}

type ResponseTxHashObject struct {
	TxHash common.Hash `json:"txhash"`
}

type ResponseTxObject struct {
	To       common.Address        `json:"to"`
	Data     string                `json:"data"`
	Reponses []reqmsg.DataResponse `json:"reponses"`
}

type valueWithTimeStamp struct {
	Value     common.Hash
	Status    uint8
	Timestamp uint64
}

func getProviderUrl(provider common.Address) (string, error) {
	key := "providers." + provider.Hex()
	if !viper.IsSet(key) {
		return "", fmt.Errorf("getProviderUrl: unknown provider url for %s", provider.Hex())
	}
	return viper.GetString(key), nil
}

func statusToInt(status string) uint8 {
	switch status {
	case "OK":
		return 1
	default:
		return 0
	}
}

func getDataFromProvider(request *reqmsg.DataRequest, provider common.Address) (reqmsg.DataResponse, error) {
	url, err := getProviderUrl(provider)
	if err != nil {
		return reqmsg.DataResponse{}, err
	}
	jsonValue, _ := json.Marshal(request)

	res, err := http.Post(url+"/data", "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		return reqmsg.DataResponse{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return reqmsg.DataResponse{}, err
	}

	var result reqmsg.DataResponse
	json.Unmarshal(body, &result)

	// Check provider address
	if provider != result.Provider {
		return reqmsg.DataResponse{}, err
	}

	keyBytes, _ := hex.DecodeString(request.Key[2:])
	// Verify signature
	if !eth.VerifyMessage(
		reqmsg.GetRawDataBytes(request.Dataset, keyBytes, result.Value, result.Timestamp),
		result.Sig,
		provider,
	) {
		return reqmsg.DataResponse{}, fmt.Errorf("Invalid signature")
	}

	return result, nil
}

func getAggregateFromProvider(request *reqmsg.SignRequest, provider common.Address) (reqmsg.SignResponse, error) {
	url, err := getProviderUrl(provider)
	if err != nil {
		return reqmsg.SignResponse{}, err
	}

	jsonValue, _ := json.Marshal(request)
	res, err := http.Post(url+"/sign", "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		return reqmsg.SignResponse{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return reqmsg.SignResponse{}, err
	}

	var result reqmsg.SignResponse
	json.Unmarshal(body, &result)

	// Check provider address
	if provider != result.Provider {
		return reqmsg.SignResponse{}, err
	}

	status := statusToInt(result.Status)
	if status == 0 {
		return reqmsg.SignResponse{}, fmt.Errorf("getAggregateFromProvider: status invalid")
	}

	keyBytes, _ := hex.DecodeString(request.Key[2:])
	// Verify signature
	if !eth.VerifyMessage(
		reqmsg.GetAggregateBytes(
			request.Dataset,
			keyBytes,
			result.Value,
			result.Timestamp,
			status,
		),
		result.Sig,
		provider,
	) {
		return reqmsg.SignResponse{}, fmt.Errorf("Invalid signature")
	}
	return result, nil
}

func generateTransaction(
	key string, value common.Hash, timestamp uint64, status uint8,
	v []uint8, r []common.Hash, s []common.Hash) []byte {
	const definition = `[{
		"constant": false,
		"inputs": [
		  {
			"name": "key",
			"type": "bytes"
		  },
		  {
			"name": "value",
			"type": "uint256"
		  },
		  {
			"name": "timestamp",
			"type": "uint64"
		  },
		  {
			"name": "status",
			"type": "uint8"
		  },
		  {
			"name": "v",
			"type": "uint8[]"
		  },
		  {
			"name": "r",
			"type": "bytes32[]"
		  },
		  {
			"name": "s",
			"type": "bytes32[]"
		  }
		],
		"name": "report",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  }]`
	contractABI, _ := abi.JSON(strings.NewReader(definition))

	if key[:2] == "0x" {
		key = key[2:]
	}

	hexStr, _ := hex.DecodeString(key)

	out, _ := contractABI.Pack("report", hexStr, value.Big(), timestamp, status, v, r, s)

	return out
}
func handleRequest(w http.ResponseWriter, r *http.Request) {
	var arg RequestObject
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !eth.IsValidDataset(arg.Dataset) {
		http.Error(w, "Dataset is not valid", http.StatusBadRequest)
		return
	}

	providers, err := eth.GetActiveProviders(arg.Dataset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dataRequest := reqmsg.DataRequest{
		Dataset: arg.Dataset,
		Key:     arg.Key,
	}

	// TODO : prin-r - make it parallel
	chDataResponse := make(chan reqmsg.DataResponse)
	for _, provider := range providers {
		go func(chDataResponse chan<- reqmsg.DataResponse, provider common.Address) {
			data, err := getDataFromProvider(&dataRequest, provider)
			if err == nil {
				chDataResponse <- data
			} else {
				chDataResponse <- reqmsg.DataResponse{}
			}
		}(chDataResponse, provider)
	}

	var responses []reqmsg.DataResponse
	for i := 0; i < len(providers); i++ {
		r := <-chDataResponse
		if r != (reqmsg.DataResponse{}) {
			responses = append(responses, r)
		}
	}

	// Check valid provider data
	if 3*len(responses) < 2*len(providers) {
		http.Error(w, "Insufficient providers", http.StatusBadRequest)
		return
	}

	// Get aggregate data
	aggRequest := reqmsg.SignRequest{
		dataRequest,
		responses,
	}

	var counter = make(map[valueWithTimeStamp]int)

	// TODO : prin-r - make it parallel
	chSignResponse := make(chan reqmsg.SignResponse)
	for _, provider := range providers {
		go func(chSignResponse chan<- reqmsg.SignResponse, provider common.Address) {
			data, err := getAggregateFromProvider(&aggRequest, provider)
			if err == nil {
				chSignResponse <- data
			} else {
				chSignResponse <- reqmsg.SignResponse{}
			}
		}(chSignResponse, provider)
	}

	var validAggs []reqmsg.SignResponse
	for i := 0; i < len(providers); i++ {
		r := <-chSignResponse
		if r != (reqmsg.SignResponse{}) {
			validAggs = append(validAggs, r)
			counter[valueWithTimeStamp{
				Value:     r.Value,
				Timestamp: r.Timestamp,
				Status:    statusToInt(r.Status),
			}] += 1
		}
	}

	// for _, provider := range providers {
	// 	data, err := getAggregateFromProvider(&aggRequest, provider)
	// 	if err == nil {
	// 		validAggs = append(validAggs, data)
	// 		counter[valueWithTimeStamp{
	// 			Value:     data.Value,
	// 			Timestamp: data.Timestamp,
	// 			Status:    statusToInt(data.Status),
	// 		}] += 1
	// 	}
	// }

	// Check valid provider aggregated data
	if 3*len(validAggs) < 2*len(providers) {
		http.Error(w, "Insufficient providers", http.StatusBadRequest)
		return
	}

	// Find majority of value and timestamp
	var majority valueWithTimeStamp
	var maxCount = 0
	for key, value := range counter {
		if value > maxCount {
			majority = key
			maxCount = value
		}
	}

	if 3*maxCount < 2*len(providers) {
		http.Error(w, "Insufficient providers", http.StatusBadRequest)
		return
	}

	var agreedData []reqmsg.SignResponse
	for _, agg := range validAggs {
		if agg.Value == majority.Value &&
			agg.Timestamp == majority.Timestamp &&
			statusToInt(agg.Status) == majority.Status {
			agreedData = append(agreedData, agg)
		}
	}

	// Sort provider address for contract
	sort.Slice(agreedData, func(i, j int) bool {
		return strings.ToLower(agreedData[i].Provider.String()) < strings.ToLower(agreedData[j].Provider.String())
	})

	var vs []uint8
	var rs []common.Hash
	var ss []common.Hash

	for _, agg := range agreedData {
		vs = append(vs, agg.Sig.V)
		rs = append(rs, agg.Sig.R)
		ss = append(ss, agg.Sig.S)
	}
	txData := generateTransaction(arg.Key, majority.Value, majority.Timestamp, majority.Status, vs, rs, ss)
	w.Header().Set("Content-Type", "application/json")

	if arg.Broadcast {
		txHash, err := eth.SendTransaction(arg.Dataset, txData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		json.NewEncoder(w).Encode(ResponseTxHashObject{
			TxHash: txHash,
		})
	} else {
		// TODO : prin-r - add responses
		json.NewEncoder(w).Encode(ResponseTxObject{
			To:       arg.Dataset,
			Data:     "0x" + hex.EncodeToString(txData),
			Reponses: responses,
		})
	}

}

func main() {
	viper.SetConfigName("coord")
	viper.AddConfigPath(".")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("Unable to locate config file (coord.yaml)")
	}
	http.HandleFunc("/", handleRequest)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
