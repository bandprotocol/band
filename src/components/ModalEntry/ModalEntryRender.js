import React from 'react'

import ModalContainer from 'components/ModalContainer'

// modal
import LoginModal from 'components/LoginModal'
import BuySellModal from 'components/BuySellModal'
import ProposeModal from 'components/ProposeModal'
import DepositWithdrawModal from 'components/DepositWithdrawModal'
import BecomeProviderModal from 'components/BecomeProviderModal'

export default ({ modalName, data, hideModal }) => (
  <ModalContainer hideModal={hideModal}>
    {modalName === 'LOGIN' ? (
      <LoginModal />
    ) : modalName === 'BUY' ? (
      <BuySellModal type="buy" communityAddress={data.communityAddress} />
    ) : modalName === 'SELL' ? (
      <BuySellModal type="sell" communityAddress={data.communityAddress} />
    ) : modalName === 'PROPOSE' ? (
      <ProposeModal
        changes={data.changes}
        communityAddress={data.communityAddress}
      />
    ) : modalName === 'DEPOSITWITHDRAW' ? (
      <DepositWithdrawModal {...data} />
    ) : modalName === 'BEPROVIDER' ? (
      <BecomeProviderModal />
    ) : null}
  </ModalContainer>
)
