package dt

import (
	"bytes"
	"encoding/json"

	"github.com/ethereum/go-ethereum/common"
)

type AnswerOption uint8

const (
	Missing AnswerOption = iota
	NotFound
	Answered
	Delegated
)

func (o AnswerOption) String() string {
	return toString[o]
}

var toString = map[AnswerOption]string{
	Missing:   "MISSING",
	NotFound:  "NOT_FOUND",
	Answered:  "OK",
	Delegated: "DELEGATE",
}

var toID = map[string]AnswerOption{
	"MISSING":   Missing,
	"NOT_FOUND": NotFound,
	"OK":        Answered,
	"DELEGATE":  Delegated,
}

// MarshalJSON marshals the enum as a quoted json string
func (o AnswerOption) MarshalJSON() ([]byte, error) {
	buffer := bytes.NewBufferString(`"`)
	buffer.WriteString(toString[o])
	buffer.WriteString(`"`)
	return buffer.Bytes(), nil
}

// UnmarshalJSON unmashals a quoted json string to the enum value
func (o *AnswerOption) UnmarshalJSON(b []byte) error {
	var j string
	err := json.Unmarshal(b, &j)
	if err != nil {
		return err
	}
	// Note that if the string cannot be found then it will be set to the zero value, 'NotFound' in this case.
	*o = toID[j]
	return nil
}

type Answer struct {
	Option AnswerOption `json:"option"`
	Value  common.Hash  `json:"value"`
}

var NotFoundAnswer = Answer{
	Option: NotFound,
	Value:  common.Hash{},
}
