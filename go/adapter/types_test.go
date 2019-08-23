package adapter

import (
	"testing"
)

func TestPriceToBigInt(t *testing.T) {
	price := 123.79
	bigInt := PriceToBigInt(price)
	if bigInt.String() != "123790000000000000000" {
		t.Errorf("Convert incorrect")
	}

	price = 0.0094
	bigInt = PriceToBigInt(price)
	if bigInt.String() != "9400000000000000" {
		t.Errorf("Convert incorrect")
	}
}
