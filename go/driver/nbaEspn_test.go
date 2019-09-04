package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestNbaEspnSuccess(t *testing.T) {
	resolver := &NbaEspn{}
	score, err := resolver.QueryNbaScore("20180110", "CHA-DAL")
	if err != nil {
		t.Errorf("Query CHA-DAL error: %s", err)
	}
	if score[0] != 111 && score[1] != 115 {
		t.Errorf("Wrong result")
	}
}

func TestNbaEspnFail(t *testing.T) {
	resolver := &NbaEspn{}
	_, err := resolver.QueryNbaScore("20180110", "ARS-TOT")
	if err == nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
}

func TestNbaEspnSuccessHash(t *testing.T) {
	resolver := &NbaEspn{}
	output := resolver.Query([]byte("NBA/20180110/CHA-DAL"))
	if output.Option != dt.Answered {
		t.Errorf("Query NBA error: %s", output.Option)
	}
	if output.Value.Hex() != "0x6f73000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
