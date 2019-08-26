package eth

import (
	"context"
	"crypto/ecdsa"
	"errors"
	"log"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum"
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
	var err error

	pk, err = crypto.HexToECDSA(os.Getenv("ETH_PRIVATE_KEY"))
	if err != nil {
		log.Println("no private key found, connect to localnode")
	}

	ethRpc := os.Getenv("ETH_RPC")
	client, err = ethclient.Dial(ethRpc)
	if err != nil {
		log.Fatal(err)
	}
}

// GetAddress returns the address of the
func GetAddress() (common.Address, error) {
	// TODO(prin-r): local node will be implemented
	if pk == nil {
		return common.Address{}, errors.New("GetAddress: no private key found")
	}
	return crypto.PubkeyToAddress(pk.PublicKey), nil
}

// GetStorageAt returns the value at the given storage location of the given Ethereum
// contract address.
func GetStorageAt(contract common.Address, location common.Hash) (common.Hash, error) {
	if client == nil {
		return common.Hash{}, errors.New("GetStorageAt: Initialization is required")
	}
	result, err := client.StorageAt(context.Background(), contract, location, nil)
	if err != nil {
		return common.Hash{}, err
	}
	return common.BytesToHash(result), nil
}

// SignMessage returns the signature of signing the given message using Ethereum's message
// signing scheme.
func SignMessage(message []byte) (Signature, error) {
	// TODO(prin-r): local node will be implemented
	if client == nil {
		return Signature{}, errors.New("SignMessage: Initialization is required")
	}
	if pk == nil {
		return Signature{}, errors.New("SignMessage: no private key found")
	}

	signature, _ := crypto.Sign(crypto.Keccak256(message), pk)

	return Signature{
		uint8(int(signature[64])) + 27,
		common.BytesToHash(signature[0:32]),
		common.BytesToHash(signature[32:64]),
	}, nil
}

func CallContract(to common.Address, data []byte) ([]byte, error) {
	sender, err := GetAddress()
	if err != nil {
		return []byte{}, err
	}
	return client.CallContract(context.Background(), ethereum.CallMsg{
		sender,
		&to,
		uint64(0),
		big.NewInt(0),
		big.NewInt(0),
		data,
	}, nil)
}

// SendTransaction broadcasts the given message to the Ethereum network. This function also
// handles transaction signing.
func SendTransaction() (common.Hash, error) {
	// TODO(prin-r): Implement this
	// client.SendTransaction()
	panic("not implemented yet")
}
