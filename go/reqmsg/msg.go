package reqmsg

import (
	"encoding/hex"
	"strings"

	"github.com/bandprotocol/band/go/driver"

	"github.com/bandprotocol/band/go/eth"
	"github.com/ethereum/go-ethereum/common"
)

type DataRequest struct {
	Dataset common.Address `json:"dataset"`
	Key     string         `json:"key"`
}

func (input *DataRequest) NormalizeKey() {
	if strings.HasPrefix(input.Key, "0x") {
		decoded, err := hex.DecodeString(input.Key[2:])
		if err == nil {
			input.Key = string(decoded)
		}
	}
}

type DataResponse struct {
	Provider  common.Address `json:"provider"`
	Answer    driver.Answer  `json:"answer"`
	Timestamp uint64         `json:"timestamp"`
	Sig       eth.Signature  `json:"signature"`
}

type SignRequest struct {
	DataRequest
	Datapoints           []DataResponse `json:"datapoints"`
	MinimumProviderCount int            `json:"minimumProviders"`
}

type SignResponse struct {
	Provider  common.Address `json:"provider"`
	Value     common.Hash    `json:"value"`
	Timestamp uint64         `json:"timestamp"`
	Sig       eth.Signature  `json:"signature"`
	Status    QueryStatus    `json:"status"`
}
