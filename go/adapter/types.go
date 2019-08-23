package adapter

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

type Adapter interface {
	Query([]byte) (common.Hash, error)
}

type MockAdapter struct{}

func (*MockAdapter) Query([]byte) (common.Hash, error) {
	return common.BigToHash(big.NewInt(100)), nil
}
