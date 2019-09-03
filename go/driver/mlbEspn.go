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

type MlbEspn struct{}

var mlbEsplCodeName = make(map[string]([]string))

func init() {
	mlbEsplCodeName["ARI"] = []string{"ARI"}
	mlbEsplCodeName["ATL"] = []string{"ATL"}
	mlbEsplCodeName["BAL"] = []string{"BAL"}
	mlbEsplCodeName["BOS"] = []string{"BOS"}
	mlbEsplCodeName["CWS"] = []string{"CWS", "CHW"}
	mlbEsplCodeName["CIN"] = []string{"CIN"}
	mlbEsplCodeName["CLE"] = []string{"CLE"}
	mlbEsplCodeName["COL"] = []string{"COL"}
	mlbEsplCodeName["DET"] = []string{"DET"}
	mlbEsplCodeName["HOU"] = []string{"HOU"}
	mlbEsplCodeName["KC"] = []string{"KC"}
	mlbEsplCodeName["LAA"] = []string{"LAA"}
	mlbEsplCodeName["LAD"] = []string{"LAD"}
	mlbEsplCodeName["MIA"] = []string{"MIA"}
	mlbEsplCodeName["MIL"] = []string{"MIL"}
	mlbEsplCodeName["MIN"] = []string{"MIN"}
	mlbEsplCodeName["NYM"] = []string{"NYM"}
	mlbEsplCodeName["NYY"] = []string{"NYY"}
	mlbEsplCodeName["OAK"] = []string{"OAK"}
	mlbEsplCodeName["PHI"] = []string{"PHI"}
	mlbEsplCodeName["PIT"] = []string{"PIT"}
	mlbEsplCodeName["SD"] = []string{"SD"}
	mlbEsplCodeName["SF"] = []string{"SF"}
	mlbEsplCodeName["SEA"] = []string{"SEA"}
	mlbEsplCodeName["STL"] = []string{"STL"}
	mlbEsplCodeName["TB"] = []string{"TB"}
	mlbEsplCodeName["TEX"] = []string{"TEX"}
	mlbEsplCodeName["TOR"] = []string{"TOR"}
	mlbEsplCodeName["WSH"] = []string{"WSH"}
}

func (*MlbEspn) Configure(*viper.Viper) {}

func (*MlbEspn) QueryMlbScore(date string, shortName string, round string) ([]int, error) {
	countRound := 1
	rountInt, err := strconv.Atoi(round)
	if err != nil {
		return []int{}, err
	}
	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("mlb symbol %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString("http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard")
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

		if contain(mlbEsplCodeName[pairs[0]], teams[1]) &&
			contain(mlbEsplCodeName[pairs[1]], teams[0]) {
			if countRound == rountInt {
				scores := gjson.GetBytes(body,
					"events."+strconv.Itoa(i)+".competitions.0.competitors.#.score").Array()
				return []int{int(scores[0].Int()), int(scores[1].Int())}, nil
			}
			countRound++
		}
	}
	return []int{}, fmt.Errorf("QueryMlbScore: Not found")
}

func (e *MlbEspn) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 4 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "MLB" {
		value, err := e.QueryMlbScore(keys[1], keys[2], keys[3])
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
