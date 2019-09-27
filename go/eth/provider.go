package eth

import (
	"encoding/binary"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
)

var activeProviderSlot = 2

// GetActiveProviders returns the set of currently active data provider addresses
// of the given dataset address.
func GetActiveProviders(dataset common.Address) ([]common.Address, error) {
	guard := common.HexToAddress("0x1")
	rawOutput, err := CallContract(dataset, Get4BytesFunctionSignature("activeCount()"))
	if err != nil {
		return []common.Address{}, err
	}

	if len(rawOutput) < 32 {
		return []common.Address{}, fmt.Errorf("GetActiveProviders: Cannot find activeCount")
	}

	activeCount := binary.BigEndian.Uint16(rawOutput[30:])
	currentAddress := guard
	var activeProviders []common.Address

	for i := uint16(0); i < activeCount; i++ {
		output, err := GetStorageAt(dataset, GetMappingLocation(activeProviderSlot, currentAddress))
		if err != nil {
			return []common.Address{}, err
		}
		currentAddress = common.HexToAddress(output.Hex())
		if currentAddress == guard {
			return []common.Address{}, fmt.Errorf("GetActiveProviders: Provider list shorter than active count")
		}
		activeProviders = append(activeProviders, currentAddress)
	}

	// Check last element must point to guard
	output, err := GetStorageAt(dataset, GetMappingLocation(activeProviderSlot, currentAddress))
	if err != nil {
		return []common.Address{}, err
	}
	currentAddress = common.HexToAddress(output.Hex())
	if currentAddress != guard {
		return []common.Address{}, fmt.Errorf("GetActiveProviders: Provider list longer that active count")
	}
	return activeProviders, nil
}

// IsActiveProvider checks if the given data provider address is active in the given
// dataset address. Returns true if that the case, and false otherwise.
func IsActiveProvider(dataset, provider common.Address) (bool, error) {
	notFound := common.HexToHash("0x0")
	value, err := GetStorageAt(dataset, GetMappingLocation(activeProviderSlot, provider))
	if err != nil {
		return false, err
	}
	return value != notFound, nil
}

// IsValidDataset returns true if the given dataset address is valid, and false otherwise
func IsValidDataset(dataset common.Address) bool {
	// validDatesets := []common.Address{
	// 	common.HexToAddress("0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e"),
	// 	common.HexToAddress("0xF904Db9817E4303c77e1Df49722509a0d7266934"),
	// 	common.HexToAddress("0x7b09c1255b27fCcFf18ecC0B357ac5fFf5f5cb31"),
	// 	common.HexToAddress("0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8"),
	// }
	// for _, validDataset := range validDatesets {
	// 	if dataset == validDataset {
	// 		return true
	// 	}
	// }
	// return false
	return true
}
