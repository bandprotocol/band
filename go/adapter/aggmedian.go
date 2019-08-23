package adapter

import (
	"errors"
	"math/big"
	"sort"

	"github.com/ethereum/go-ethereum/common"
)

type AggMedian struct {
	children []Adapter
}

func (agg *AggMedian) Initialize() {
	agg.children = append(agg.children, &MockAdapter{})
}

func (agg *AggMedian) Query(key []byte) (common.Hash, error) {
	var values []*big.Int
	for _, child := range agg.children {
		val, err := child.Query(key)
		if err == nil {
			values = append(values, val.Big())
		}
	}
	if len(values) == 0 {
		return common.Hash{}, errors.New("aggmedian: all children return error")
	}
	sort.Slice(values, func(i, j int) bool {
		return values[i].Cmp(values[j]) <= 0
	})
	if len(values)%2 == 0 {
		sum := big.NewInt(0)
		sum = sum.Add(sum, values[len(values)/2-1])
		sum = sum.Add(sum, values[len(values)/2])
		return common.BigToHash(sum.Div(sum, big.NewInt(2))), nil
	} else {
		return common.BigToHash(values[len(values)/2]), nil
	}
}
