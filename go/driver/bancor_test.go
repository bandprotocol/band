package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestSuccess_Bancor(t *testing.T) {
	resolver := &Bancor{}
	price, err := resolver.QuerySpotPrice("DAI-ETH")
	if err != nil {
		t.Errorf("Query DAI-ETH error: %s", err)
	}
	if price < 0 || price > 0.01 {
		t.Errorf("Query DAI-ETH price is way off: %f", price)
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
	_, err := resolver.QuerySpotPrice("DAI-ETG")
	if err == nil {
		t.Errorf("Query DAI-ETG must contain error. See nothing")
	}
}

func TestQueryToQuerySpotPrice_Bancor(t *testing.T) {
	resolver := &Bancor{}
	output := resolver.Query([]byte("SPOTPX/DAI-ETH"))
	if output.Option != dt.Answered {
		t.Errorf("Query DAI-ETH error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(0)) == -1 || priceBig.Cmp(PriceToBigInt(0.01)) == 1 {
		t.Errorf("Query DAI-ETH price is way off: %s", priceBig.String())
	}
}

func TestQueryInvalidFunction_Bancor(t *testing.T) {
	resolver := &Bancor{}
	output := resolver.Query([]byte("REALPRICE/DAI-ETH"))
	if output.Option == dt.Answered {
		t.Errorf("Query REALPRICE/DAI-ETH must contain error. See nothing")
	}
}
