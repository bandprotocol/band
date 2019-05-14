export const bandSelector = state => state.get('band')
export const communitySelector = state => state.get('community')
export const currentSelector = state => state.get('current')
export const orderSelector = state => state.get('order')
export const transferSelector = state => state.get('transfer')
export const holderSelector = state => state.get('holder')
export const tokenSelector = state => state.get('token')
export const priceSelector = state => state.get('price')
export const rewardSelector = state => state.get('reward')
export const tcdSelector = state => state.get('tcd')
export const blockNumberSelector = state =>
  state.getIn(['transaction', 'currentBlock'])
export const transactionSelector = state => state.getIn(['transaction', 'txs'])
export const transactionHiddenSelector = state =>
  state.getIn(['transaction', 'hide'])
export const parameterSelector = state => state.get('parameter')
export const proposalSelector = state => state.get('proposal')
export const fetchSelector = state => state.get('fetch')
export const addressSelector = (_, { address }) => address
export const nameSelector = (_, { name }) => name
export const typeSelector = (_, { type }) => type
export const txHashSelector = (_, { txHash }) => txHash
export const pageSelector = (_, { page }) => page
export const pageSizeSelector = (_, { pageSize }) => pageSize
export const featureCommunitiesSelector = (_, { featureCommunities }) =>
  featureCommunities
