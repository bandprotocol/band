package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"
	"sort"
	"strconv"
	"time"

	"github.com/bandprotocol/band/go/adapter"
	"github.com/bandprotocol/band/go/eth"
	"github.com/bandprotocol/band/go/reqmsg"
	"github.com/ethereum/go-ethereum/common"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var adapters map[common.Address]adapter.Adapter

var rootCmd = &cobra.Command{
	Use:   "./[this] -h \n  ./[this] --help \n  ./[this] [path to node.yml]",
	Short: "The Band provider node is middleware, operating between the blockchain and external data",
	Run:   func(cmd *cobra.Command, args []string) {},
}

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
	output, err := adapter.DoQuery(adapters[arg.Dataset], []byte(arg.Key))
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
	var port string
	var ethRpc string
	var privateKey string
	var queryDebug bool

	if len(os.Args) < 2 {
		fmt.Println("should have at least 1 argument, -h or --help for more detail")
		os.Exit(1)
	} else if os.Args[1] == "-h" || os.Args[1] == "--help" {
		rootCmd.PersistentFlags().StringVar(&port, "port", "should be set by node.yml", `port of your app, for example "5000"`)
		rootCmd.PersistentFlags().StringVar(&ethRpc, "ethRpc", "should be set by node.yml", `Ethereum rcp url, for example "https://kovan.infura.io"`)
		rootCmd.PersistentFlags().StringVar(&privateKey, "privateKey", "should be set by node.yml", `Private Key of the data provider, 64 hex characters`)
		rootCmd.PersistentFlags().BoolVar(&queryDebug, "debug", false, `turn on debugging when query`)
		err := rootCmd.Execute()
		if err != nil {
			log.Println(err)
		}
		return
	}

	config := viper.New()
	config.SetConfigName(os.Args[1])
	config.AddConfigPath(".")
	if err := config.ReadInConfig(); err != nil {
		log.Fatal("main: unable to read configuration file", err)
	}

	privateKey = config.GetString("privateKey")
	ethRpc = config.GetString("ethRpc")
	port = config.GetString("port")
	queryDebug = config.GetBool("queryDebug")

	rootCmd.PersistentFlags().StringVar(&port, "port", port, `port of your app, for example "5000"`)
	rootCmd.PersistentFlags().StringVar(&ethRpc, "ethRpc", ethRpc, `Ethereum rcp url, for example "https://kovan.infura.io"`)
	rootCmd.PersistentFlags().StringVar(&privateKey, "privateKey", privateKey, `Private Key of the data provider, 64 hex characters`)
	rootCmd.PersistentFlags().BoolVar(&queryDebug, "debug", false, `turn on debugging when query`)
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	if queryDebug {
		adapter.TurnOnQueryDebugging()
	}
	err := eth.SetPrivateKey(privateKey)
	if err != nil {
		log.Println(err.Error())
		log.Println("Warning: Private key not set. Ethereum node according to ethRpc will be used for signing")
	}
	err = eth.SetRpcClient(ethRpc)
	if err != nil {
		log.Println("create ethRpc client error")
		log.Fatal(err)
	}
	_, err = strconv.Atoi(port)
	if err != nil {
		log.Println("wrong port format")
		log.Fatal(err)
	}

	adapters = adapter.FromConfig(config)

	fmt.Println("start provider node with these following parameters")
	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"Parameter Name", "Value"})
	table.Append([]string{"port", port})
	table.Append([]string{"ethRpc", ethRpc})
	table.Append([]string{"debug", strconv.FormatBool(queryDebug)})
	table.Render()

	http.HandleFunc("/data", handleDataRequest)
	http.HandleFunc("/sign", handleSignRequest)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
