package main

import (
	"encoding/binary"
	"testing"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

func Test_sign(t *testing.T) {
	pk, err := crypto.HexToECDSA("FA930EE26652DF7198B479E357AF92B3B0E3367F5601913D3DBADBE5C8D13689")
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

	var buff []byte
	buff = append(buff, (crypto.PubkeyToAddress(pk.PublicKey)).Bytes()...)
	buff = append(buff, []byte(key)...)
	buff = append(buff, val.Bytes()...)

	bytesTimeStamp := make([]byte, 8)
	binary.BigEndian.PutUint64(bytesTimeStamp, time)

	buff = append(buff, bytesTimeStamp...)

	sigBuff := sig.R.Bytes()
	sigBuff = append(sigBuff, sig.S.Bytes()...)
	sigBuff = append(sigBuff, sig.V-27)

	pub, err := crypto.SigToPub(crypto.Keccak256(buff), sigBuff)
	if err != nil {
		t.Errorf(err.Error())
	}

	validX := pub.X.String() == pk.PublicKey.X.String()
	validY := pub.Y.String() == pk.PublicKey.Y.String()

	if !(validX && validY) {
		t.Errorf("signature verification fail")
	}
}
