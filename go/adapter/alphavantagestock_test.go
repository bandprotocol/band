package adapter

import (
	"testing"
)

func TestAlphaVantageStockSuccess(t *testing.T) {
	resolver := &AlphaVantageStock{}
	price, err := resolver.QuerySpotPrice("FB")
	if err != nil {
		t.Errorf("Query FB error: %s", err)
	}

	if price <= 100 || price > 1000 {
		t.Errorf("Query FB price is way off: %f", price)
	}
}

func TestAlphaVantageStockInvalidSymbolFormat(t *testing.T) {
	resolver := &AlphaVantageStock{}
	_, err := resolver.QuerySpotPrice("FB-USD")
	if err == nil {
		t.Errorf("Query USD must contain error. See nothing")
	}
}

func TestAlphaVantageStockUnknownSymbol(t *testing.T) {
	resolver := &AlphaVantageStock{}
	_, err := resolver.QuerySpotPrice("FD")
	if err == nil {
		t.Errorf("Query BTH-USD must contain error. See nothing")
	}
}
