package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestWorldTradingDataSuccess(t *testing.T) {
	resolver := &WorldTradingData{}
	price, err := resolver.QuerySpotPrice("FB")
	if err != nil {
		t.Errorf("Query FB error: %s", err)
	}

	if price <= 100 || price > 1000 {
		t.Errorf("Query FB price is way off: %f", price)
	}
}

func TestWorldTradingDataInvalidSymbolFormat(t *testing.T) {
	resolver := &WorldTradingData{}
	_, err := resolver.QuerySpotPrice("FB-USD")
	if err == nil {
		t.Errorf("Query FB-USD must contain error. See nothing")
	}
}

func TestWorldTradingDataUnknownSymbol(t *testing.T) {
	resolver := &WorldTradingData{}
	_, err := resolver.QuerySpotPrice("FD")
	if err == nil {
		t.Errorf("Query FD must contain error. See nothing")
	}
}

func TestWorldTradingDataQueryToQuerySpotPrice(t *testing.T) {
	resolver := &WorldTradingData{}
	output := resolver.Query([]byte("SPOTPX/GOOG"))
	if output.Option != dt.Answered {
		t.Errorf("Query GOOG error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(500)) == -1 || priceBig.Cmp(PriceToBigInt(2000)) == 1 {
		t.Errorf("Query GOOG price is way off: %s", priceBig.String())
	}
}

func TestWorldTradingDataQueryInvalidFunction(t *testing.T) {
	resolver := &WorldTradingData{}
	output := resolver.Query([]byte("REALPRICE/GOOG"))
	if output.Option == dt.Answered {
		t.Errorf("Query REALPRICE/GOOG must contain error. See nothing")
	}
}
