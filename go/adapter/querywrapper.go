package adapter

import (
	"fmt"
	"log"
	"reflect"

	"github.com/ethereum/go-ethereum/common"
)

var debug = false

func logDebug(s string) {
	if debug {
		log.Println(s)
	}
}

func TurnOnQueryDebugging() {
	debug = true
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
