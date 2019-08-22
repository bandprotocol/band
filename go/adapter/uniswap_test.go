package adapter

import (
	"testing"
)

func TestSuccess_Uniswap(t *testing.T) {
	resolver := &Uniswap{}
	price, err := resolver.QuerySpotPrice("DAI-ETH")
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	if price < 50 || price > 1000 {
		t.Errorf("Query ETH-USD price is way off: %f", price)
	}
}

func TestInvalidSymbolFormat_Uniswap(t *testing.T) {
	resolver := &Uniswap{}
	_, err := resolver.QuerySpotPrice("ETH")
	if err == nil {
		t.Errorf("Query ETH must contain error. See nothing")
	}
}

func TestUnknownSymbol_Uniswap(t *testing.T) {
	resolver := &Uniswap{}
	_, err := resolver.QuerySpotPrice("ETH-XYZ")
	if err == nil {
		t.Errorf("Query ETH-XYZ must contain error. See nothing")
	}
}
