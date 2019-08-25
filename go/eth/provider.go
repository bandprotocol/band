package eth

import "github.com/ethereum/go-ethereum/common"

// GetActiveProviders returns the set of currently active data provider addresses
// of the given dataset address.
func GetActiveProviders(dataset common.Address) ([]common.Address, error) {
	// TODO(bunoi): Implement this
	panic("GetActiveProviders: not implemented")
}

// IsActiveProvider checks if the given data provider address is active in the given
// dataset address. Returns true if that the case, and false otherwise.
func IsActiveProvider(dataset, provider common.Address) (bool, error) {
	// TODO(bunoi): Implement this
	panic("IsActiveProvider: not implemented")
}

// IsValidDataset returns true if the given dataset address is valid, and false otherwise
func IsValidDataset(dataset common.Address) (bool, error) {
	// TODO(bunoi): Implement this
	panic("IsValidDataset: not implemented")
}
