package driver

import (
	"testing"
)

func TestSuccess_Kyber(t *testing.T) {
	resolver := &Kyber{}
	price, err := resolver.QuerySpotPrice("DAI-ETH")
	if err != nil {
		t.Errorf("Query DAI-ETH error: %s", err)
	}
	if price < 0 || price > 0.01 {
		t.Errorf("Query DAI-ETH price is way off: %f", price)
	}
}

func TestInvalidSymbolFormat_Kyber(t *testing.T) {
	resolver := &Kyber{}
	_, err := resolver.QuerySpotPrice("ETH")
	if err == nil {
		t.Errorf("Query ETH must contain error. See nothing")
	}
}

func TestUnknownSymbol_Kyber(t *testing.T) {
	resolver := &Kyber{}
	_, err := resolver.QuerySpotPrice("DAI-ETG")
	if err == nil {
		t.Errorf("Query ETH-ETG must contain error. See nothing")
	}
}

func TestQueryToQuerySpotPrice_Kyber(t *testing.T) {
	resolver := &Kyber{}
	output := resolver.Query([]byte("SPOTPX/DAI-ETH"))
	if output.Option != "OK" {
		t.Errorf("Query ETH-USD error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(0)) == -1 || priceBig.Cmp(PriceToBigInt(0.01)) == 1 {
		t.Errorf("Query DAI-ETH price is way off: %s", priceBig.String())
	}
}

func TestQueryInvalidFunction_Kyber(t *testing.T) {
	resolver := &Kyber{}
	output := resolver.Query([]byte("REALPRICE/DAI-ETH"))
	if output.Option == "OK" {
		t.Errorf("Query REALPRICE/DAI-ETH must contain error. See nothing")
	}
}
