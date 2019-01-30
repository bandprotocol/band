import React from 'react'
import Modal from 'react-modal'
import LoginModal from 'containers/LoginModal'
import { Box } from 'ui/common'

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(160, 172, 191, 0.45)',
  },
  content: {
    position: 'absolute',
    top: '120px',
    width: '477px',
    height: '469px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    margin: '0 auto',
  },
}

export default ({ modalName }) => (
  <Modal style={modalStyle} isOpen={!!modalName} contentLabel={modalName}>
    {modalName == 'LOGIN' ? (
      <LoginModal />
    ) : modalName === 'BUY' || modalName === 'SELL' ? (
      <Box />
    ) : (
      <Box />
    )}
  </Modal>
)
