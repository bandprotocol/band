package eth

import (
	"os"
	"testing"

	"github.com/ethereum/go-ethereum/common"
)

func TestGetActiveProviders(t *testing.T) {
	SetRpcClient(os.Getenv("ETH_RPC"))
	dataset := common.HexToAddress("0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e")
	providers, err := GetActiveProviders(dataset)
	if err != nil {
		t.Errorf("Cannot get active providers %s", err)
	}
	if len(providers) != 3 {
		t.Errorf("There are 3 providers in this dataset, but get %d", len(providers))
	}

	expectedProvider := []common.Address{
		common.HexToAddress("0xDA7afa8f087AA2571276b17dBe45A4097C380eff"),
		common.HexToAddress("0xDa7AFDeE902A41769479349373EF24D19368a9f1"),
		common.HexToAddress("0xdA7Af7Ce7baD1454bdB96507Fb73b7478A345e3b"),
	}

	for i := 0; i < 3; i++ {
		if providers[i] != expectedProvider[i] {
			t.Errorf("Providers not match real world")
		}
	}
}

func TestGetActiveProvidersFailed(t *testing.T) {
	SetRpcClient(os.Getenv("ETH_RPC"))
	dataset := common.HexToAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
	_, err := GetActiveProviders(dataset)
	if err == nil {
		t.Errorf("Get providers must contain error. See nothing")
	}
}

func TestIsActiveProvider(t *testing.T) {
	SetRpcClient(os.Getenv("ETH_RPC"))
	dataset := common.HexToAddress("0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e")
	provider := common.HexToAddress("0xDa7AFDeE902A41769479349373EF24D19368a9f1")
	isIn, err := IsActiveProvider(dataset, provider)
	if err != nil {
		t.Errorf("Cannot check active provider %s", err)
	}
	if !isIn {
		t.Errorf("%s must be active provider", provider)
	}
}

func TestIsActiveProviderIfNotInDataset(t *testing.T) {
	SetRpcClient(os.Getenv("ETH_RPC"))
	dataset := common.HexToAddress("0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e")
	provider := common.HexToAddress("0xda7AdcB9b801952019f8d44889A9F4038443dD97")
	isIn, err := IsActiveProvider(dataset, provider)
	if err != nil {
		t.Errorf("Cannot check active provider %s", err)
	}
	if isIn {
		t.Errorf("%s must not be active provider", provider)
	}
}

func TestIsValidDataset(t *testing.T) {
	SetRpcClient(os.Getenv("ETH_RPC"))
	if !IsValidDataset(common.HexToAddress("0xa24dF0420dE1f3b8d740A52AAEB9d55d6D64478e")) {
		t.Errorf("This dataset is a valid one")
	}

	if IsValidDataset(common.HexToAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")) {
		t.Errorf("This dataset is not valid")
	}
}
