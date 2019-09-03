package driver

import (
	"bytes"
	"math/big"
	"testing"

	"github.com/spf13/viper"
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
	cf := []byte(`
children:
  cryptoCompare:
    name: CryptoCompare
  coinBase:
    name: CoinBase
  openMarketCap:
    name: OpenMarketCap
`)
	config := viper.New()
	config.SetConfigType("yaml")
	config.ReadConfig(bytes.NewBuffer(cf))
	agg.Configure(config)
	price := agg.Query([]byte("SPOTPX/ETH-USD"))
	if price.Option != OK {
		t.Errorf("Query ETH-USD error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}

func TestERC20PriceAggregator(t *testing.T) {
	agg := &AggMedian{}
	cf := []byte(`
children:
  cryptoCompare:
    name: CryptoCompare
  kyber:
    name: Kyber
  uniswap:
    name: Uniswap
  bancor:
    name: Bancor
`)
	config := viper.New()
	config.SetConfigType("yaml")
	config.ReadConfig(bytes.NewBuffer(cf))
	agg.Configure(config)
	price := agg.Query([]byte("SPOTPX/DAI-ETH"))
	if price.Option != OK {
		t.Errorf("Query DAI-ETH error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(0)) == -1 || priceBig.Cmp(PriceToBigInt(0.01)) == 1 {
		t.Errorf("Query DAI-ETH price is way off: %s", priceBig.String())
	}
}

func TestForexAggregator(t *testing.T) {
	agg := &AggMedian{}
	cf := []byte(`
children:
  ratesapi:
    name: Ratesapi
  cc:
	name: CurrencyConverter
  avf:
    name: AlphaVantageForex
`)
	config := viper.New()
	config.SetConfigType("yaml")
	config.ReadConfig(bytes.NewBuffer(cf))
	agg.Configure(config)
	price := agg.Query([]byte("SPOTPX/EUR-USD"))
	if price.Option != OK {
		t.Errorf("Query EUR-USD error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(1)) == -1 || priceBig.Cmp(PriceToBigInt(2)) == 1 {
		t.Errorf("Query EUR-USD price is way off: %s", priceBig.String())
	}

	price = agg.Query([]byte("SPOTPX/XAU"))
	if price.Option != OK {
		t.Errorf("Query XAU error: %s", price.Option)
	}
	priceBig = price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(1000)) == -1 || priceBig.Cmp(PriceToBigInt(2000)) == 1 {
		t.Errorf("Query XAU price is way off: %s", priceBig.String())
	}
}

func TestStockAggregator(t *testing.T) {
	agg := &AggMedian{}
	cf := []byte(`
children:
  fmp:
    name: FinancialModelPrep
  wtd:
    name: WorldTradingData
  avs:
    name: AlphaVantageStock
`)
	config := viper.New()
	config.SetConfigType("yaml")
	config.ReadConfig(bytes.NewBuffer(cf))
	agg.Configure(config)
	price := agg.Query([]byte("SPOTPX/AAPL"))
	if price.Option != OK {
		t.Errorf("Query AAPL error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(100)) == -1 || priceBig.Cmp(PriceToBigInt(500)) == 1 {
		t.Errorf("Query AAPL price is way off: %s", priceBig.String())
	}
}

func TestInvalidProviderAggregator(t *testing.T) {
	agg := &AggMedian{}
	cf := []byte(`
children:
  cryptoCompare:
    name: CryptoCompare
  coinBase:
    name: CoinBase
  openMarketCap:
    name: OpenMarketCap
`)
	config := viper.New()
	config.SetConfigType("yaml")
	config.ReadConfig(bytes.NewBuffer(cf))
	agg.Configure(config)
	output := agg.Query([]byte("SPOTPX/AAPL"))
	if output.Option == OK {
		t.Errorf("Crypto provider must cannot find APPL price")
	}
}

func TestCanErrorOnSomeDriver(t *testing.T) {
	agg := &AggMedian{}
	cf := []byte(`
children:
  cryptoCompare:
    name: CryptoCompare
  coinBase:
    name: CoinBase
  financialModelPrep:
    name: FinancialModelPrep
`)
	config := viper.New()
	config.SetConfigType("yaml")
	config.ReadConfig(bytes.NewBuffer(cf))
	agg.Configure(config)

	price := agg.Query([]byte("SPOTPX/ETH-USD"))
	if price.Option != OK {
		t.Errorf("Query ETH-USD error: %s", price.Option)
	}
	priceBig := price.Value.Big()
	if priceBig.Cmp(PriceToBigInt(50)) == -1 || priceBig.Cmp(PriceToBigInt(1000)) == 1 {
		t.Errorf("Query ETH-USD price is way off: %s", priceBig.String())
	}
}
