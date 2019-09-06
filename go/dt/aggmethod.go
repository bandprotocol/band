package dt

type AggMethod int

const (
	Median AggMethod = iota
	Majority
	Custom
)

func (met AggMethod) String() string {
	return AggMethodToString[met]
}

var AggMethodToString = map[AggMethod]string{
	Median:   "Median",
	Majority: "Majority",
	Custom:   "Custom",
}

var AggMethodToID = map[string]AggMethod{
	"Median":   Median,
	"Majority": Majority,
	"Custom":   Custom,
}
