package driver

import (
	"math/big"
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestEvenMedian(t *testing.T) {
	median := Median([]*big.Int{big.NewInt(12), big.NewInt(20), big.NewInt(1), big.NewInt(9), big.NewInt(17)})
	if median.Cmp(big.NewInt(12)) != 0 {
		t.Errorf("Median of this array must be 12 not %d", median.Int64())
	}
}

func TestOddMedian(t *testing.T) {
	median := Median([]*big.Int{big.NewInt(12), big.NewInt(20), big.NewInt(1), big.NewInt(9), big.NewInt(17), big.NewInt(40)})
	if median.Cmp(big.NewInt(14)) != 0 {
		t.Errorf("Median of this array must be 14 not %d", median.Int64())
	}
}

func TestCryptoPriceAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.children = []Driver{&CryptoCompare{}, &CoinBase{}, &Bittrex{}}
	price := agg.Query([]byte("SPOTPX/ETH-USD"))
	if price.Option != dt.Answered {
		t.Errorf("Query ETH-USD error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}

func TestERC20PriceAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.children = []Driver{&CryptoCompare{}, &Kyber{}, &Uniswap{}, &Bancor{}}
	price := agg.Query([]byte("SPOTPX/DAI-ETH"))
	if price.Option != dt.Answered {
		t.Errorf("Query DAI-ETH error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(0)) == -1 || priceBig.Cmp(PriceToBigInt(0.01)) == 1 {
		t.Errorf("Query DAI-ETH price is way off: %s", priceBig.String())
	}
}

func TestForexAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.children = []Driver{&Ratesapi{}, &CurrencyConverter{}, &AlphaVantageForex{}}
	price := agg.Query([]byte("SPOTPX/EUR-USD"))
	if price.Option != dt.Answered {
		t.Errorf("Query EUR-USD error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(1)) == -1 || priceBig.Cmp(PriceToBigInt(2)) == 1 {
		t.Errorf("Query EUR-USD price is way off: %s", priceBig.String())
	}

	price = agg.Query([]byte("SPOTPX/XAU"))
	if price.Option != dt.Answered {
		t.Errorf("Query XAU error: %s", price.Option)
	}
	priceBig = price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(1000)) == -1 || priceBig.Cmp(PriceToBigInt(2000)) == 1 {
		t.Errorf("Query XAU price is way off: %s", priceBig.String())
	}
}

func TestStockAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.children = []Driver{&FinancialModelPrep{}, &WorldTradingData{}, &AlphaVantageStock{}}
	price := agg.Query([]byte("SPOTPX/AAPL"))
	if price.Option != dt.Answered {
		t.Errorf("Query AAPL error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(100)) == -1 || priceBig.Cmp(PriceToBigInt(500)) == 1 {
		t.Errorf("Query AAPL price is way off: %s", priceBig.String())
	}
}

func TestInvalidProviderAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.children = []Driver{&CryptoCompare{}, &CoinBase{}, &Kyber{}}
	output := agg.Query([]byte("SPOTPX/AAPL"))
	if output.Option == dt.Answered {
		t.Errorf("Crypto provider must cannot find APPL price")
	}
}

func TestCanErrorOnSomeDriver(t *testing.T) {
	agg := &AggMedian{}
	agg.children = []Driver{&CryptoCompare{}, &CoinBase{}, &FinancialModelPrep{}}
	price := agg.Query([]byte("SPOTPX/ETH-USD"))
	if price.Option != dt.Answered {
		t.Errorf("Query ETH-USD error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}
