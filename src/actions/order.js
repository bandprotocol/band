export const LOAD_ORDER_HISTORY = 'LOAD_ORDER_HISTORY'
export const ADD_ORDERS = 'ADD_ORDERS'

export const loadOrderHistory = (address, isAll) => ({
  type: LOAD_ORDER_HISTORY,
  address,
  isAll,
})

export const addOrders = (address, orders) => ({
  type: ADD_ORDERS,
  address,
  orders,
})
