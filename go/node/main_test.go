package main

import (
	"encoding/binary"
	"os"
	"testing"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

func Test_sign(t *testing.T) {
	pk, err := crypto.HexToECDSA(os.Getenv("ETH_PRIVATE_KEY"))
	if err != nil {
		t.Errorf(err.Error())
	}
	addr := crypto.PubkeyToAddress(pk.PublicKey)
	// 1 ETH = 190.07961 USD
	key := "ETH-USD"
	val := common.HexToHash("0x00000000000000000000000000000000000000000000000a4de26e35c6c9a000")
	time := uint64(time.Now().Unix())

	sig := sign(addr, key, val, time, pk)

	// validate

	bytesTimeStamp := make([]byte, 8)
	binary.BigEndian.PutUint64(bytesTimeStamp, time)
	bytesTimeStamp = append(make([]byte, 24), bytesTimeStamp...)

	var buff []byte
	buff = append(buff, []byte(key)...)
	buff = append(buff, val.Bytes()...)
	buff = append(buff, bytesTimeStamp...)
	buff = append(buff, (crypto.PubkeyToAddress(pk.PublicKey)).Bytes()...)

	sigBuff := sig.R.Bytes()
	sigBuff = append(sigBuff, sig.S.Bytes()...)
	sigBuff = append(sigBuff, sig.V-27)

	withPrefix := append([]byte("\x19Ethereum Signed Message:\n32"), crypto.Keccak256(buff)...)
	pub, err := crypto.SigToPub(crypto.Keccak256(withPrefix), sigBuff)
	if err != nil {
		t.Errorf(err.Error())
	}

	if crypto.PubkeyToAddress(*pub).String() != crypto.PubkeyToAddress(pk.PublicKey).String() {
		t.Errorf("signature verification fail")
	}
}
