export const bandSelector = state => state.get('band')
export const communitySelector = state => state.get('community')
export const currentSelector = state => state.get('current')
export const orderSelector = state => state.get('order')
export const priceSelector = state => state.get('price')
export const rewardSelector = state => state.get('reward')
export const transactionSelector = state => state.get('transaction')
export const parameterSelector = state => state.get('parameter')
export const addressSelector = (_, { address }) => address
export const typeSelector = (_, { type }) => type
export const txHashSelector = (_, { txHash }) => txHash
export const pageSelector = (_, { page }) => page
export const pageSizeSelector = (_, { pageSize }) => pageSize
