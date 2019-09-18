package main

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/user"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/bandprotocol/band/go/driver"
	"github.com/bandprotocol/band/go/dt"
	"github.com/bandprotocol/band/go/reqmsg"
	"github.com/olekukonko/tablewriter"

	"github.com/bandprotocol/band/go/eth"
	"github.com/ethereum/go-ethereum/accounts/abi"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type RequestObject struct {
	Dataset   common.Address `json:"dataset"`
	Key       string         `json:"key"`
	Broadcast bool           `json:"broadcast"`
}

type ResponseTxHashObject struct {
	TxHash          common.Hash           `json:"txhash"`
	ProviderReports []reqmsg.DataResponse `json:"providerReports"`
}

type ResponseTxObject struct {
	To              common.Address        `json:"to"`
	Data            string                `json:"data"`
	ProviderReports []reqmsg.DataResponse `json:"providerReports"`
}

type valueWithTimeStamp struct {
	Value     common.Hash
	Status    dt.QueryStatus
	Timestamp uint64
}

var rootCmd = &cobra.Command{
	Use:   "./[this] -h \n  ./[this] --help \n  ./[this] [path to node.yml]",
	Short: "The Band coordinator node is middleware, gathering data from all provider nodes",
	Run:   func(cmd *cobra.Command, args []string) {},
}

func getProviderURL(provider common.Address) (string, error) {
	if !viper.IsSet("providerEndpointContract") {
		return "", fmt.Errorf("getProviderUrl: unknown provider endpoint contract")
	}
	data := append(eth.Get4BytesFunctionSignature("endpoints(address)"), provider.Hash().Bytes()...)

	callResult, err := eth.CallContract(common.HexToAddress(viper.GetString("providerEndpointContract")), data)
	if err != nil {
		return "", err
	}
	const definition = `[{
		"constant": true,
		"inputs": [
		  {
		    "name": "",
		    "type": "address"
	 	  }
		],
		"name": "endpoints",
		"outputs": [
		  {
			"name": "",
			"type": "string"
		  }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}]`
	contractABI, err := abi.JSON(strings.NewReader(definition))
	var endpoint string
	err = contractABI.Unpack(&endpoint, "endpoints", callResult)
	return endpoint, err
}

func logWithTimestamp(l *log.Logger, msg string) {
	l.Printf(",%d,%s", time.Now().UnixNano()/int64(time.Millisecond), msg)
}

func getDataFromProvider(request *reqmsg.DataRequest, provider common.Address) (reqmsg.DataResponse, error) {
	url, err := getProviderURL(provider)
	if err != nil {
		return reqmsg.DataResponse{}, err
	}
	jsonValue, _ := json.Marshal(request)

	res, err := http.Post(url+"/data", "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		return reqmsg.DataResponse{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return reqmsg.DataResponse{}, err
	}

	var result reqmsg.DataResponse
	json.Unmarshal(body, &result)

	// Check provider address
	if provider != result.Provider {
		return reqmsg.DataResponse{}, err
	}

	keyBytes, _ := hex.DecodeString(request.Key[2:])
	// Verify signature
	if !eth.VerifyMessage(
		reqmsg.GetRawDataBytes(
			request.Dataset, keyBytes, result.Answer.Option, result.Answer.Value, result.Timestamp,
		),
		result.Sig,
		provider,
	) {
		return reqmsg.DataResponse{}, fmt.Errorf("Invalid signature")
	}

	return result, nil
}

func getAggregateFromProvider(request *reqmsg.SignRequest, provider common.Address) (reqmsg.SignResponse, error) {
	url, err := getProviderURL(provider)
	if err != nil {
		return reqmsg.SignResponse{}, err
	}

	jsonValue, _ := json.Marshal(request)
	res, err := http.Post(url+"/sign", "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		return reqmsg.SignResponse{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return reqmsg.SignResponse{}, err
	}

	var result reqmsg.SignResponse
	json.Unmarshal(body, &result)

	// Check provider address
	if provider != result.Provider {
		return reqmsg.SignResponse{}, err
	}

	if result.Status != dt.OK && result.Status != dt.Disagreement {
		return reqmsg.SignResponse{}, fmt.Errorf("getAggregateFromProvider: status invalid")
	}

	keyBytes, _ := hex.DecodeString(request.Key[2:])
	// Verify signature
	if !eth.VerifyMessage(
		reqmsg.GetAggregateBytes(
			request.Dataset,
			keyBytes,
			result.Value,
			result.Timestamp,
			result.Status,
		),
		result.Sig,
		provider,
	) {
		return reqmsg.SignResponse{}, fmt.Errorf("Invalid signature")
	}
	return result, nil
}

func generateTransaction(
	key string, value common.Hash, timestamp uint64, status uint8,
	v []uint8, r []common.Hash, s []common.Hash) []byte {
	const definition = `[{
		"constant": false,
		"inputs": [
		  {
			"name": "key",
			"type": "bytes"
		  },
		  {
			"name": "value",
			"type": "uint256"
		  },
		  {
			"name": "timestamp",
			"type": "uint64"
		  },
		  {
			"name": "status",
			"type": "uint8"
		  },
		  {
			"name": "v",
			"type": "uint8[]"
		  },
		  {
			"name": "r",
			"type": "bytes32[]"
		  },
		  {
			"name": "s",
			"type": "bytes32[]"
		  }
		],
		"name": "report",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	  }]`
	contractABI, _ := abi.JSON(strings.NewReader(definition))

	if key[:2] == "0x" {
		key = key[2:]
	}

	hexStr, _ := hex.DecodeString(key)

	out, _ := contractABI.Pack("report", hexStr, value.Big(), timestamp, status, v, r, s)

	return out
}
func handleRequest(w http.ResponseWriter, r *http.Request) {
	var arg RequestObject
	err := json.NewDecoder(r.Body).Decode(&arg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if arg.Key[:2] != "0x" {
		arg.Key = "0x" + hex.EncodeToString([]byte(arg.Key))
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

	dataRequest := reqmsg.DataRequest{
		Dataset: arg.Dataset,
		Key:     arg.Key,
	}

	// Create logger
	usr, err := user.Current()
	if err != nil {
		log.Print(err)
	}

	path := usr.HomeDir + "/band-log/"
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err := os.Mkdir(path, 0644)
		if err != nil {
			log.Print(err)
		}
	}
	fileName := path + time.Now().UTC().Format("2006-01-02") + ".log"
	f, err := os.OpenFile(fileName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()
	id := uuid.New()
	requestLog := log.New(f, strconv.FormatUint(uint64(id.ID()), 10), 0)

	logWithTimestamp(requestLog,
		fmt.Sprintf("Request,%s,%s,%s,%t", arg.Dataset.Hex(), arg.Key, r.RemoteAddr, arg.Broadcast),
	)

	chDataResponse := make(chan reqmsg.DataResponse)
	for _, provider := range providers {
		go func(provider common.Address) {
			data, err := getDataFromProvider(&dataRequest, provider)
			if err == nil {
				chDataResponse <- data
			} else {
				missingResponse := reqmsg.DataResponse{}
				missingResponse.Provider = provider
				missingResponse.Answer.Option = dt.Missing
				chDataResponse <- missingResponse
			}
		}(provider)
	}

	var responses []reqmsg.DataResponse
	for i := 0; i < len(providers); i++ {
		r := <-chDataResponse
		if r.Answer.Option != dt.Missing && r.Answer.Option != dt.NotFound {
			responses = append(responses, r)
		}
		logWithTimestamp(requestLog,
			fmt.Sprintf("Report,%s,%s,%s,%d,%s",
				r.Provider.Hex(),
				r.Answer.Option,
				r.Answer.Value.Hex(),
				r.Timestamp,
				r.Sig,
			))
	}

	// Check valid provider data
	if 3*len(responses) < 2*len(providers) {
		http.Error(w, "Insufficient providers", http.StatusBadRequest)
		return
	}

	// Get aggregate data
	minProviders := 2*len(providers)/3 + 1
	aggRequest := reqmsg.SignRequest{
		dataRequest,
		responses,
		minProviders,
	}

	counter := make(map[valueWithTimeStamp]int)

	chSignResponse := make(chan reqmsg.SignResponse)
	for _, provider := range providers {
		go func(provider common.Address, aggRequest *reqmsg.SignRequest) {
			data, err := getAggregateFromProvider(aggRequest, provider)
			if err == nil {
				chSignResponse <- data
			} else {
				log.Printf("Fail to get aggreagated value from %s: %s", provider.Hex(), err)
				missingResponse := reqmsg.SignResponse{}
				missingResponse.Provider = provider
				missingResponse.Status = dt.Invalid
				chSignResponse <- missingResponse
			}
		}(provider, &aggRequest)
	}

	var validAggs []reqmsg.SignResponse
	for i := 0; i < len(providers); i++ {
		r := <-chSignResponse
		if r.Status != dt.Invalid {
			validAggs = append(validAggs, r)
			counter[valueWithTimeStamp{
				Value:     r.Value,
				Timestamp: r.Timestamp,
				Status:    r.Status,
			}]++
		}
		logWithTimestamp(
			requestLog,
			fmt.Sprintf("Aggregate,%s,%s,%s,%d,%s",
				r.Provider.Hex(),
				r.Status,
				r.Value.Hex(),
				r.Timestamp,
				r.Sig,
			),
		)
	}

	// Check valid provider aggregated data
	if 3*len(validAggs) < 2*len(providers) {
		http.Error(w, "Insufficient providers", http.StatusBadRequest)
		return
	}

	// Find majority of value and timestamp
	var majority valueWithTimeStamp
	var maxCount = 0
	for key, value := range counter {
		if value > maxCount {
			majority = key
			maxCount = value
		}
	}

	if 3*maxCount < 2*len(providers) {
		http.Error(w, "Insufficient providers", http.StatusBadRequest)
		return
	}

	var agreedData []reqmsg.SignResponse
	for _, agg := range validAggs {
		if agg.Value == majority.Value &&
			agg.Timestamp == majority.Timestamp &&
			agg.Status == majority.Status {
			agreedData = append(agreedData, agg)
		}
	}

	// Sort provider address for contract
	sort.Slice(agreedData, func(i, j int) bool {
		return strings.ToLower(agreedData[i].Provider.String()) < strings.ToLower(agreedData[j].Provider.String())
	})

	var vs []uint8
	var rs []common.Hash
	var ss []common.Hash

	for _, agg := range agreedData {
		vs = append(vs, agg.Sig.V)
		rs = append(rs, agg.Sig.R)
		ss = append(ss, agg.Sig.S)
	}
	txData := generateTransaction(arg.Key, majority.Value, majority.Timestamp, uint8(majority.Status), vs, rs, ss)
	w.Header().Set("Content-Type", "application/json")

	logWithTimestamp(
		requestLog,
		fmt.Sprintf("Result,%s,%s,%d", majority.Value.Hex(), majority.Status, majority.Timestamp),
	)
	if arg.Broadcast {
		txHash, err := eth.SendTransaction(arg.Dataset, txData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		logWithTimestamp(requestLog, fmt.Sprintf("Broadcast,%s", txHash.Hex()))
		json.NewEncoder(w).Encode(ResponseTxHashObject{
			TxHash:          txHash,
			ProviderReports: responses,
		})
	} else {
		json.NewEncoder(w).Encode(ResponseTxObject{
			To:              arg.Dataset,
			Data:            "0x" + hex.EncodeToString(txData),
			ProviderReports: responses,
		})
	}
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

	viper.SetConfigName(os.Args[1])
	viper.AddConfigPath(".")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("Unable to locate config file (coord.yaml)")
	}

	privateKey = viper.GetString("privateKey")
	ethRpc = viper.GetString("ethRpc")
	port = viper.GetString("port")
	queryDebug = viper.GetBool("queryDebug")

	rootCmd.PersistentFlags().StringVar(&port, "port", port, `port of your app, for example "5000"`)
	rootCmd.PersistentFlags().StringVar(&ethRpc, "ethRpc", ethRpc, `Ethereum rcp url, for example "https://kovan.infura.io"`)
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

	fmt.Println("start coordinator node with these following parameters")
	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"Parameter Name", "Value"})
	table.Append([]string{"port", port})
	table.Append([]string{"ethRpc", ethRpc})
	table.Append([]string{"debug", strconv.FormatBool(queryDebug)})
	table.Render()

	http.HandleFunc("/", handleRequest)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
