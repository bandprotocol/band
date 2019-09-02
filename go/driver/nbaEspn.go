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

func containNba(arr []string, str string) bool {
	for _, i := range arr {
		if i == str {
			return true
		}
	}
	return false
}

func (*NbaEspn) Configure(*viper.Viper) {}

func (*NbaEspn) QueryNbaScore(date string, shortName string) ([]int, error) {

	pairs := strings.Split(shortName, "-")
	if len(pairs) != 2 {
		return []int{}, fmt.Errorf("nba team %s is not valid", shortName)
	}
	var url strings.Builder
	url.WriteString("http://data.nba.net/prod/v2/")
	url.WriteString(date)
	url.WriteString("/scoreboard.json")

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
	games := gjson.GetBytes(body, "games").Array()
	if len(games) == 0 {
		return []int{}, fmt.Errorf("QueryNbaScore: There is no NBA match today.")
	}
	hTeam := gjson.GetBytes(body, "games.#.hTeam.triCode").Array()
	for i, homeTeamName := range hTeam {
		if containNba(nbaEspnCodeName[pairs[0]], homeTeamName.Str) {
			homeScore := gjson.GetBytes(body, "games."+strconv.Itoa(i)+".hTeam.score")
			awayScore := gjson.GetBytes(body, "games."+strconv.Itoa(i)+".vTeam.score")
			return []int{int(homeScore.Int()), int(awayScore.Int())}, nil
		}
	}
	return []int{}, fmt.Errorf("QueryEplScore: Not found")
}

func (n *NbaEspn) Query(key []byte) (common.Hash, error) {
	keys := strings.Split(string(key), "/")
	if len(keys) != 3 {
		return common.Hash{}, fmt.Errorf("Invalid key format")
	}
	if keys[0] == "NBA" {
		value, err := n.QueryNbaScore(keys[1], keys[2])
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
