package eth

import (
	"context"
	"crypto/ecdsa"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

type Signature struct {
	V uint8       `json:"v"`
	R common.Hash `json:"r"`
	S common.Hash `json:"s"`
}

// TODO(prin-r): Declare unexported variable that represents a connection to an Ethereum node
var client *ethclient.Client
var pk *ecdsa.PrivateKey

func init() {
	// TODO(prin-r): Initialize a connection to Ethereum
	var err error
	eth_rpc := os.Getenv("ETH_RPC")
	client, err = ethclient.Dial(eth_rpc)
	if err != nil {
		log.Fatal(err)
	}

	pk, err = crypto.HexToECDSA(os.Getenv("PK"))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(client)
	fmt.Println(pk)
}

// GetAddress returns the address of the
func GetAddress() (common.Address, error) {
	// TODO(prin-r): Implement this
	if pk == nil {
		return common.Address{}, errors.New("no private key found")
	}
	return crypto.PubkeyToAddress(pk.PublicKey), nil
}

// GetStorageAt returns the value at the given storage location of the given Ethereum
// contract address.
func GetStorageAt(contract common.Address, location common.Hash) ([]byte, error) {
	// TODO(prin-r): Implement this
	if client == nil {
		return []byte{}, errors.New("Initialization is required")
	}
	result, err := client.StorageAt(context.Background(), contract, location, nil)
	if err != nil {
		return []byte{}, errors.New("no private key found")
	}
	return result, nil
}

// SignMessage returns the signature of signing the given message using Ethereum's message
// signing scheme.
func SignMessage(message []byte) (Signature, error) {
	// TODO(prin-r): Implement this
	if client == nil {
		return Signature{}, errors.New("Initialization is required")
	}
	if pk == nil {
		return Signature{}, errors.New("no private key found")
	}

	signature, _ := crypto.Sign(crypto.Keccak256(message), pk)

	return Signature{
		uint8(int(signature[64])) + 27,
		common.BytesToHash(signature[0:32]),
		common.BytesToHash(signature[32:64]),
	}, nil
}

// SendTransaction broadcasts the given message to the Ethereum network. This function also
// handles transaction signing.
func SendTransaction() (common.Hash, error) {
	// TODO(prin-r): Implement this
	panic("SendTransaction: not implemented")
}
