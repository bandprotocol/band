package driver

import (
	"fmt"
	"math/big"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type AggMajority struct {
	children []Driver
}

func (aggmajority *AggMajority) Configure(config *viper.Viper) {
	children := config.GetStringMap("children")
	for name := range children {
		aggmajority.children = append(aggmajority.children, FromConfigIndividual(config.Sub("children."+name)))
	}
}

func Majority(values []*big.Int) (*big.Int, int, error) {
	counter := make(map[string]int)
	for _, value := range values {
		counter[string(value.Bytes())]++
	}

	var majority string
	maxCount := 0
	maxEqual := true
	for key, value := range counter {
		if value > maxCount {
			majority = key
			maxCount = value
			maxEqual = false
		} else if value == maxCount {
			maxEqual = true
		}
	}
	if maxEqual {
		return big.NewInt(0), 0, fmt.Errorf("Majority: Majority more than 1 value")
	}
	answer := big.NewInt(0)
	return answer.SetBytes(([]byte)(majority)), maxCount, nil
}

func (aggmajority *AggMajority) Query(key []byte) dt.Answer {
	ch := make(chan dt.Answer)
	for _, child := range aggmajority.children {
		go func(child Driver) {
			ch <- DoQuery(child, key)
		}(child)
	}

	var values []*big.Int
	for i := 0; i < len(aggmajority.children); i++ {
		r := <-ch
		if r.Option == dt.Answered {
			values = append(values, r.Value.Big())
		}
	}
	if len(values) == 0 {
		return dt.NotFoundAnswer
	}

	value, _, err := Majority(values)

	if err != nil {
		return dt.NotFoundAnswer
	}

	return dt.Answer{
		Option: dt.Answered,
		Value:  common.BigToHash(value),
	}
}
