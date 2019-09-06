package driver

import (
	"math/big"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type MockDriver struct {
	values map[string]common.Hash
}

func (adpt *MockDriver) Configure(*viper.Viper) {}

func (adpt *MockDriver) Set(key string, rawValue string) {
	v := big.NewInt(0)
	v.SetString(rawValue, 10)
	adpt.values[key] = common.BigToHash(v)
}

func (adpt *MockDriver) Query(key []byte) dt.Answer {
	if v, ok := adpt.values[string(key)]; ok {
		return dt.Answer{
			Option: dt.Answered,
			Value:  v,
		}
	}
	return dt.NotFoundAnswer
}
