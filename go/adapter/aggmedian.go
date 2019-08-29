package adapter

import (
	"errors"
	"fmt"
	"log"
	"math/big"
	"os"
	"reflect"
	"sort"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type AggMedian struct {
	children []Adapter
}

type AdapterReportInfo struct {
	AdapterName string
	Error       error
	ReportData  common.Hash
}

var debug bool

func init() {
	debug = strings.ToLower(os.Getenv("DEBUG")) == "true"
}

func logDebug(s string) {
	if debug {
		log.Println(s)
	}
}

func (adpt *AggMedian) Configure(config *viper.Viper) {
	children := config.GetStringMap("children")
	for name := range children {
		adpt.children = append(adpt.children, FromConfigIndividual(config.Sub("children."+name)))
	}
}

func Median(values []*big.Int) *big.Int {
	sort.Slice(values, func(i, j int) bool {
		return values[i].Cmp(values[j]) <= 0
	})
	if len(values)%2 == 0 {
		result := big.NewInt(0)
		return result.Add(values[len(values)/2-1], values[len(values)/2]).Div(result, big.NewInt(2))
	} else {
		return values[len(values)/2]
	}
}

func (agg *AggMedian) Query(key []byte) (common.Hash, error) {
	ch := make(chan AdapterReportInfo)
	for _, child := range agg.children {
		go func(child Adapter) {
			ari := AdapterReportInfo{}
			if t := reflect.TypeOf(child); t.Kind() == reflect.Ptr {
				ari.AdapterName = t.Elem().Name()
			} else {
				ari.AdapterName = t.Name()
			}
			val, err := child.Query(key)
			ari.Error = err
			ari.ReportData = val
			ch <- ari
		}(child)
	}

	var values []*big.Int
	for i := 0; i < len(agg.children); i++ {
		r := <-ch
		if r.Error == nil {
			values = append(values, r.ReportData.Big())
			logDebug(
				fmt.Sprintf("Market:%s, ReportData:%s", r.AdapterName, r.ReportData.Big().String()),
			)
		} else {
			logDebug(
				fmt.Sprintf("Market:%s, Error:%s", r.AdapterName, r.Error),
			)
		}
	}

	if len(values) == 0 {
		return common.Hash{}, errors.New("aggmedian: all children return error")
	}

	return common.BigToHash(Median(values)), nil
}
