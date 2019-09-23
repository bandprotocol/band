export const networkIdtoName = id => {
  return network[id]
}

const network = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
}
