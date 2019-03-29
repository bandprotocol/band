export const LOAD_TOKEN = 'LOAD_TOKEN'
export const ADD_TOKEN = 'ADD_TOKEN'

export const loadToken = address => {
  return {
    type: LOAD_TOKEN,
    address,
  }
}

export const addToken = (address, token) => ({
  type: ADD_TOKEN,
  address,
  token,
})
