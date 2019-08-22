package adapter

import (
	"testing"
)

func TestCurrencyConverterSuccess(t *testing.T) {
	resolver := &CurrencyConverter{}
	price, err := resolver.QuerySpotPrice("EUR-USD")
	if err != nil {
		t.Errorf("Query EUR-USD error: %s", err)
	}

	if price <= 0 || price > 2 {
		t.Errorf("QueryEUR-USD price is way off: %f", price)
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
