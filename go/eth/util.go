package eth

import (
	"encoding/hex"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

// VerifyMessage checks if the signature is consistent with the message.
func VerifyMessage(message []byte, sig Signature, signer common.Address) bool {
	sigBuff := sig.R.Bytes()
	sigBuff = append(sigBuff, sig.S.Bytes()...)
	sigBuff = append(sigBuff, sig.V-27)

	withPrefix := append([]byte("\x19Ethereum Signed Message:\n32"), crypto.Keccak256(message)...)
	pub, _ := crypto.SigToPub(crypto.Keccak256(withPrefix), sigBuff)

	return crypto.PubkeyToAddress(*pub).String() == signer.String()
}

// GetMappingLocation find hash of key in mapping
func GetMappingLocation(slot int, key common.Address) common.Hash {
	location := key.Hash().Hex() + fmt.Sprintf("%064x", slot)
	exp, err := hex.DecodeString(location[2:])
	if err != nil {
		panic(err)
	}
	return crypto.Keccak256Hash(exp)
}
