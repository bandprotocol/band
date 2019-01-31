export const LOAD_ORDER_HISTORY = 'LOAD_ORDER_HISTORY'
export const ADD_ORDERS = 'ADD_ORDERS'

export const loadOrderHistory = (name, isAll) => ({
  type: LOAD_ORDER_HISTORY,
  name,
  isAll,
})

export const addOrders = (name, orders) => ({
  type: ADD_ORDERS,
  name,
  orders,
})
