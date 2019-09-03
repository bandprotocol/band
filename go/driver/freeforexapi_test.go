package driver

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

func TestFreeForexApiGoldSuccess(t *testing.T) {
	resolver := &FreeForexApi{}
	price, err := resolver.QuerySpotPrice("XAU")
	if err != nil {
		t.Errorf("Query XAU error: %s", err)
	}

	if price <= 1000 || price > 10000 {
		t.Errorf("Query XAU price is way off: %f", price)
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

func TestFreeForexApiQueryToQuerySpotPrice(t *testing.T) {
	resolver := &FreeForexApi{}
	output := resolver.Query([]byte("SPOTPX/EUR-USD"))
	if output.Option != OK {
		t.Errorf("Query EUR-USD error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(1)) == -1 || priceBig.Cmp(PriceToBigInt(2)) == 1 {
		t.Errorf("Query EUR-USD price is way off: %s", priceBig.String())
	}
}

func TestFreeForexApiQueryInvalidFunction(t *testing.T) {
	resolver := &FreeForexApi{}
	output := resolver.Query([]byte("REALPRICE/EUR-USD"))
	if output.Option == OK {
		t.Errorf("Query REALPRICE/EUR-USD must contain error. See nothing")
	}
}
