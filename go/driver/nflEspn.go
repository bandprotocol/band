package driver

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"github.com/tidwall/gjson"
)

type NflEspn struct{}

var nflEspnCodeName = make(map[string]([]string))

func init() {
	nflEspnCodeName["ATL"] = []string{"ATL"}
	nflEspnCodeName["ARI"] = []string{"ARI"}
	nflEspnCodeName["BAL"] = []string{"BAL"}
	nflEspnCodeName["BUF"] = []string{"BUF"}
	nflEspnCodeName["CAR"] = []string{"CAR"}
	nflEspnCodeName["CHI"] = []string{"CHI"}
	nflEspnCodeName["CIN"] = []string{"CIN"}
	nflEspnCodeName["CLE"] = []string{"CLE"}
	nflEspnCodeName["DAL"] = []string{"DAL"}
	nflEspnCodeName["DEN"] = []string{"DEN"}
	nflEspnCodeName["DET"] = []string{"DET"}
	nflEspnCodeName["GB"] = []string{"GB"}
	nflEspnCodeName["HOU"] = []string{"HOU"}
	nflEspnCodeName["IND"] = []string{"IND"}
	nflEspnCodeName["JAC"] = []string{"JAC"}
	nflEspnCodeName["KC"] = []string{"KC"}
	nflEspnCodeName["LAC"] = []string{"LAC"}
	nflEspnCodeName["LAR"] = []string{"LAR", "LA"}
	nflEspnCodeName["MIA"] = []string{"MIA"}
	nflEspnCodeName["MIN"] = []string{"MIN"}
	nflEspnCodeName["NE"] = []string{"NE"}
	nflEspnCodeName["NO"] = []string{"NO"}
	nflEspnCodeName["NYG"] = []string{"NYG"}
	nflEspnCodeName["NYJ"] = []string{"NYJ"}
	nflEspnCodeName["OAK"] = []string{"OAK"}
	nflEspnCodeName["PHI"] = []string{"PHI"}
	nflEspnCodeName["PIT"] = []string{"PIT"}
	nflEspnCodeName["SF"] = []string{"SF"}
	nflEspnCodeName["SEA"] = []string{"SEA"}
	nflEspnCodeName["TB"] = []string{"TB"}
	nflEspnCodeName["TEN"] = []string{"TEN"}
	nflEspnCodeName["WAS"] = []string{"WAS"}
}

func (*NflEspn) Configure(*viper.Viper) {}

func (*NflEspn) QueryNflScore(date string, shortName string) ([]int, error) {

	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("nfl team %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString(
		"http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=")
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

		if contain(nflEspnCodeName[pairs[0]], teams[1]) &&
			contain(nflEspnCodeName[pairs[1]], teams[0]) {
			scores := gjson.GetBytes(body,
				"events."+strconv.Itoa(i)+".competitions.0.competitors.#.score").Array()
			return []int{int(scores[0].Int()), int(scores[1].Int())}, nil
		}
	}
	return []int{}, fmt.Errorf("QueryNflScore: Not found")
}

func (n *NflEspn) Query(key []byte) dt.Answer {
	keys := strings.Split(string(key), "/")
	if len(keys) != 3 {
		return dt.NotFoundAnswer
	}
	if keys[0] == "NFL" {
		value, err := n.QueryNflScore(keys[1], keys[2])
		if err != nil {
			return dt.NotFoundAnswer
		}
		result := common.Hash{}
		result[0] = byte(value[0])
		result[1] = byte(value[1])
		return dt.Answer{
			Option: dt.Answered,
			Value:  result,
		}
	}
	return dt.NotFoundAnswer
}
