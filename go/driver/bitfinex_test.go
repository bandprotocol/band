package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestSuccess_Bitfinex(t *testing.T) {
	resolver := &Bitfinex{}
	price, err := resolver.QuerySpotPrice("ETH-USD")
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	if price < 50 || price > 1000 {
		t.Errorf("Query ETH-USD price is way off: %f", price)
	}
}

func TestInvalidSymbolFormat_Bitfinex(t *testing.T) {
	resolver := &Bitfinex{}
	_, err := resolver.QuerySpotPrice("ETH")
	if err == nil {
		t.Errorf("Query ETH must contain error. See nothing")
	}
}

func TestUnknownSymbol_Bitfinex(t *testing.T) {
	resolver := &Bitfinex{}
	_, err := resolver.QuerySpotPrice("ETH-XYZ")
	if err == nil {
		t.Errorf("Query ETH-XYZ must contain error. See nothing")
	}
}

func TestQueryToQuerySpotPrice_Bitfinex(t *testing.T) {
	resolver := &Bitfinex{}
	output := resolver.Query([]byte("SPOTPX/ETH-USD"))
	if output.Option != dt.Answered {
		t.Errorf("Query ETH-USD error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}

func TestQueryInvalidFunction_Bitfinex(t *testing.T) {
	resolver := &Bitfinex{}
	output := resolver.Query([]byte("REALPRICE/ETH-USD"))
	if output.Option == dt.Answered {
		t.Errorf("Query REALPRICE/ETH-USD must contain error. See nothing")
	}
}
