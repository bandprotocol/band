export const bandSelector = state => state.get('band')
export const communitySelector = state => state.get('community')
export const currentSelector = state => state.get('current')
export const orderSelector = state => state.get('order')
export const priceSelector = state => state.get('price')
export const transactionSelector = state => state.get('transaction')
export const nameSelector = (_, { name }) => name
export const typeSelector = (_, { type }) => type
export const txHashSelector = (_, { txHash }) => txHash
export const pageSelector = (_, { page }) => page
export const pageSizeSelector = (_, { pageSize }) => pageSize
