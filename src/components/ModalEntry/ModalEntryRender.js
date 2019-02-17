import React from 'react'

import ModalContainer from 'components/ModalContainer'

// modal
import LoginModal from 'components/LoginModal'
import BuySellModal from 'components/BuySellModal'
import ConfirmModal from 'components/ConfirmModal'

export default ({ modalName, data, hideModal }) => (
  <ModalContainer hideModal={hideModal}>
    {modalName == 'LOGIN' ? (
      <LoginModal />
    ) : modalName === 'BUY' ? (
      <BuySellModal type="buy" communityAddress={data.communityAddress} />
    ) : modalName === 'SELL' ? (
      <BuySellModal type="sell" communityAddress={data.communityAddress} />
    ) : modalName === 'CONFIRMATION' ? (
      <ConfirmModal txHash={data.txHash} />
    ) : null}
  </ModalContainer>
)
