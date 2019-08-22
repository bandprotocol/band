package main

import (
	"fmt"

	"github.com/bandprotocol/band/go/adapter"
)

func main() {
	resolver := &adapter.OpenMarketCap{}
	price, err := resolver.QuerySpotPrice("ETH-USD")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(price)
}
