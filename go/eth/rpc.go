package eth

import (
	"crypto/ecdsa"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"math/big"
	"os"
	"strconv"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/rpc"
)

type Signature struct {
	V uint8       `json:"v"`
	R common.Hash `json:"r"`
	S common.Hash `json:"s"`
}

var pk *ecdsa.PrivateKey
var rpcClient *rpc.Client

func init() {
	var err error

	pk, err = crypto.HexToECDSA(os.Getenv("ETH_PRIVATE_KEY"))
	if err != nil {
		log.Println("no private key found, try to connect with localnode")
	}

	ethRpc := os.Getenv("ETH_RPC")

	rpcClient, err = rpc.Dial(ethRpc)
	if err != nil {
		log.Fatal(err)
	}
}

// GetAddress returns the address of the
func GetAddress() (common.Address, error) {
	if pk != nil {
		return crypto.PubkeyToAddress(pk.PublicKey), nil
	}
	var result []string
	err := rpcClient.Call(&result, "eth_accounts")
	if err != nil {
		return common.Address{}, err
	}
	if len(result) == 0 {
		return common.Address{}, errors.New("GetAddress: no address found")
	}
	return common.HexToAddress(result[0]), nil
}

// GetStorageAt returns the value at the given storage location of the given Ethereum
// contract address.
func GetStorageAt(contract common.Address, location common.Hash) (common.Hash, error) {
	if rpcClient == nil {
		return common.Hash{}, errors.New("GetStorageAt: Initialization is required")
	}
	var result string
	err := rpcClient.Call(&result, "eth_getStorageAt", contract.Hex(), location.Hex(), "latest")
	if err != nil {
		return common.Hash{}, err
	}
	return common.HexToHash(result), nil
}

// SignMessage returns the signature of signing the given message using Ethereum's message
// signing scheme.
func SignMessage(message []byte) (Signature, error) {
	if rpcClient == nil {
		return Signature{}, errors.New("SignMessage: Initialization is required")
	}

	withPrefix := append([]byte("\x19Ethereum Signed Message:\n32"), crypto.Keccak256(message)...)
	msgHash := crypto.Keccak256(withPrefix)

	if pk != nil {
		signature, _ := crypto.Sign(msgHash, pk)
		signature[len(signature)-1] += 27

		return Signature{
			uint8(int(signature[64])),
			common.BytesToHash(signature[0:32]),
			common.BytesToHash(signature[32:64]),
		}, nil
	}

	signerAddress, err := GetAddress()
	if err != nil {
		return Signature{}, errors.New("SignMessage: Can not get signer address")
	}

	var result string
	err = rpcClient.Call(&result, "eth_sign", signerAddress.Hex(), "0x"+common.Bytes2Hex(crypto.Keccak256(message)))
	if err != nil {
		return Signature{}, err
	}
	if len(result) != 132 {
		return Signature{}, errors.New("SignMessage: wrong signature format")
	}

	signature, err := hex.DecodeString(result[2:])
	if len(result) != 132 {
		return Signature{}, err
	}

	return Signature{
		uint8(int(signature[64])),
		common.BytesToHash(signature[0:32]),
		common.BytesToHash(signature[32:64]),
	}, nil
}

func CallContract(to common.Address, data []byte) ([]byte, error) {
	from, err := GetAddress()
	if err != nil {
		return []byte{}, err
	}

	var result string

	params := make(map[string]string)
	params["from"] = from.Hex()
	params["to"] = to.Hex()
	params["gas"] = "0xf4240"
	params["gasPrice"] = "0x0"
	params["value"] = "0x0"
	params["data"] = fmt.Sprintf("0x%x", data)

	err = rpcClient.Call(&result, "eth_call", params, "latest")
	if err != nil {
		return []byte{}, err
	}

	return hex.DecodeString(result[2:])
}

func GetNonce() (uint64, error) {
	sender, err := GetAddress()
	if err != nil {
		return 0, err
	}

	var result string
	err = rpcClient.Call(&result, "eth_getTransactionCount", sender.Hex(), "latest")
	if err != nil {
		return 0, err
	}
	if len(result) < 2 {
		return 0, errors.New(fmt.Sprintf("wrong result format %s", result))
	}

	return strconv.ParseUint(result[2:], 16, 64)
}

// SendTransaction broadcasts the given message to the Ethereum network. This function also
// handles transaction signing.
func SendTransaction(to common.Address, data []byte) (common.Hash, error) {
	// TODO : revisit -> chainId , gas , gasPrice
	nonce, err := GetNonce()
	if err != nil {
		return common.Hash{}, err
	}

	var signedTx *types.Transaction
	if pk != nil {
		tx := types.NewTransaction(
			nonce,
			to,
			big.NewInt(0),
			30000,
			big.NewInt(1e10),
			data,
		)
		signer := types.NewEIP155Signer(big.NewInt(42)) // kovan

		signedTx, err = types.SignTx(tx, signer, pk)
		if err != nil {
			return common.Hash{}, err
		}

		txRlp := "0x" + common.Bytes2Hex(types.Transactions{signedTx}.GetRlp(0))

		var txHash string
		err = rpcClient.Call(&txHash, "eth_sendRawTransaction", txRlp)
		if err != nil {
			return common.Hash{}, err
		}

		return common.HexToHash(txHash), nil
	}

	var txHash string
	params := make(map[string]string)

	from, err := GetAddress()
	params["nonce"] = fmt.Sprintf("0x%x", nonce)
	params["from"] = from.Hex()
	params["to"] = to.Hex()
	params["gas"] = "0xf4240"
	params["gasPrice"] = "0x2540be400"
	params["value"] = "0x0"
	params["data"] = fmt.Sprintf("0x%x", data)

	err = rpcClient.Call(&txHash, "eth_sendTransaction", params)

	if err != nil {
		return common.Hash{}, err
	}

	return common.HexToHash(txHash), nil
}
