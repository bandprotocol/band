export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'

export const showModal = (modalName, communityName) => ({
  type: SHOW_MODAL,
  modalName,
  communityName,
})

export const hideModal = () => ({
  type: HIDE_MODAL,
})
