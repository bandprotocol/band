package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type EplSport struct{}

var eplCodename = make(map[string](string))

func init() {
	eplCodename["ARS"] = "Arsenal"
	eplCodename["BOU"] = "Bournemouth"
	eplCodename["BHA"] = "Brighton"
	eplCodename["BUR"] = "Burnley"
	eplCodename["CAR"] = "Cardiff"
	eplCodename["CHE"] = "Chelsea"
	eplCodename["CRY"] = "Crystal Palace"
	eplCodename["EVE"] = "Everton"
	eplCodename["FUL"] = "Fulham"
	eplCodename["HUD"] = "Huddersfield Town"
	eplCodename["LEI"] = "Leicester"
	eplCodename["LIV"] = "Liverpool"
	eplCodename["MNC"] = "Man City"
	eplCodename["MAN"] = "Man United"
	eplCodename["NEW"] = "Newcastle"
	eplCodename["SOU"] = "Southampton"
	eplCodename["TOT"] = "Tottenham"
	eplCodename["WAT"] = "Watford"
	eplCodename["WHU"] = "West Ham"
	eplCodename["WOL"] = "Wolves"
	eplCodename["NOR"] = "Norwich"
	eplCodename["SHFU"] = "Sheffield United"
	eplCodename["AVL"] = "Aston Villa"

}

func (*EplSport) Configure(*viper.Viper) {}

func (*EplSport) QueryEplSportScore(date string, shortName string) ([]int, error) {
	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("epl symbol %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString("https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=4328")

	var client = &http.Client{}

	res, err := client.Get(url.String())
	if err != nil {
		return []int{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return []int{}, err
	}
	events := gjson.GetBytes(body, "events")
	for _, rawEvent := range events.Array() {
		dateEvent := rawEvent.Get("dateEvent").String()
		compareDate := strings.Replace(dateEvent, "-", "", -1)

		if compareDate == date &&
			rawEvent.Get("strHomeTeam").String() == eplCodename[pairs[0]] &&
			rawEvent.Get("strAwayTeam").String() == eplCodename[pairs[1]] {
			return []int{int(rawEvent.Get("intHomeScore").Int()), int(rawEvent.Get("intAwayScore").Int())}, nil
		}
	}
	return []int{}, fmt.Errorf("QueryEplScore: Not found")
}

func (e *EplSport) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 3 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "EPL" {
		value, err := e.QueryEplSportScore(keys[1], keys[2])
		if err != nil {
			return common.Hash{}, err
		}
		result := common.Hash{}
		result[0] = byte(value[0])
		result[1] = byte(value[1])

		return result, nil
	}
	return common.Hash{}, fmt.Errorf("Doesn't supported %s query", keys[0])
}
