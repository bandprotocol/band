export const getLink = () => {
  const network = localStorage.getItem('network')
  switch (network) {
    case 'mainnet':
      return 'https://etherscan.io'
    case 'rinkeby':
      return 'https://rinkeby.etherscan.io'
    case 'kovan':
      return 'https://kovan.etherscan.io'
    case 'ropsten':
      return 'https://ropsten.etherscan.io'
    default:
      console.error(`${network} is not support.`)
      return 'https://etherscan.io'
  }
}
