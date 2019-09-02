package driver

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

func TestFinancialModelPrepQueryToQuerySpotPrice(t *testing.T) {
	resolver := &FinancialModelPrep{}
	price, err := resolver.Query([]byte("SPOTPX/GOOG"))
	if err != nil {
		t.Errorf("Query GOOG error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(500)) == -1 || priceBig.Cmp(PriceToBigInt(2000)) == 1 {
		t.Errorf("Query GOOG price is way off: %s", priceBig.String())
	}
}

func TestFinancialModelPrepQueryInvalidFunction(t *testing.T) {
	resolver := &FinancialModelPrep{}
	_, err := resolver.Query([]byte("REALPRICE/GOOG"))
	if err == nil {
		t.Errorf("Query REALPRICE/GOOG must contain error. See nothing")
	}
}
