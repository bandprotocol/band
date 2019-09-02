package driver

import (
	"fmt"
	"log"
	"reflect"
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

func DoQuery(driver Driver, key []byte) Answer {
	var driverName string
	if t := reflect.TypeOf(driver); t.Kind() == reflect.Ptr {
		driverName = t.Elem().Name()
	} else {
		driverName = t.Name()
	}

	val := driver.Query(key)

	var queryResult string
	if val.Option == "OK" {
		queryResult = val.Value.Big().String()
	} else if val.Option == "Deligated" {
		queryResult = "Delegate to " + val.Value.Hex()
	} else {
		queryResult = val.Option
	}
	logDebug(
		fmt.Sprintf("|%-25s|%-45s|\n", driverName, queryResult),
	)
	return val
}