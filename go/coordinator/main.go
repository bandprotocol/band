package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/bandprotocol/band/go/eth"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type RequestObject struct {
	Dataset   common.Address `json:"dataset"`
	Key       string         `json:"key"`
	Broadcast bool           `json:"broadcast"`
}

type ResponseObject struct {
	TxHash common.Hash `json:"txhash"`
}

type DataRequestInput struct {
	Dataset common.Address `json:"dataset"`
	Key     string         `json:"key"`
}

type DataRequestOutput struct {
	Provider  common.Address `json:"provider"`
	Value     common.Hash    `json:"value"`
	Timestamp uint64         `json:"timestamp"`
	Sig       eth.Signature  `json:"signature"`
}

func getProviderUrl(provider common.Address) (string, error) {
	key := "providers." + provider.Hex()
	if !viper.IsSet(key) {
		return "", fmt.Errorf("getProviderUrl: unknown provider url for %s", provider.Hex())
	}
	return viper.GetString(key), nil
}

func sendDataRequest(dataset common.Address, key string, provider common.Address) (DataRequestOutput, error) {
	url, err := getProviderUrl(provider)
	if err != nil {
		return DataRequestOutput{}, err
	}
	jsonValue, _ := json.Marshal(DataRequestInput{
		Dataset: dataset,
		Key:     key,
	})

	res, err := http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		return DataRequestOutput{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return DataRequestOutput{}, err
	}

	var result DataRequestOutput
	json.Unmarshal(body, &result)

	return result, nil
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
	var responses []*DataRequestOutput
	for _, provider := range providers {
		data, err := sendDataRequest(arg.Dataset, arg.Key, provider)
		if err != nil {
			responses = append(responses, &data)
			println(data.Provider.Hex())
		}
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
