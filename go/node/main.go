package main

import (
	"encoding/json"
	"log"
	"math/big"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/bandprotocol/band/go/adapter"
	"github.com/bandprotocol/band/go/eth"
	"github.com/bandprotocol/band/go/reqmsg"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

var adapters map[common.Address]adapter.Adapter

func sign(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
) eth.Signature {
	msgBytes := reqmsg.GetRawDataBytes(dataset, []byte(key), value, timestamp)
	sig, _ := eth.SignMessage(msgBytes)
	return sig
}

func signAggregator(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
	status uint8,
) eth.Signature {
	msgBytes := reqmsg.GetAggregateBytes(dataset, []byte(key), value, timestamp, status)
	sig, _ := eth.SignMessage(msgBytes)
	return sig
}

func verifySignature(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
	provider common.Address,
	signature eth.Signature,
) bool {
	return eth.VerifyMessage(
		reqmsg.GetRawDataBytes(dataset, []byte(key), value, timestamp),
		signature,
		provider,
	)
}

func getRequiredProviderCount(dataset common.Address) int {
	return 2
}

func mediumTimestamp(timestamps []uint64) uint64 {
	sort.Slice(timestamps, func(i, j int) bool {
		return timestamps[i] < timestamps[j]
	})

	if len(timestamps)%2 == 0 {
		return (timestamps[len(timestamps)/2-1] + timestamps[len(timestamps)/2]) / 2
	} else {
		return timestamps[len(timestamps)/2]
	}
}

func handleDataRequest(w http.ResponseWriter, r *http.Request) {
	var arg reqmsg.DataRequest
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	arg.NormalizeKey()
	output, err := adapters[arg.Dataset].Query([]byte(arg.Key))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	currentTimestamp := uint64(time.Now().Unix())
	providerAddress, err := eth.GetAddress()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(reqmsg.DataResponse{
		Provider:  providerAddress,
		Value:     output,
		Timestamp: currentTimestamp,
		Sig:       sign(arg.Dataset, arg.Key, output, currentTimestamp),
	})
}

func handleSignRequest(w http.ResponseWriter, r *http.Request) {
	var arg reqmsg.SignRequest
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	arg.NormalizeKey()
	var values []*big.Int
	var timestamps []uint64
	for _, report := range arg.Datapoints {
		if verifySignature(
			arg.Dataset,
			arg.Key,
			report.Value,
			report.Timestamp,
			report.Provider,
			report.Sig,
		) {
			values = append(values, report.Value.Big())
			timestamps = append(timestamps, report.Timestamp)
		}
	}
	if len(values) < getRequiredProviderCount(arg.Dataset) {
		http.Error(w, "Insufficient signatures", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	providerAddress, err := eth.GetAddress()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	output := common.BigToHash(adapter.Median(values))
	timestamp := mediumTimestamp(timestamps)
	json.NewEncoder(w).Encode(reqmsg.SignResponse{
		Provider:  providerAddress,
		Value:     output,
		Timestamp: timestamp,
		Status:    "OK",
		Sig:       signAggregator(arg.Dataset, arg.Key, output, timestamp, 1),
	})
}

func main() {
	config := viper.New()
	config.SetConfigName(os.Args[1])
	config.AddConfigPath(".")
	if err := config.ReadInConfig(); err != nil {
		log.Fatal("main: unable to read configuration file", err)
	}
	privateKeyFromConfig := config.GetString("privateKey")
	if privateKeyFromConfig != "" {
		err := eth.SetPrivateKey(privateKeyFromConfig)
		if err != nil {
			log.Fatal(err)
		}
	}
	adapters = adapter.FromConfig(config)
	http.HandleFunc("/data", handleDataRequest)
	http.HandleFunc("/sign", handleSignRequest)
	log.Fatal(http.ListenAndServe(":"+config.GetString("port"), nil))
}
