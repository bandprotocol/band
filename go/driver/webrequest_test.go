package driver

import (
	"encoding/hex"
	"testing"

	"github.com/spf13/viper"
)

func TestTwitterFollower(t *testing.T) {
	web := &WebRequest{}
	web.Configure(viper.New())
	decodeKey, _ := hex.DecodeString(
		"1220a9ab69e5da8ac5e378796cef1d9cda4f38d9f42e77ef5aebfceeaf33334de0ed62616e6470726f746f636f6c00",
	)
	ans := web.Query(decodeKey)
	if ans.Option != OK {
		t.Errorf("Option should be OK but got %s", ans.Option)
	}
	value := ans.Value.Big().Uint64()
	if value < 0 || value > 1000000000 {
		t.Errorf("Query twitter followers is way off: %d", value)
	}
}

func TestBinanceBalance(t *testing.T) {
	web := &WebRequest{}
	web.Configure(viper.New())
	decodeKey, _ := hex.DecodeString(
		"1220784c2aa37a5f5ea6465b6c02be1779684681ec1c625ca469e6ba167157f516f7626e62316a78666832673835713376307464713536666e6576783678637874636e6874736d637536346d00",
	)
	ans := web.Query(decodeKey)
	if ans.Option != OK {
		t.Errorf("Option should be OK but got %s", ans.Option)
	}
	value := ans.Value.Big()
	if value.Cmp(GetMultiplierValue(1, 1000000000000000000)) == -1 ||
		value.Cmp(GetMultiplierValue(100000000, 1000000000000000000)) == 1 {
		t.Errorf("Query twitter followers is way off: %d", value)
	}
}

func TestGasStation(t *testing.T) {
	web := &WebRequest{}
	web.Configure(viper.New())
	decodeKey, _ := hex.DecodeString(
		"1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd6661737400",
	)
	ans := web.Query(decodeKey)
	if ans.Option != OK {
		t.Errorf("Option should be OK but got %s", ans.Option)
	}
	value := ans.Value.Big()
	if value.Cmp(GetMultiplierValue(1, 100000000)) == -1 ||
		value.Cmp(GetMultiplierValue(1000, 100000000)) == 1 {
		t.Errorf("Query twitter followers is way off: %d", value)
	}
}

func TestTwitterFollowerExceedParams(t *testing.T) {
	web := &WebRequest{}
	web.Configure(viper.New())
	decodeKey, _ := hex.DecodeString(
		"1220a9ab69e5da8ac5e378796cef1d9cda4f38d9f42e77ef5aebfceeaf33334de0ed62616e6470726f746f636f6c00a2",
	)
	ans := web.Query(decodeKey)
	if ans.Option != NotFound {
		t.Errorf("Option should be NotFound but got %s", ans.Option)
	}
}

func TestQueryTooShort(t *testing.T) {
	web := &WebRequest{}
	web.Configure(viper.New())
	decodeKey, _ := hex.DecodeString(
		"1220a9ab69e5da8ac5e378796cef1d9cda4f",
	)
	ans := web.Query(decodeKey)
	if ans.Option != NotFound {
		t.Errorf("Option should be NotFound but got %s", ans.Option)
	}
}
