package driver

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

func DoQuery(driver Driver, key []byte) (common.Hash, error) {
	var driverName string
	if t := reflect.TypeOf(driver); t.Kind() == reflect.Ptr {
		driverName = t.Elem().Name()
	} else {
		driverName = t.Name()
	}

	val, err := driver.Query(key)

	var queryResult string
	if err == nil {
		queryResult = val.Big().String()
	} else {
		queryResult = err.Error()
	}
	logDebug(
		fmt.Sprintf("|%-25s|%-45s|\n", driverName, queryResult),
	)
	return val, err
}
