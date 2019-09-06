package driver

import (
	"github.com/bandprotocol/band/go/dt"
	"github.com/spf13/viper"
)

type IdleDriver struct{}

func (*IdleDriver) Configure(*viper.Viper) {}

func (*IdleDriver) Query(key []byte) dt.Answer {
	return dt.NotFoundAnswer
}
