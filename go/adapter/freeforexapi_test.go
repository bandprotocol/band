package adapter

import (
	"testing"
)

func TestFreeForexApiSuccess(t *testing.T) {
	resolver := &FreeForexApi{}
	price, err := resolver.QuerySpotPrice("EUR-USD")
	if err != nil {
		t.Errorf("Query EUR-USD error: %s", err)
	}

	// EUR-USD ~ 1.1104
	if price <= 1 || price > 2 {
		t.Errorf("QueryEUR-USD price is way off: %f", price)
	}
}

func TestFreeForexApiInvalidSymbolFormat(t *testing.T) {
	resolver := &FreeForexApi{}
	_, err := resolver.QuerySpotPrice("USD")
	if err == nil {
		t.Errorf("Query USD must contain error. See nothing")
	}
}

func TestFreeForexApiUnknownSymbol(t *testing.T) {
	resolver := &FreeForexApi{}
	_, err := resolver.QuerySpotPrice("BTH-USD")
	if err == nil {
		t.Errorf("Query BTH-USD must contain error. See nothing")
	}
}
