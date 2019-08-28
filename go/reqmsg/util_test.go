package reqmsg

import (
	"encoding/hex"
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
)

func TestGetRawDataBytes(t *testing.T) {
	n := big.NewInt(0)
	n.SetString("10101710000000000327680", 10)
	output := hex.EncodeToString(GetRawDataBytes(
		common.HexToAddress("0xa24df0420de1f3b8d740a52aaeb9d55d6d64478e"),
		[]byte("SPOT/BTC-USD"),
		common.BigToHash(n),
		1566963495,
	))

	expected := "53504f542f4254432d5553440000000000000000000000000000000000000000000002239d634bd8bb400000000000005d65f727a24df0420de1f3b8d740a52aaeb9d55d6d64478e"
	if output != expected {
		t.Errorf("Bytes result must be %s not %s", expected, output)
	}
}

func TestGetAggregateBytes(t *testing.T) {
	n := big.NewInt(0)
	n.SetString("10101710000000000327680", 10)
	output := hex.EncodeToString(GetAggregateBytes(
		common.HexToAddress("0xa24df0420de1f3b8d740a52aaeb9d55d6d64478e"),
		[]byte("SPOT/BTC-USD"),
		common.BigToHash(n),
		1566963495,
		1,
	))

	expected := "53504f542f4254432d5553440000000000000000000000000000000000000000000002239d634bd8bb400000000000005d65f72701a24df0420de1f3b8d740a52aaeb9d55d6d64478e"
	if output != expected {
		t.Errorf("Bytes result must be %s not %s", expected, output)
	}
}
