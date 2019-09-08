package driver

import (
	"testing"
)

func TestBinanceSuccess(t *testing.T) {
	resolver := &Binance{}
	price, err := resolver.QueryBinancePrice()
	if err != nil {
		t.Errorf("Query BTC-USDT error: %s", err)
	}
	if price <= 8000 || price >= 20000 {
		t.Errorf("QueryBTC-USDT price is way off: %f", price)
	}
}
