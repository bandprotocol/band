export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'

export const showModal = modalName => ({
  type: SHOW_MODAL,
  modalName,
})

export const hideModal = () => ({
  type: HIDE_MODAL,
})
