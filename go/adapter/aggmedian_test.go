package adapter

import (
	"math/big"
	"testing"
)

func TestEvenMedian(t *testing.T) {
	median := Median([]*big.Int{big.NewInt(12), big.NewInt(20), big.NewInt(1), big.NewInt(9), big.NewInt(17)})
	if median.Cmp(big.NewInt(12)) != 0 {
		t.Errorf("Median of this array must be 17 not %d", median.Int64())
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
	agg.Initialize([]Adapter{&CryptoCompare{}, &CoinBase{}, &OpenMarketCap{}})
	price, err := agg.Query([]byte("SPOTPX/ETH-USD"))
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}

func TestERC20PriceAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.Initialize([]Adapter{&CryptoCompare{}, &Kyber{}, &Uniswap{}, &Bancor{}})
	price, err := agg.Query([]byte("SPOTPX/DAI-ETH"))
	if err != nil {
		t.Errorf("Query DAI-ETH error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(0)) == -1 || priceBig.Cmp(PriceToBigInt(0.01)) == 1 {
		t.Errorf("Query DAI-ETH price is way off: %s", priceBig.String())
	}
}

func TestForexAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.Initialize([]Adapter{&Ratesapi{}, &CurrencyConverter{}, &AlphaVantageForex{}, &FreeForexApi{}})
	price, err := agg.Query([]byte("SPOTPX/EUR-USD"))
	if err != nil {
		t.Errorf("Query EUR-USD error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(1)) == -1 || priceBig.Cmp(PriceToBigInt(2)) == 1 {
		t.Errorf("Query EUR-USD price is way off: %s", priceBig.String())
	}

	price, err = agg.Query([]byte("SPOTPX/XAU"))
	if err != nil {
		t.Errorf("Query XAU error: %s", err)
	}
	priceBig = price.Big()
	if priceBig.Cmp(PriceToBigInt(1000)) == -1 || priceBig.Cmp(PriceToBigInt(2000)) == 1 {
		t.Errorf("Query XAU price is way off: %s", priceBig.String())
	}
}

func TestStockAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.Initialize([]Adapter{&AlphaVantageStock{}, &WorldTradingData{}, &FinancialModelPrep{}})
	price, err := agg.Query([]byte("SPOTPX/AAPL"))
	if err != nil {
		t.Errorf("Query AAPL error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(100)) == -1 || priceBig.Cmp(PriceToBigInt(500)) == 1 {
		t.Errorf("Query AAPL price is way off: %s", priceBig.String())
	}
}

func TestInvalidProviderAggregator(t *testing.T) {
	agg := &AggMedian{}
	agg.Initialize([]Adapter{&CryptoCompare{}, &CoinBase{}, &OpenMarketCap{}})
	_, err := agg.Query([]byte("SPOTPX/AAPL"))
	if err == nil {
		t.Errorf("Crypto provider must cannot find APPL price")
	}
}

func TestCanErrorOnSomeAdapter(t *testing.T) {
	agg := &AggMedian{}
	agg.Initialize([]Adapter{&CryptoCompare{}, &CoinBase{}, &FinancialModelPrep{}, &OpenMarketCap{}})
	price, err := agg.Query([]byte("SPOTPX/ETH-USD"))
	if err != nil {
		t.Errorf("Query ETH-USD error: %s", err)
	}
	priceBig := price.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}
