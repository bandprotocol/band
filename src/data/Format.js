export const getFormat = dataset => {
  switch (dataset) {
    case '0x3ebD71aA0b758705339Bb58917bc9202CE153BAC':
    default:
      return {
        logIdentified: 'price of trading pair',
        formatValue: price =>
          parseInt(price).toLocaleString('en-US', {
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      }
  }
}
