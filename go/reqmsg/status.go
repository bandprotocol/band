package reqmsg

import (
	"bytes"
	"encoding/json"
)

type QueryStatus uint8

const (
	Invalid QueryStatus = iota
	OK
	NotAvailable
	Disagreement
)

func (q QueryStatus) String() string {
	return toString[q]
}

var toString = map[QueryStatus]string{
	Invalid:      "Invalid",
	OK:           "OK",
	NotAvailable: "Not Available",
	Disagreement: "Disagreement",
}

var toID = map[string]QueryStatus{
	"Invalid":       Invalid,
	"OK":            OK,
	"Not Available": NotAvailable,
	"Disagreement":  Disagreement,
}

// MarshalJSON marshals the enum as a quoted json string
func (q QueryStatus) MarshalJSON() ([]byte, error) {
	buffer := bytes.NewBufferString(`"`)
	buffer.WriteString(toString[q])
	buffer.WriteString(`"`)
	return buffer.Bytes(), nil
}

// UnmarshalJSON unmashals a quoted json string to the enum value
func (q *QueryStatus) UnmarshalJSON(b []byte) error {
	var j string
	err := json.Unmarshal(b, &j)
	if err != nil {
		return err
	}
	// Note that if the string cannot be found then it will be set to the zero value, 'Created' in this case.
	*q = toID[j]
	return nil
}
