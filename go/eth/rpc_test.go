package eth

import (
	"encoding/hex"
	"fmt"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

func TestGetAddress(t *testing.T) {
	_, err := GetAddress()
	if err != nil {
		t.Errorf(err.Error())
	}
}

func TestGetStorageAt(t *testing.T) {
	location := make([]byte, 32)
	_, err := GetStorageAt(
		common.HexToAddress("0x820b586c8c28125366c998641b09dcbe7d4cbf06"),
		common.BytesToHash(location),
	)
	if err != nil {
		t.Errorf(err.Error())
	}
}

func TestSignMessage(t *testing.T) {
	data := []byte("hello")
	sig, err := SignMessage(data)
	if err != nil {
		t.Errorf(err.Error())
	}

	sigBuff := sig.R.Bytes()
	sigBuff = append(sigBuff, sig.S.Bytes()...)
	sigBuff = append(sigBuff, sig.V-27)

	pub, err := crypto.SigToPub(crypto.Keccak256(data), sigBuff)
	if err != nil {
		t.Errorf(err.Error())
	}
	if "0x4aEa6CfC5BD14F2308954D544e1DC905268357DB" != crypto.PubkeyToAddress(*pub).String() {
		t.Errorf("TestSignMessage: wrong signature %s", crypto.PubkeyToAddress(*pub).String())
	}
}

func TestCallContract(t *testing.T) {
	data, err := hex.DecodeString("65ba36c1000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000047465737400000000000000000000000000000000000000000000000000000000")
	if err != nil {
		t.Errorf(err.Error())
	}
	result, err := CallContract(
		common.HexToAddress("0x820b586c8c28125366c998641b09dcbe7d4cbf06"),
		data,
	)
	if err != nil {
		t.Errorf(err.Error())
	}
	if fmt.Sprintf("0x%x", result) != "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658" {
		t.Errorf(fmt.Sprintf("TestCallContract: wrong result 0x%x", result))
	}
}
