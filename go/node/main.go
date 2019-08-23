package main

import (
	"crypto/ecdsa"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/bandprotocol/band/go/adapter"
	"github.com/ethereum/go-ethereum/common"
)

type Signature struct {
	V int8        `json:"v"`
	R common.Hash `json:"r"`
	S common.Hash `json:"s"`
}

type DataRequestInput struct {
	Dataset common.Address `json:"dataset"`
	Key     string         `json:"key"`
}

type DataRequestOutput struct {
	Provider  common.Address `json:"provider"`
	Value     common.Hash    `json:"value"`
	Timestamp int64          `json:"timestamp"`
	Sig       Signature      `json:"signature"`
}

type DataSignInput struct {
	DataRequestInput
	Datapoints []DataRequestOutput `json:"datapoints"`
}

type DataSignOutput struct {
	Status    string      `json:"status"`
	Value     common.Hash `json:"value"`
	Timestamp int64       `json:"timestamp"`
	Sig       Signature   `json:"signature"`
}

func (input *DataRequestInput) normalizeKey() {
	if strings.HasPrefix(input.Key, "0x") {
		decoded, err := hex.DecodeString(input.Key[2:])
		if err == nil {
			input.Key = string(decoded)
		}
	}
}

var adpt adapter.Adapter = &adapter.MockAdapter{}

func sign(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp int64,
	pk *ecdsa.PrivateKey,
) Signature {
	// TODO(prin-r)
	return Signature{}
}

func handleDataRequest(w http.ResponseWriter, r *http.Request) {
	var arg DataRequestInput
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	arg.normalizeKey()
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
		Sig:       Signature{},
	})
}

func handleSignRequest(w http.ResponseWriter, r *http.Request) {
	var arg DataSignInput
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	arg.normalizeKey()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(DataSignOutput{})
}

func main() {
	http.HandleFunc("/data", handleDataRequest)
	http.HandleFunc("/sign", handleSignRequest)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
