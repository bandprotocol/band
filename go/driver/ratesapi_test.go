package driver

import (
	"testing"
)

func TestRatesapiSuccess(t *testing.T) {
	resolver := &Ratesapi{}
	price, err := resolver.QuerySpotPrice("EUR-USD")
	if err != nil {
		t.Errorf("Query EUR-USD error: %s", err)
	}

	if price <= 0 || price > 2 {
		t.Errorf("QueryEUR-USD price is way off: %f", price)
	}
}

func TestRatesapiInvalidSymbolFormat(t *testing.T) {
	resolver := &Ratesapi{}
	_, err := resolver.QuerySpotPrice("USD")
	if err == nil {
		t.Errorf("Query USD must contain error. See nothing")
	}
}

func TestRatesapiUnknownSymbol(t *testing.T) {
	resolver := &Ratesapi{}
	_, err := resolver.QuerySpotPrice("BTH-USD")
	if err == nil {
		t.Errorf("Query BTH-USD must contain error. See nothing")
	}
}

func TestRatesapiQueryToQuerySpotPrice(t *testing.T) {
	resolver := &Ratesapi{}
	output := resolver.Query([]byte("SPOTPX/EUR-USD"))
	if output.Option != "OK" {
		t.Errorf("Query EUR-USD error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(1)) == -1 || priceBig.Cmp(PriceToBigInt(2)) == 1 {
		t.Errorf("Query EUR-USD price is way off: %s", priceBig.String())
	}
}

func TestRatesapiQueryInvalidFunction(t *testing.T) {
	resolver := &Ratesapi{}
	output := resolver.Query([]byte("REALPRICE/EUR-USD"))
	if output.Option == "OK" {
		t.Errorf("Query REALPRICE/EUR-USD must contain error. See nothing")
	}
}
