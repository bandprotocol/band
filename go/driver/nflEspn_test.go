package driver

import (
	"testing"
)

func TestNflEspnSuccess(t *testing.T) {
	resolver := &NflEspn{}
	score, err := resolver.QueryNflScore("20190829", "NYJ-PHI")
	if err != nil {
		t.Errorf("Query NYJ-PHI error: %s", err)
	}
	if score[0] != 6 && score[1] != 0 {
		t.Errorf("Wrong result")
	}
}

func TestNflEspnFail(t *testing.T) {
	resolver := &NflEspn{}
	_, err := resolver.QueryNflScore("20190829", "PHI-NYJ")
	if err == nil {
		t.Errorf("Query NYJ-PHI error: %s", err)
	}
}

func TestNflEspnSuccessHash(t *testing.T) {
	resolver := &NflEspn{}
	hash, err := resolver.Query([]byte("NFL/20190829/NYJ-PHI"))
	if err != nil {
		t.Errorf("Query NFL error: %s", err)
	}
	if hash.Hex() != "0x0600000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
