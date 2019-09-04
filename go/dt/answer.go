package dt

import (
	"bytes"
	"encoding/json"

	"github.com/ethereum/go-ethereum/common"
)

type AnswerOption uint8

const (
	NotFound AnswerOption = iota
	Answered
	Delegated
)

func (o AnswerOption) String() string {
	return toString[o]
}

var toString = map[AnswerOption]string{
	NotFound:  "Not found",
	Answered:  "Answered",
	Delegated: "Delegated",
}

var toID = map[string]AnswerOption{
	"Not found": NotFound,
	"Answered":  Answered,
	"Delegated": Delegated,
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
	// Note that if the string cannot be found then it will be set to the zero value, 'Created' in this case.
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
