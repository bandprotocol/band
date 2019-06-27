export const getFormat = symbol => {
  switch (symbol.toUpperCase()) {
    case 'XFN':
    default:
      return {
        logIdentifier: 'price of trading pair',
        formatValue: price => {
          const p = parseInt(price) / 1e18
          return p.toLocaleString('en-US', {
            currency: 'USD',
            ...(p > 1
              ? {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              : {
                  minimumSignificantDigits: 2,
                  maximumSignificantDigits: 3,
                }),
          })
        },
      }
  }
}
