package driver

import (
	"math/big"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type AggMajority struct {
	children []Driver
}

func (adpt *AggMajority) Configure(config *viper.Viper) {
	children := config.GetStringMap("children")
	for name := range children {
		adpt.children = append(adpt.children, FromConfigIndividual(config.Sub("children."+name)))
	}
}

func Majority(values []*big.Int) (*big.Int, dt.QueryStatus) {
	// sort.Slice(values, func(i, j int) bool {
	// 	return values[i].Cmp(values[j]) <= 0
	// })
	// if len(values)%2 == 0 {
	// 	result := big.NewInt(0)
	// 	return result.Add(values[len(values)/2-1], values[len(values)/2]).Div(result, big.NewInt(2))
	// } else {
	// 	return values[len(values)/2]
	// }
	return big.NewInt(0), dt.OK
}

func (agg *AggMajority) Query(key []byte) dt.Answer {
	ch := make(chan dt.Answer)
	for _, child := range agg.children {
		go func(child Driver) {
			ch <- DoQuery(child, key)
		}(child)
	}

	var values []*big.Int
	for i := 0; i < len(agg.children); i++ {
		r := <-ch
		if r.Option == dt.Answered {
			values = append(values, r.Value.Big())
		}
	}

	if len(values) == 0 {
		return dt.NotFoundAnswer
	}

	return dt.Answer{
		Option: dt.Answered,
		Value:  common.BigToHash(Median(values)),
	}
}
