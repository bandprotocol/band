const network = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
}

export const networkIdtoName = id => {
  return network[id]
}

// for selector
export const networkOptions = [
  { value: 'mainnet', label: 'Main Ethereum Network', color: '#47cc81' },
  { value: 'rinkeby', label: 'Rinkeby Test Network', color: '#ffca55' },
  { value: 'kovan', label: 'Kovan Test Network', color: '#b3a5ff' },
  { value: 'robsten', label: 'Robsten Test Network', color: 'black' },
]

export const getCurrentNetworkOption = () => {
  return networkOptions.filter(
    option => option.value === getCurrentNetworkName(),
  )
}

export const getCurrentNetworkName = () => {
  const network = localStorage.getItem('network')
  return network ? network : 'kovan'
}

export const getNetworkIndex = network => {
  return networkOptions.findIndex(n => n.value === network)
}
