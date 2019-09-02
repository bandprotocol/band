package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type EplEspn struct{}

var esplCodeName = make(map[string]([]string))

func init() {
	esplCodeName["ARS"] = []string{"ARS"}
	esplCodeName["BOU"] = []string{"BOU"}
	esplCodeName["BHA"] = []string{"BHA"}
	esplCodeName["BUR"] = []string{"BUR"}
	esplCodeName["CAR"] = []string{"CAR"}
	esplCodeName["BHA"] = []string{"BHA"}
	esplCodeName["CHE"] = []string{"CHE"}
	esplCodeName["CRY"] = []string{"CRY", "CRP"}
	esplCodeName["EVE"] = []string{"EVE"}
	esplCodeName["FUL"] = []string{"FUL"}
	esplCodeName["HUD"] = []string{"HUD"}
	esplCodeName["LEI"] = []string{"LEI"}
	esplCodeName["LIV"] = []string{"LIV"}
	esplCodeName["MNC"] = []string{"MNC"}
	esplCodeName["MAN"] = []string{"MAN"}
	esplCodeName["NEW"] = []string{"NEW"}
	esplCodeName["SOU"] = []string{"SOU", "SOUT"}
	esplCodeName["TOT"] = []string{"TOT"}
	esplCodeName["WAT"] = []string{"WAT"}
	esplCodeName["WHU"] = []string{"WHU"}
	esplCodeName["WOL"] = []string{"WOL", "WOLV"}
	esplCodeName["NOR"] = []string{"NOR"}
	esplCodeName["SHFU"] = []string{"SHFU", "SHU"}
	esplCodeName["AVL"] = []string{"AVL", "AST"}

}

func (*EplEspn) Configure(*viper.Viper) {}

func contain(arr []string, str string) bool {
	for _, i := range arr {
		if i == str {
			return true
		}
	}
	return false
}

func (*EplEspn) QueryEplScore(date string, shortName string) ([]int, error) {
	var league_code = "eng.1"
	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("epl symbol %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString("http://site.api.espn.com/apis/site/v2/sports/soccer/")
	url.WriteString(league_code)
	url.WriteString("/scoreboard?dates=")
	url.WriteString(date)

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
	events := gjson.GetBytes(body, "events.#.shortName")
	for i, rawEvent := range events.Array() {
		event := rawEvent.String()

		name := strings.Replace(event, " ", "", -1)
		teams := strings.Split(name, "@")

		if contain(esplCodeName[pairs[0]], teams[0]) &&
			contain(esplCodeName[pairs[1]], teams[1]) {
			scores := gjson.GetBytes(body,
				"events."+strconv.Itoa(i)+".competitions.0.competitors.#.score").Array()
			return []int{int(scores[0].Int()), int(scores[1].Int())}, nil
		}

	}
	return []int{}, fmt.Errorf("QueryEplScore: Not found")
}

func (e *EplEspn) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 3 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "EPL" {
		value, err := e.QueryEplScore(keys[1], keys[2])
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
