package eth

import (
	"testing"

	"github.com/ethereum/go-ethereum/common"
)

func TestGetActiveProviders(t *testing.T) {
	// TODO: Wait for rpc
}

func TestIsActiveProvider(t *testing.T) {
	// TODO: Wait for rpc
}

func TestIsValidDataset(t *testing.T) {
	if !IsValidDataset(common.HexToAddress("0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e")) {
		t.Errorf("This dataset is a valid one")
	}

	if IsValidDataset(common.HexToAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")) {
		t.Errorf("This dataset is not valid")
	}
}
