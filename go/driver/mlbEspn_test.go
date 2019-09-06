package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestMlbEspnSuccess(t *testing.T) {
	resolver := &MlbEspn{}
	score, err := resolver.QueryMlbScore("20190901", "STL-CIN", "2")
	if err != nil {
		t.Errorf("Query STL-CIN error: %s", err)
	}
	if score[0] != 3 && score[1] != 5 {
		t.Errorf("Wrong result")
	}
}

func TestMblEspnFail(t *testing.T) {
	resolver := &MlbEspn{}
	_, err := resolver.QueryMlbScore("20190901", "CIN-STL", "1")
	if err == nil {
		t.Errorf("Query CIN-STL error: %s", err)
	}
}

func TestMblEspnSuccessHash(t *testing.T) {
	resolver := &MlbEspn{}
	output := resolver.Query([]byte("MLB/20190901/STL-CIN/2"))
	if output.Option != dt.Answered {
		t.Errorf("Query Mbl error: %s", output.Option)
	}
	if output.Value.Hex() != "0x0305000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
