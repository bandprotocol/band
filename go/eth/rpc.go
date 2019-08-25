package eth

import (
	"crypto/ecdsa"

	"github.com/ethereum/go-ethereum/common"
)

type Signature struct {
	V uint8       `json:"v"`
	R common.Hash `json:"r"`
	S common.Hash `json:"s"`
}

// TODO(prin-r): Declare unexported variable that represents a connection to an Ethereum node

func init() {
	// TODO(prin-r): Initialize a connection to Ethereum
}

// GetAddress returns the address of the
func GetAddress() (common.Address, error) {
	// TODO(prin-r): Implement this
	panic("GetAddress: not implemented")
}

// GetStorageAt returns the value at the given storage location of the given Ethereum
// contract address.
func GetStorageAt(contract, location common.Address) (common.Hash, error) {
	// TODO(prin-r): Implement this
	panic("GetStorageAt: not implemented")
}

// SignMessage returns the signature of signing the given message using Ethereum's message
// signing scheme.
func SignMessage(message []byte) (Signature, error) {
	// TODO(prin-r): Implement this
	panic("SignMessage: not implemented")
}

// SendTransaction broadcasts the given message to the Ethereum network. This function also
// handles transaction signing.
func SendTransaction() (common.Hash, error) {
	// TODO(prin-r): Implement this
	panic("SendTransaction: not implemented")
}

func getPrivateKey() (*ecdsa.PrivateKey, error) {
	// TOOD(prin-r): Implement this
	panic("getPrivateKey: not implemented")
}
