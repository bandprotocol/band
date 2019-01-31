import React from 'react'
import Modal from 'react-modal'
import { Box } from 'ui/common'

// modal
import LoginModal from 'containers/LoginModal'
import BuySellModal from 'containers/BuySellModal'

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
    height: '489px',
    border: '0px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '6px',
    outline: 'none',
    padding: '0px',
    margin: '0 auto',
  },
}

export default ({ modalName, communityName }) => (
  <Modal style={modalStyle} isOpen={!!modalName} contentLabel={modalName}>
    {modalName == 'LOGIN' ? (
      <LoginModal />
    ) : modalName === 'BUY' ? (
      <BuySellModal type="BUY" communityName={communityName} />
    ) : modalName === 'SELL' ? (
      <BuySellModal type="SELL" communityName={communityName} />
    ) : (
      <Box />
    )}
  </Modal>
)
