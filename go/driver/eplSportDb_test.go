package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestEplSportScoreSuccess(t *testing.T) {
	resolver := &EplSport{}
	score, err := resolver.QueryEplSportScore("20190901", "ARS-TOT")
	if err != nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
	if score[0] != 2 && score[1] != 2 {
		t.Errorf("Wrong result")
	}
}

func TestEplSportScoreFail(t *testing.T) {
	resolver := &EplSport{}
	_, err := resolver.QueryEplSportScore("20190831", "ARS-TOT")
	if err == nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
}

func TestEplSportSuccessHash(t *testing.T) {
	resolver := &EplSport{}
	output := resolver.Query([]byte("EPL/20190901/ARS-TOT"))
	if output.Option != dt.Answered {
		t.Errorf("Query EPLSport error: %s", output.Option)
	}
	if output.Value.Hex() != "0x0202000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
