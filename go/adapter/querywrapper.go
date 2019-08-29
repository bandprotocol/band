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

func DoQuery(adapter *Adapter, key []byte) (common.Hash, error) {
	var adapterName string
	if t := reflect.TypeOf(adapter); t.Kind() == reflect.Ptr {
		adapterName = t.Elem().Name()
	} else {
		adapterName = t.Name()
	}

	val, err := (*adapter).Query(key)

	if err == nil {
		logDebug(
			fmt.Sprintf("Market:%s, ReportData:%s", adapterName, val.Big().String()),
		)
	} else {
		logDebug(
			fmt.Sprintf("Market:%s, Error:%s", adapterName, err.Error()),
		)
	}
	return val, err
}
