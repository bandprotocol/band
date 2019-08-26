package eth

import (
	"testing"

	"github.com/ethereum/go-ethereum/common"
)

func TestGetHashOfMapping(t *testing.T) {
	output, err := GetHashOfMapping(2, common.HexToAddress("0x0000000000000000000000000000000000000001"))
	if err != nil {
		t.Errorf("Error occured %s", err)
	}
	expected := "0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0"
	if output.Hex() != expected {
		t.Errorf("Hash not matched output: %s expected %s", output, expected)
	}
}
