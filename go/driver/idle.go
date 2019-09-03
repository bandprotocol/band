package driver

import "github.com/spf13/viper"

type IdleDriver struct{}

func (*IdleDriver) Configure(*viper.Viper) {}

func (*IdleDriver) Query(key []byte) Answer {
	return NotFoundAnswer
}
