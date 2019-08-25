package main

import (
	"fmt"
	"log"
	"net/http"

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
	// TODO(bunoi)
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
