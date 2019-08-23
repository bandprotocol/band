package adapter

import (
	"testing"
)

func TestSuccess_Uniswap(t *testing.T) {
	resolver := &Uniswap{}
	price, err := resolver.QuerySpotPrice("DAI-ETH")
	if err != nil {
		t.Errorf("Query DAI-ETH error: %s", err)
	}
	if price < 0 || price > 0.01 {
		t.Errorf("Query DAI-ETH price is way off: %f", price)
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
	_, err := resolver.QuerySpotPrice("DAI-ETG")
	if err == nil {
		t.Errorf("Query DAI-ETG must contain error. See nothing")
	}
}

func TestQueryToQuerySpotPrice_Uniswap(t *testing.T) {
	resolver := &Uniswap{}
	price, err := resolver.Query([]byte("SPOTPX/DAI-ETH"))
	if err != nil {
		t.Errorf("Query DAI-ETH error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(0)) == -1 || priceBig.Cmp(PriceToBigInt(0.01)) == 1 {
		t.Errorf("Query DAI-ETH price is way off: %s", priceBig.String())
	}
}

func TestQueryInvalidFunction_Uniswap(t *testing.T) {
	resolver := &Uniswap{}
	_, err := resolver.Query([]byte("REALPRICE/DAI-ETH"))
	if err == nil {
		t.Errorf("Query REALPRICE/DAI-ETH must contain error. See nothing")
	}
}
