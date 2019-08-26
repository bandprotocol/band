package main

import (
	"encoding/json"
	"fmt"
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

func getProviderUrl(provider common.Address) (string, error) {
	key := "providers." + provider.Hex()
	if !viper.IsSet(key) {
		return "", fmt.Errorf("getProviderUrl: unknown provider url for %s", provider.Hex())
	}
	return viper.GetString(key), nil
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
