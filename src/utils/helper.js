export const isPositiveNumber = input => {
  return input.match(/^\d*\.?\d*$/) && parseInt(input, 10) >= 0
}
