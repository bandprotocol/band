package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bandprotocol/band/go/adapter"
	"github.com/ethereum/go-ethereum/common"
)

type Signature struct {
	V int8   `json:"v"`
	R string `json:"r"`
	S string `json:"s"`
}

type DataRequestInput struct {
	Dataset string `json:"dataset"`
	Key     string `json:"key"`
}

type DataRequestOutput struct {
	Provider  common.Address `json:"provider"`
	Value     common.Hash    `json:"value"`
	Timestamp int64          `json:"timestamp"`
	Sig       Signature      `json:"signature"`
}

type DataSignInput struct {
	Dataset    string              `json:"dataset"`
	Key        string              `json:"key"`
	Datapoints []DataRequestOutput `json:"datapoints"`
}

type DataSignOutput struct {
	Status    string      `json:"status"`
	Value     common.Hash `json:"value"`
	Timestamp int64       `json:"timestamp"`
	Sig       string      `json:"signature"`
}

var adpt adapter.Adapter = &adapter.MockAdapter{}

func sign(dataset, key string, value []byte, timestamp int64) Signature {
	// TODO
	return Signature{}
}

func handleDataRequest(w http.ResponseWriter, r *http.Request) {
	var arg DataRequestInput
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	output, err := adpt.Query([]byte(arg.Key))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(DataRequestOutput{
		Provider:  common.BytesToAddress([]byte{}),
		Value:     output,
		Timestamp: 0,
		Sig: Signature{
			V: 0,
			R: "",
			S: "",
		},
	})
}

func handleSignRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(DataSignOutput{})
}

func main() {
	http.HandleFunc("/data", handleDataRequest)
	http.HandleFunc("/sign", handleSignRequest)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
