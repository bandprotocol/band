package adapter

import (
	"testing"
)

func TestFinancialModelPrepSuccess(t *testing.T) {
	resolver := &FinancialModelPrep{}
	price, err := resolver.QuerySpotPrice("FB")
	if err != nil {
		t.Errorf("Query FB error: %s", err)
	}

	if price <= 100 || price > 1000 {
		t.Errorf("Query FB price is way off: %f", price)
	}
}

func TestFinancialModelPrepInvalidSymbolFormat(t *testing.T) {
	resolver := &FinancialModelPrep{}
	_, err := resolver.QuerySpotPrice("FB-USD")
	if err == nil {
		t.Errorf("Query USD must contain error. See nothing")
	}
}

func TestFinancialModelPrepUnknownSymbol(t *testing.T) {
	resolver := &FinancialModelPrep{}
	_, err := resolver.QuerySpotPrice("FD")
	if err == nil {
		t.Errorf("Query BTH-USD must contain error. See nothing")
	}
}