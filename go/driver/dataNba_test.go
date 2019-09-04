package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestDataNbaSuccess(t *testing.T) {
	resolver := &DataNba{}
	score, err := resolver.QueryDataNbaScore("20180110", "CHA-DAL")
	if err != nil {
		t.Errorf("Query CHA-DAL error: %s", err)
	}
	if score[0] != 111 && score[1] != 115 {
		t.Errorf("Wrong result")
	}
}

func TestDataNbaFail(t *testing.T) {
	resolver := &DataNba{}
	_, err := resolver.QueryDataNbaScore("20180110", "DAL-CHA")
	if err == nil {
		t.Errorf("Query DAL-CHA error: %s", err)
	}
}

func TestDataNbaSuccessHash(t *testing.T) {
	resolver := &DataNba{}
	output := resolver.Query([]byte("NBA/20180110/CHA-DAL"))
	if output.Option != dt.Answered {
		t.Errorf("Query DataNba failed")
	}
	if output.Value.Hex() != "0x6f73000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
