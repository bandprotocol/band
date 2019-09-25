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

	"github.com/bandprotocol/band/go/driver"
	"github.com/bandprotocol/band/go/dt"
	"github.com/bandprotocol/band/go/eth"
	"github.com/bandprotocol/band/go/reqmsg"
	"github.com/ethereum/go-ethereum/common"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var myDriver driver.Driver
var aggregateMethod dt.AggMethod

type valueWithTimeStamp struct {
	Value     *big.Int
	Timestamp uint64
}

var rootCmd = &cobra.Command{
	Use:   "./[this] -h \n  ./[this] --help \n  ./[this] [path to node.yml]",
	Short: "The Band provider node is middleware, operating between the blockchain and external data",
	Run:   func(cmd *cobra.Command, args []string) {},
}

func sign(
	dataset common.Address,
	key string,
	answer dt.Answer,
	timestamp uint64,
) eth.Signature {
	msgBytes := reqmsg.GetRawDataBytes(dataset, []byte(key), answer.Option, answer.Value, timestamp)
	sig, _ := eth.SignMessage(msgBytes)
	return sig
}

func signAggregator(
	dataset common.Address,
	key string,
	value common.Hash,
	timestamp uint64,
	status dt.QueryStatus,
) eth.Signature {
	msgBytes := reqmsg.GetAggregateBytes(dataset, []byte(key), value, timestamp, status)
	sig, _ := eth.SignMessage(msgBytes)
	return sig
}

func verifySignature(
	dataset common.Address,
	key string,
	answer dt.Answer,
	timestamp uint64,
	provider common.Address,
	signature eth.Signature,
) bool {
	return eth.VerifyMessage(
		reqmsg.GetRawDataBytes(
			dataset, []byte(key), answer.Option, answer.Value, timestamp,
		),
		signature,
		provider,
	)
}

func methodsFromConfig(config *viper.Viper) dt.AggMethod {
	method := config.GetString("method")
	if method == "" {
		return dt.Median
		// panic("Need specific aggregator method")
	}
	aggMethod, ok := dt.AggMethodToID[method]
	if !ok {
		panic("Unknown aggregator method")
	}
	return aggMethod
}

func medianTimestamp(timestamps []uint64) uint64 {
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
	output := driver.DoQuery(myDriver, []byte(arg.Key))
	w.Header().Set("Content-Type", "application/json")
	currentTimestamp := uint64(time.Now().Unix())
	providerAddress, err := eth.GetAddress()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(reqmsg.DataResponse{
		Provider:  providerAddress,
		Answer:    output,
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

	reportedValue := make(map[common.Address]valueWithTimeStamp)
	delegateList := make([]common.Address, 0)
	for _, report := range arg.Datapoints {
		if verifySignature(
			arg.Dataset,
			arg.Key,
			report.Answer,
			report.Timestamp,
			report.Provider,
			report.Sig,
		) {
			if report.Answer.Option == dt.Answered {
				values = append(values, report.Answer.Value.Big())
				timestamps = append(timestamps, report.Timestamp)
				reportedValue[report.Provider] = valueWithTimeStamp{
					Value:     report.Answer.Value.Big(),
					Timestamp: report.Timestamp,
				}
			} else if report.Answer.Option == dt.Delegated {
				delegateList = append(delegateList, common.BytesToAddress(report.Answer.Value.Bytes()))
			}
		}
	}

	for _, delegator := range delegateList {
		if v, ok := reportedValue[delegator]; ok {
			values = append(values, v.Value)
			timestamps = append(timestamps, v.Timestamp)
		}
	}

	if len(values) < arg.MinimumProviderCount {
		http.Error(w, "Insufficient signatures", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	providerAddress, err := eth.GetAddress()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var output common.Hash
	var status dt.QueryStatus
	if aggregateMethod == dt.Median {
		output = common.BigToHash(driver.Median(values))
		status = dt.OK
	} else if aggregateMethod == dt.Majority {
		value, count, err := driver.Majority(values)
		if err != nil || count < arg.MinimumProviderCount {
			output = common.Hash{}
			status = dt.Disagreement
			log.Printf("Disagree on %s", arg.Key)
		} else {
			output = common.BigToHash(value)
			status = dt.OK
		}
	} else if aggregateMethod == dt.Custom {
		// TODO: Get aggregate method from ipfs
	}

	timestamp := medianTimestamp(timestamps)
	json.NewEncoder(w).Encode(reqmsg.SignResponse{
		Provider:  providerAddress,
		Value:     output,
		Timestamp: timestamp,
		Status:    status,
		Sig:       signAggregator(arg.Dataset, arg.Key, output, timestamp, status),
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
	rootCmd.PersistentFlags().StringVar(&ethRpc, "ethRpc", ethRpc, `Ethereum rpc url, for example "https://kovan.infura.io"`)
	rootCmd.PersistentFlags().StringVar(&privateKey, "privateKey", privateKey, `Private Key of the data provider, 64 hex characters`)
	rootCmd.PersistentFlags().BoolVar(&queryDebug, "debug", false, `turn on debugging when query`)
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	if queryDebug {
		driver.TurnOnQueryDebugging()
	}
	err := eth.SetPrivateKey(privateKey)
	if err != nil {
		log.Println(err.Error())
		log.Println("Warning: Private key not set. Ethereum node according to ethRpc will be used for signing")
		err = eth.SetRpcClient(ethRpc)
		if err != nil {
			log.Println("create ethRpc client error")
			log.Fatal(err)
		}
	}
	_, err = strconv.Atoi(port)
	if err != nil {
		log.Println("wrong port format")
		log.Fatal(err)
	}

	myDriver = driver.FromConfig(config)
	aggregateMethod = methodsFromConfig(config)

	fmt.Println("start provider node with these following parameters")
	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"Arg", "Val"})
	table.Append([]string{"port", port})
	if ethRpc != "" {
		table.Append([]string{"ethRpc", ethRpc})
	}
	table.Append([]string{"debug", strconv.FormatBool(queryDebug)})
	table.Render()

	http.HandleFunc("/data", handleDataRequest)
	http.HandleFunc("/sign", handleSignRequest)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
