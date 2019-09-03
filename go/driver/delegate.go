package driver

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type DelegateDriver struct {
	delegator common.Address
}

func (dd *DelegateDriver) Configure(config *viper.Viper) {
	dd.delegator = common.HexToAddress(config.GetString("delegator"))
}

func (dd *DelegateDriver) Query(key []byte) Answer {
	return Answer{
		Option: Delegated,
		Value:  dd.delegator.Hash(),
	}
}
