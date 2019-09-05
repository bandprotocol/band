package driver

import (
	"log"
	"regexp"

	"github.com/bandprotocol/band/go/dt"
	"github.com/spf13/viper"
)

type RegEx struct {
	children map[*regexp.Regexp]Driver
}

func (adpt *RegEx) Configure(config *viper.Viper) {
	children := config.GetStringMap("children")
	adpt.children = map[*regexp.Regexp]Driver{}
	for name := range children {
		subConfig := config.Sub("children." + name)
		r, err := regexp.Compile(subConfig.GetString("match"))
		if err != nil {
			log.Fatal(err.Error())
		}
		adpt.children[r] = FromConfigIndividual(subConfig.Sub("driver"))
	}
}

func (regs *RegEx) Query(key []byte) dt.Answer {
	for reg, child := range regs.children {
		if reg.MatchString(string(key)) {
			return DoQuery(child, key)
		}
	}
	return dt.NotFoundAnswer
}
