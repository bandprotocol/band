package main

import (
	"crypto/ecdsa"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/bandprotocol/band/go/adapter"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

type Signature struct {
	V uint8       `json:"v"`
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
	Timestamp uint64         `json:"timestamp"`
	Sig       Signature      `json:"signature"`
}

type DataSignInput struct {
	DataRequestInput
	Datapoints []DataRequestOutput `json:"datapoints"`
}

type DataSignOutput struct {
	Status    string      `json:"status"`
	Value     common.Hash `json:"value"`
	Timestamp uint64      `json:"timestamp"`
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
	timestamp uint64,
	pk *ecdsa.PrivateKey,
) Signature {
	var buff []byte
	buff = append(buff, dataset.Bytes()...)
	buff = append(buff, []byte(key)...)
	buff = append(buff, value.Bytes()...)

	bytesTimeStamp := make([]byte, 8)
	binary.BigEndian.PutUint64(bytesTimeStamp, timestamp)

	buff = append(buff, bytesTimeStamp...)

	signature, _ := crypto.Sign(crypto.Keccak256(buff), pk)

	return Signature{
		uint8(int(signature[64])) + 27,
		common.BytesToHash(signature[0:32]),
		common.BytesToHash(signature[32:64]),
	}
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
