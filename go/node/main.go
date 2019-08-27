package main

import (
	"crypto/ecdsa"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"log"
	"math/big"
	"net/http"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/bandprotocol/band/go/adapter"
	"github.com/bandprotocol/band/go/eth"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/spf13/viper"
)

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

type DataSignInput struct {
	DataRequestInput
	Datapoints []DataRequestOutput `json:"datapoints"`
}

type DataSignOutput struct {
	Provider  common.Address `json:"provider"`
	Value     common.Hash    `json:"value"`
	Timestamp uint64         `json:"timestamp"`
	Sig       eth.Signature  `json:"signature"`
	Status    string         `json:"status"`
}

func (input *DataRequestInput) normalizeKey() {
	if strings.HasPrefix(input.Key, "0x") {
		decoded, err := hex.DecodeString(input.Key[2:])
		if err == nil {
			input.Key = string(decoded)
		}
	}
}

// var adpt adapter.Adapter = &adapter.MockAdapter{}
// var adpt *adapter.AggMedian = &adapter.AggMedian{}
var adapters map[common.Address]adapter.Adapter

// func init() {
// 	adpt.Initialize([]adapter.Adapter{
// 		&adapter.CoinMarketCap{},
// 		&adapter.CoinBase{},
// 		&adapter.CryptoCompare{},
// 		&adapter.OpenMarketCap{},
// 		&adapter.Gemini{},
// 		&adapter.Bitfinex{},
// 		&adapter.Bitstamp{},
// 		&adapter.Bittrex{},
// 		&adapter.Kraken{},
// 		&adapter.Bancor{},
// 		&adapter.Uniswap{},
// 		&adapter.Kyber{},
// 		&adapter.Ratesapi{},
// 		&adapter.CurrencyConverter{},
// 		&adapter.AlphaVantageForex{},
// 		&adapter.FreeForexApi{},
// 		&adapter.AlphaVantageStock{},
// 		&adapter.WorldTradingData{},
// 		&adapter.FinancialModelPrep{},
// 	})
// }

func sign(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
	pk *ecdsa.PrivateKey,
) eth.Signature {
	bytesTimeStamp := make([]byte, 8)
	binary.BigEndian.PutUint64(bytesTimeStamp, timestamp)

	var buff []byte
	buff = append(buff, []byte(key)...)
	buff = append(buff, value.Bytes()...)
	buff = append(buff, bytesTimeStamp...)
	buff = append(buff, dataset.Bytes()...)

	signature, _ := crypto.Sign(crypto.Keccak256(buff), pk)

	return eth.Signature{
		V: uint8(int(signature[64])) + 27,
		R: common.BytesToHash(signature[0:32]),
		S: common.BytesToHash(signature[32:64]),
	}
}

func signAggregator(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
	status uint8,
	pk *ecdsa.PrivateKey,
) eth.Signature {
	bytesTimeStamp := make([]byte, 8)
	binary.BigEndian.PutUint64(bytesTimeStamp, timestamp)

	var buff []byte
	buff = append(buff, []byte(key)...)
	buff = append(buff, value.Bytes()...)
	buff = append(buff, bytesTimeStamp...)
	buff = append(buff, byte(status))
	buff = append(buff, dataset.Bytes()...)

	signature, _ := crypto.Sign(crypto.Keccak256(buff), pk)

	return eth.Signature{
		V: uint8(int(signature[64])) + 27,
		R: common.BytesToHash(signature[0:32]),
		S: common.BytesToHash(signature[32:64]),
	}
}

func verifySignature(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
	provider common.Address,
	signature eth.Signature,
) bool {
	// TODO: verify signature
	return true
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
	var arg DataRequestInput
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	arg.normalizeKey()
	output, err := adapters[arg.Dataset].Query([]byte(arg.Key))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	currentTimestamp := uint64(time.Now().Unix())
	pk, err := crypto.HexToECDSA(os.Getenv("ETH_PRIVATE_KEY"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(DataRequestOutput{
		Provider:  crypto.PubkeyToAddress(pk.PublicKey),
		Value:     output,
		Timestamp: currentTimestamp,
		Sig:       sign(arg.Dataset, arg.Key, output, currentTimestamp, pk),
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
	pk, err := crypto.HexToECDSA(os.Getenv("ETH_PRIVATE_KEY"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	output := common.BigToHash(adapter.Median(values))
	timestamp := mediumTimestamp(timestamps)
	json.NewEncoder(w).Encode(DataSignOutput{
		Provider:  crypto.PubkeyToAddress(pk.PublicKey),
		Value:     output,
		Timestamp: timestamp,
		Status:    "OK",
		Sig:       signAggregator(arg.Dataset, arg.Key, output, timestamp, 1, pk),
	})
}

func main() {
	config := viper.New()
	config.SetConfigName(os.Args[1])
	config.AddConfigPath("../")
	if err := config.ReadInConfig(); err != nil {
		log.Fatal("main: unable to read configuration file")
	}
	privateKeyFromConfig := config.GetString("privateKey")
	if privateKeyFromConfig != "" {
		os.Setenv("ETH_PRIVATE_KEY", privateKeyFromConfig)
	}
	adapters = adapter.FromConfig(config)
	http.HandleFunc("/data", handleDataRequest)
	http.HandleFunc("/sign", handleSignRequest)
	log.Fatal(http.ListenAndServe(":"+config.GetString("port"), nil))
}
