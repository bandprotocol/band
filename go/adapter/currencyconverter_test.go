package driver

import (
	"testing"
)

func TestCurrencyConverterSuccess(t *testing.T) {
	resolver := &CurrencyConverter{}
	price, err := resolver.QuerySpotPrice("EUR-USD")
	if err != nil {
		t.Errorf("Query EUR-USD error: %s", err)
	}

	if price <= 1 || price > 2 {
		t.Errorf("QueryEUR-USD price is way off: %f", price)
	}
}
func TestCurrencyConverterGoldSuccess(t *testing.T) {
	resolver := &CurrencyConverter{}
	price, err := resolver.QuerySpotPrice("XAU")
	if err != nil {
		t.Errorf("Query XAU error: %s", err)
	}

	if price <= 1000 || price > 10000 {
		t.Errorf("Query XAU price is way off: %f", price)
	}
}
func TestCurrencyConverterInvalidSymbolFormat(t *testing.T) {
	resolver := &CurrencyConverter{}
	_, err := resolver.QuerySpotPrice("USD")
	if err == nil {
		t.Errorf("Query USD must contain error. See nothing")
	}
}

func TestCurrencyConverterUnknownSymbol(t *testing.T) {
	resolver := &CurrencyConverter{}
	_, err := resolver.QuerySpotPrice("BTH-USD")
	if err == nil {
		t.Errorf("Query BTH-USD must contain error. See nothing")
	}
}

func TestCurrencyConverterQueryToQuerySpotPrice(t *testing.T) {
	resolver := &CurrencyConverter{}
	price, err := resolver.Query([]byte("SPOTPX/EUR-USD"))
	if err != nil {
		t.Errorf("Query EUR-USD error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(1)) == -1 || priceBig.Cmp(PriceToBigInt(2)) == 1 {
		t.Errorf("Query EUR-USD price is way off: %s", priceBig.String())
	}
}

func TestCurrencyConverterQueryInvalidFunction(t *testing.T) {
	resolver := &CurrencyConverter{}
	_, err := resolver.Query([]byte("REALPRICE/EUR-USD"))
	if err == nil {
		t.Errorf("Query REALPRICE/EUR-USD must contain error. See nothing")
	}
}
