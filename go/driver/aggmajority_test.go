package driver

import (
	"math/big"
	"testing"

	"github.com/bandprotocol/band/go/dt"
	"github.com/ethereum/go-ethereum/common"
)

func TestValidMejority(t *testing.T) {
	median, count, err := Majority([]*big.Int{big.NewInt(12), big.NewInt(20), big.NewInt(1), big.NewInt(12), big.NewInt(17)})
	if err != nil {
		t.Errorf("Majority must not error %s", err)
	}
	if median.Cmp(big.NewInt(12)) != 0 {
		t.Errorf("Majority of this array must be 12 not %d", median.Int64())
	}
	if count != 2 {
		t.Errorf("Max count should be 2")
	}
}

func TestMajorityFailed(t *testing.T) {
	_, _, err := Majority([]*big.Int{big.NewInt(12), big.NewInt(20), big.NewInt(1), big.NewInt(9), big.NewInt(17), big.NewInt(40)})
	if err == nil {
		t.Errorf("Majority must not found")
	}
}

func TestMajorityWithEmptySlice(t *testing.T) {
	_, _, err := Majority([]*big.Int{})
	if err == nil {
		t.Errorf("Majority must return error, see nothing")
	}
}

func TestMajorityAggregatorSucceed(t *testing.T) {
	agg := &AggMajority{}
	key := "KEY"
	values := []string{"10", "10", "10", "20", "30", "40"}
	for _, v := range values {
		mock := MockDriver{make(map[string]common.Hash)}
		mock.Set(key, v)
		agg.children = append(agg.children, &mock)
	}

	output := agg.Query([]byte(key))
	if output.Option != dt.Answered {
		t.Errorf("Query %s error: %s", key, output.Option)
	}
	answer := output.Value.Big()
	if answer.Cmp(big.NewInt(10)) != 0 {
		t.Errorf("Query %s must be 20 not %s", key, answer.String())
	}
}

func TestMajorityAggregatorSucceedWithNotFound(t *testing.T) {
	agg := &AggMajority{}
	key := "KEY"
	values := []string{"10", "10", "10", "_", "30", "40"}
	for _, v := range values {
		mock := MockDriver{make(map[string]common.Hash)}
		if v != "_" {
			mock.Set(key, v)
		}
		agg.children = append(agg.children, &mock)
	}
	output := agg.Query([]byte(key))
	if output.Option != dt.Answered {
		t.Errorf("Query %s error: %s", key, output.Option)
	}
	answer := output.Value.Big()
	if answer.Cmp(big.NewInt(10)) != 0 {
		t.Errorf("Query %s must be 20 not %s", key, answer.String())
	}
}

func TestMajorityAggregatorFailed(t *testing.T) {
	agg := &AggMajority{}
	key := "KEY"
	values := []string{"10", "10", "10", "20", "20", "20"}
	for _, v := range values {
		mock := MockDriver{make(map[string]common.Hash)}
		mock.Set(key, v)
		agg.children = append(agg.children, &mock)
	}
	output := agg.Query([]byte(key))
	if output.Option != dt.NotFound {
		t.Errorf("It must cannot majority %s", output.Option)
	}
}

func TestMajorityAggregateNoAnswerFound(t *testing.T) {
	agg := &AggMajority{}
	key := "KEY"
	values := []string{"_", "_", "_", "_", "_", "_"}
	for _, v := range values {
		mock := MockDriver{make(map[string]common.Hash)}
		if v != "_" {
			mock.Set(key, v)
		}
		agg.children = append(agg.children, &mock)
	}
	output := agg.Query([]byte(key))
	if output.Option != dt.NotFound {
		t.Errorf("It must cannot majority %s", output.Option)
	}
}
