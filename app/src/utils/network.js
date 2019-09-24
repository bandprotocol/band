export const networkIdtoName = id => {
  return network[id]
}

const network = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
}

const LOCALSTORAGE_KEY = 'band-wallet-network'
const NETWORK = {
  mainnet: {
    name: 'mainnet',
    rpc: 'https://mainnet.infura.io/v3/1edf94718018482aa7055218e84486d7',
    graphql: 'https://graphql.bandprotocol.com/graphql',
  },
  rinkeby: {
    name: 'rinkeby',
    api: 'https://band-rinkeby.herokuapp.com',
    rpc: 'https://rinkeby.infura.io/v3/d3301689638b40dabad8395bf00d3945',
    graphql: 'https://graphql-rinkeby.bandprotocol.com/graphql',
    // walletFactoryAddress: '0x28E972307483e394eaEC45B05a2ec3387630dBd9',
    chtTokenAddress: '0x1601fD1C8D7F400D435e27c8e08a70c878dDe3E0',
  },
  kovan: {
    name: 'kovan',
    api: 'https://band-kovan.herokuapp.com',
    rpc: 'https://kovan.infura.io/v3/d3301689638b40dabad8395bf00d3945',
    graphql: 'https://graphql-kovan.bandprotocol.com/graphql',
    // walletFactoryAddress: '0x8aa846ffa4bd6f78b8f0a72d8adb94a0993d2aac',
  },
  local: {
    name: 'local',
    api: 'http://localhost:5000',
    rpc: 'http://localhost:8545',
    graphql: 'http://localhost:5001/graphql',
    // walletFactoryAddress: '0x98C99C9F42259Ad1315620A7E4c404d49E5EAAaf',
    chtTokenAddress: '0x1601fD1C8D7F400D435e27c8e08a70c878dDe3E0',
  },
}

// for selector
export const networkOptions =
  window.document.location.host === 'app.kovan.bandprotocol.com'
    ? [{ value: 'kovan', label: 'Kovan Test Network', color: '#b3a5ff' }]
    : [
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
  const network = localStorage.getItem(LOCALSTORAGE_KEY)
  return network ? network : 'kovan'
}
