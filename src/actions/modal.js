export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'

export const showModal = (modalName, data) => ({
  type: SHOW_MODAL,
  modalName,
  data,
})

export const hideModal = () => ({
  type: HIDE_MODAL,
})
