package eth

import (
	"encoding/hex"
	"fmt"

	"github.com/ethereum/go-ethereum/crypto"

	"github.com/ethereum/go-ethereum/common"
)

// VerifyMessage checks if the signature is consistent with the message.
func VerifyMessage(message []byte, sig Signature) bool {
	// TODO(prin-r): Implement this
	panic("SignMessage: not implemented")
}

// GetHashOfMapping find hash of key in mapping
func GetHashOfMapping(slot int, key common.Address) (common.Hash, error) {
	location := key.Hash().Hex() + fmt.Sprintf("%064x", slot)
	exp, err := hex.DecodeString(location[2:])
	if err != nil {
		return common.Hash{}, err
	}
	return crypto.Keccak256Hash(exp), nil
}
