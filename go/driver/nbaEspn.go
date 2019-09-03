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

type NbaEspn struct{}

var nbaEspnCodeName = make(map[string]([]string))

func init() {
	nbaEspnCodeName["ATL"] = []string{"ATL"}
	nbaEspnCodeName["BOS"] = []string{"BOS"}
	nbaEspnCodeName["BKN"] = []string{"BKN"}
	nbaEspnCodeName["CHA"] = []string{"CHA"}
	nbaEspnCodeName["CHI"] = []string{"CHI"}
	nbaEspnCodeName["CLE"] = []string{"CLE"}
	nbaEspnCodeName["DAL"] = []string{"DAL"}
	nbaEspnCodeName["DEN"] = []string{"DEN"}
	nbaEspnCodeName["DET"] = []string{"DET"}
	nbaEspnCodeName["GSW"] = []string{"GSW", "GS"}
	nbaEspnCodeName["HOD"] = []string{"HOD"}
	nbaEspnCodeName["IND"] = []string{"IND"}
	nbaEspnCodeName["LAC"] = []string{"LAC"}
	nbaEspnCodeName["LAL"] = []string{"LAL"}
	nbaEspnCodeName["MEM"] = []string{"MEM"}
	nbaEspnCodeName["MIA"] = []string{"MIA"}
	nbaEspnCodeName["MIL"] = []string{"MIL"}
	nbaEspnCodeName["MIN"] = []string{"MIN"}
	nbaEspnCodeName["NOP"] = []string{"NOP", "NO"}
	nbaEspnCodeName["NYK"] = []string{"NYK", "NY"}
	nbaEspnCodeName["OKC"] = []string{"OKC"}
	nbaEspnCodeName["ORL"] = []string{"ORL"}
	nbaEspnCodeName["PHI"] = []string{"PHI"}
	nbaEspnCodeName["PHX"] = []string{"PHX"}
	nbaEspnCodeName["POR"] = []string{"POR"}
	nbaEspnCodeName["SAC"] = []string{"SAC"}
	nbaEspnCodeName["SAS"] = []string{"SAS", "SA"}
	nbaEspnCodeName["TOR"] = []string{"TOR"}
	nbaEspnCodeName["UTA"] = []string{"UTA", "UTAH"}
	nbaEspnCodeName["WAS"] = []string{"WAS", "WSH"}

}

func (*NbaEspn) Configure(*viper.Viper) {}

func (*NbaEspn) QueryNbaScore(date string, shortName string) ([]int, error) {
	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("nba name team %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard")
	url.WriteString("?dates=")
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

		if contain(nbaEspnCodeName[pairs[0]], teams[1]) &&
			contain(nbaEspnCodeName[pairs[1]], teams[0]) {
			scores := gjson.GetBytes(body,
				"events."+strconv.Itoa(i)+".competitions.0.competitors.#.score").Array()
			return []int{int(scores[0].Int()), int(scores[1].Int())}, nil
		}

	}
	return []int{}, fmt.Errorf("QueryNbaEspnScore: Not found")
}

func (e *NbaEspn) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 3 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "NBA" {
		value, err := e.QueryNbaScore(keys[1], keys[2])
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
