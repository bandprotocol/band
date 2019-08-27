package eth

import (
	"encoding/hex"
	"testing"

	"github.com/ethereum/go-ethereum/common"
)

func TestVerifyMessage(t *testing.T) {
	msg := []byte("mumu")
	sigBytes, _ := hex.DecodeString("81ebc32983f4f405a04a3e8f9eccd0c6ece14815a742c6a1dc7999add8ea8583494eb68a1320e8e693f2ad00430ec78805d675885b8b8c0852f834d998e93ded1b")
	sig := Signature{
		V: uint8(int(sigBytes[64])),
		R: common.BytesToHash(sigBytes[0:32]),
		S: common.BytesToHash(sigBytes[32:64]),
	}
	result := VerifyMessage(msg, sig, common.HexToAddress("0x4aEa6CfC5BD14F2308954D544e1DC905268357DB"))
	if !result {
		t.Errorf("TestVerifyMessage: message verification fail")
	}
}

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
