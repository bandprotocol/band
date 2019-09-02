package driver

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

func TestAlphaVantageStockQueryToQuerySpotPrice(t *testing.T) {
	resolver := &AlphaVantageStock{}
	output := resolver.Query([]byte("SPOTPX/GOOG"))
	if output.Option != "OK" {
		t.Errorf("Query GOOG error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(500)) == -1 || priceBig.Cmp(PriceToBigInt(2000)) == 1 {
		t.Errorf("Query GOOG price is way off: %s", priceBig.String())
	}
}

func TestAlphaVantageStockQueryInvalidFunction(t *testing.T) {
	resolver := &AlphaVantageStock{}
	output := resolver.Query([]byte("REALPRICE/GOOG"))
	if output.Option == "OK" {
		t.Errorf("Query REALPRICE/GOOG must contain error. See nothing")
	}
}
