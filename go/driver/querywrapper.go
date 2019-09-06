package driver

import (
	"fmt"
	"log"
	"reflect"

	"github.com/bandprotocol/band/go/dt"
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

func DoQuery(driver Driver, key []byte) dt.Answer {
	var driverName string
	if t := reflect.TypeOf(driver); t.Kind() == reflect.Ptr {
		driverName = t.Elem().Name()
	} else {
		driverName = t.Name()
	}

	val := driver.Query(key)

	var queryResult string
	if val.Option == dt.Answered {
		queryResult = val.Value.Big().String()
	} else if val.Option == dt.Delegated {
		queryResult = "Delegated to " + val.Value.Hex()
	} else {
		queryResult = val.Option.String()
	}
	logDebug(
		fmt.Sprintf("|%-25s|%-45s|\n", driverName, queryResult),
	)
	return val
}
