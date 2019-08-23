package adapter

import (
	"testing"
)

func TestSuccess_OpenMarketCap(t *testing.T) {
	resolver := &OpenMarketCap{}
	price, err := resolver.QuerySpotPrice("ETH-USD")
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	if price < 50 || price > 1000 {
		t.Errorf("Query ETH-USD price is way off: %f", price)
	}
}

func TestInvalidSymbolFormat_OpenMarketCap(t *testing.T) {
	resolver := &OpenMarketCap{}
	_, err := resolver.QuerySpotPrice("ETH")
	if err == nil {
		t.Errorf("Query ETH must contain error. See nothing")
	}
}

func TestUnknownSymbol_OpenMarketCap(t *testing.T) {
	resolver := &OpenMarketCap{}
	_, err := resolver.QuerySpotPrice("ETH-XYZ")
	if err == nil {
		t.Errorf("Query ETH-XYZ must contain error. See nothing")
	}
}

func TestQueryToQuerySpotPrice_OpenMarketCap(t *testing.T) {
	resolver := &OpenMarketCap{}
	price, err := resolver.Query([]byte("SPOTPX/ETH-USD"))
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}

func TestQueryInvalidFunction_OpenMarketCap(t *testing.T) {
	resolver := &OpenMarketCap{}
	_, err := resolver.Query([]byte("REALPRICE/ETH-USD"))
	if err == nil {
		t.Errorf("Query REALPRICE/ETH-USD must contain error. See nothing")
	}
}
