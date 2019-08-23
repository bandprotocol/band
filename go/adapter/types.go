package adapter

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

type Adapter interface {
	Query([]byte) (common.Hash, error)
}

type MockAdapter struct{}

func PriceToBigInt(price float64) *big.Int {
	bigval := new(big.Float)
	bigval.SetFloat64(price)

	multiplier := new(big.Float)
	multiplier.SetInt(big.NewInt(1000000000000000000))
	bigval.Mul(bigval, multiplier)

	result := new(big.Int)
	bigval.Int(result)

	return result
}

func (*MockAdapter) Query([]byte) (common.Hash, error) {
	return common.BigToHash(big.NewInt(100)), nil
}
