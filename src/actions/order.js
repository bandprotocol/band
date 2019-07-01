export const LOAD_ORDER_HISTORY = 'LOAD_ORDER_HISTORY'
export const ADD_ORDERS = 'ADD_ORDERS'
export const ADD_NUM_ORDERS = 'ADD_NUM_ORDERS'

export const loadOrderHistory = (address, currentPage) => ({
  type: LOAD_ORDER_HISTORY,
  address,
  currentPage,
})

export const addOrders = (address, page, orders) => ({
  type: ADD_ORDERS,
  address,
  page,
  orders,
})

export const addNumOrders = (address, totalCount) => ({
  type: ADD_NUM_ORDERS,
  address,
  totalCount,
})
