package adapter

import (
	"testing"
)

func TestWorldTradingDataSuccess(t *testing.T) {
	resolver := &WorldTradingData{}
	price, err := resolver.QuerySpotPrice("FB")
	if err != nil {
		t.Errorf("Query FB error: %s", err)
	}

	if price <= 100 || price > 1000 {
		t.Errorf("Query FB price is way off: %f", price)
	}
}

func TestWorldTradingDataInvalidSymbolFormat(t *testing.T) {
	resolver := &WorldTradingData{}
	_, err := resolver.QuerySpotPrice("FB-USD")
	if err == nil {
		t.Errorf("Query FB-USD must contain error. See nothing")
	}
}

func TestWorldTradingDataUnknownSymbol(t *testing.T) {
	resolver := &WorldTradingData{}
	_, err := resolver.QuerySpotPrice("FD")
	if err == nil {
		t.Errorf("Query FD must contain error. See nothing")
	}
}
