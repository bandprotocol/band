package driver

import (
	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type DelegateDriver struct {
	delegator common.Address
}

func (dd *DelegateDriver) Configure(config *viper.Viper) {
	dd.delegator = common.HexToAddress(config.GetString("delegator"))
}

func (dd *DelegateDriver) Query(key []byte) dt.Answer {
	return dt.Answer{
		Option: dt.Delegated,
		Value:  dd.delegator.Hash(),
	}
}
