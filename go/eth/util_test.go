package eth

import (
	"encoding/hex"
	"testing"

	"github.com/ethereum/go-ethereum/common"
)

func TestGetMappingLocation(t *testing.T) {
	output := GetMappingLocation(2, common.HexToAddress("0x0000000000000000000000000000000000000001"))
	expected := "0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0"
	if output.Hex() != expected {
		t.Errorf("Hash not matched output: %s expected %s", output, expected)
	}
}

func TestGet4BytesFunctionSignature(t *testing.T) {
	output := Get4BytesFunctionSignature("transfer(address,uint256)")
	expected, _ := hex.DecodeString("a9059cbb")
	if string(output) != string(expected) {
		t.Errorf("Function signature not matched output: %s expected: %s", output, expected)
	}
}
