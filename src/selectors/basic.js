export const bandSelector = state => state.get('band')
export const communitySelector = state => state.get('community')
export const currentSelector = state => state.get('current')
export const orderSelector = state => state.get('order')
export const nameSelector = (_, { name }) => name
export const typeSelector = (_, { type }) => type
