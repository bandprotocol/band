package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
	"github.com/spf13/viper"
)

func TestSuccess_CoinMarketCap(t *testing.T) {
	resolver := &CoinMarketCap{}
	resolver.Configure(viper.New())
	price, err := resolver.QuerySpotPrice("ETH-USD")
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	if price < 50 || price > 1000 {
		t.Errorf("Query ETH-USD price is way off: %f", price)
	}
}

func TestSuccessERC20_CoinMarketCap(t *testing.T) {
	resolver := &CoinMarketCap{}
	resolver.Configure(viper.New())
	price, err := resolver.QuerySpotPrice("DAI-ETH")
	if err != nil {
		t.Errorf("Query DAI-ETH error: %s", err)
	}
	if price < 0 || price > 0.01 {
		t.Errorf("Query DAI-ETH price is way off: %f", price)
	}
}

func TestInvalidSymbolFormat_CoinMarketCap(t *testing.T) {
	resolver := &CoinMarketCap{}
	resolver.Configure(viper.New())
	_, err := resolver.QuerySpotPrice("ETH")
	if err == nil {
		t.Errorf("Query ETH must contain error. See nothing")
	}
}

func TestUnknownSymbol_CoinMarketCap(t *testing.T) {
	resolver := &CoinMarketCap{}
	resolver.Configure(viper.New())
	_, err := resolver.QuerySpotPrice("ETH-XYZ")
	if err == nil {
		t.Errorf("Query ETH-XYZ must contain error. See nothing")
	}
}

func TestQueryToQuerySpotPrice_CoinMarketCap(t *testing.T) {
	resolver := &CoinMarketCap{}
	resolver.Configure(viper.New())
	output := resolver.Query([]byte("SPOTPX/ETH-USD"))
	if output.Option != dt.Answered {
		t.Errorf("Query ETH-USD error: %s", output.Option)
	}
	priceBig := output.Value.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}

func TestQueryInvalidFunction_CoinMarketCap(t *testing.T) {
	resolver := &CoinMarketCap{}
	resolver.Configure(viper.New())
	output := resolver.Query([]byte("REALPRICE/ETH-USD"))
	if output.Option == dt.Answered {
		t.Errorf("Query REALPRICE/ETH-USD must contain error. See nothing")
	}
}
