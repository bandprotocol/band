package driver

import (
	"log"
	"regexp"
	"sort"
	"strconv"

	"github.com/bandprotocol/band/go/dt"
	"github.com/spf13/viper"
)

type regexGroup struct {
	regex    *regexp.Regexp
	driver   Driver
	priority int
}

type RegEx struct {
	children []regexGroup
}

func (drv *RegEx) Configure(config *viper.Viper) {
	children := config.GetStringMap("children")
	drv.children = make([]regexGroup, len(children))
	count := 0
	for name := range children {
		subConfig := config.Sub("children." + name)
		regex, err := regexp.Compile(subConfig.GetString("match"))
		if err != nil {
			log.Fatal(err.Error())
		}
		priority, err := strconv.Atoi(subConfig.GetString("priority"))
		if err != nil {
			log.Fatal(err.Error())
		}
		dv := FromConfigIndividual(subConfig.Sub("driver"))
		drv.children[count] = regexGroup{
			regex:    regex,
			driver:   dv,
			priority: priority,
		}
		count++
	}
	sort.Slice(drv.children, func(i, j int) bool {
		return drv.children[i].priority < drv.children[j].priority
	})
}

func (drv *RegEx) Query(key []byte) dt.Answer {
	for _, child := range drv.children {
		if child.regex.MatchString(string(key)) {
			return DoQuery(child.driver, key)
		}
	}
	return dt.NotFoundAnswer
}
