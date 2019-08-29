package adapter

import (
	"fmt"
	"log"
	"os"
	"reflect"
	"strings"

	"github.com/ethereum/go-ethereum/common"
)

var debug bool

func init() {
	debug = strings.ToLower(os.Getenv("DEBUG")) == "true"
}

func logDebug(s string) {
	if debug {
		log.Println(s)
	}
}

func DoQuery(adapter Adapter, key []byte) (common.Hash, error) {
	var adapterName string
	if t := reflect.TypeOf(adapter); t.Kind() == reflect.Ptr {
		adapterName = t.Elem().Name()
	} else {
		adapterName = t.Name()
	}

	val, err := adapter.Query(key)

	var queryResult string
	if err == nil {
		queryResult = val.Big().String()
	} else {
		queryResult = err.Error()
	}
	logDebug(
		fmt.Sprintf("|%-25s|%-45s|\n", adapterName, queryResult),
	)
	return val, err
}
