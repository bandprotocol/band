package driver

import (
	"testing"
)

func TestDataNbaSuccess(t *testing.T) {
	resolver := &DataNbaEspn{}
	score, err := resolver.QueryDataNbaScore("20180110", "CHA-DAL")
	if err != nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
	if score[0] != 111 && score[1] != 115 {
		t.Errorf("Wrong result")
	}
}

func TestDataNbaFail(t *testing.T) {
	resolver := &DataNbaEspn{}
	_, err := resolver.QueryDataNbaScore("20180110", "DAL-CHA")
	if err == nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
}

func TestDataNbaSuccessHash(t *testing.T) {
	resolver := &DataNbaEspn{}
	hash, err := resolver.Query([]byte("NBA/20180110/CHA-DAL"))
	if err != nil {
		t.Errorf("Query DataNba error: %s", err)
	}
	if hash.Hex() != "0x6f73000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
