package adapter

import (
	"testing"
)

func TestSuccess_Bancor(t *testing.T) {
	resolver := &Bancor{}
	price, err := resolver.QuerySpotPrice("ETH-USD")
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	if price < 50 || price > 1000 {
		t.Errorf("Query ETH-USD price is way off: %f", price)
	}
}

func TestInvalidSymbolFormat_Bancor(t *testing.T) {
	resolver := &Bancor{}
	_, err := resolver.QuerySpotPrice("ETH")
	if err == nil {
		t.Errorf("Query ETH must contain error. See nothing")
	}
}

func TestUnknownSymbol_Bancor(t *testing.T) {
	resolver := &Bancor{}
	_, err := resolver.QuerySpotPrice("ETH-XYZ")
	if err == nil {
		t.Errorf("Query ETH-XYZ must contain error. See nothing")
	}
}
