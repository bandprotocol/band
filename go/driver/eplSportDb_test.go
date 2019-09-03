package driver

import (
	"fmt"
	"testing"
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
	hash, err := resolver.Query([]byte("EPL/20190901/ARS-TOT"))
	if err != nil {
		t.Errorf("Query EPLSport error: %s", err)
	}
	fmt.Println(hash.Hex())
	if hash.Hex() != "0x0202000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
