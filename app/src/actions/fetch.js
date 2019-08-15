export const TOGGLE_FETCH = 'TOGGLE_FETCH'

export const toggleFetch = fetch => {
  return {
    type: TOGGLE_FETCH,
    fetch,
  }
}
