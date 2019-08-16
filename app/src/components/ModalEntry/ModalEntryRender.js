import React from 'react'

import ModalContainer from 'components/ModalContainer'

// modal
import LoginModal from 'components/LoginModal'
import BuySellModal from 'components/BuySellModal'
import ProposeModal from 'components/ProposeModal'
import DepositWithdrawModal from 'components/DepositWithdrawModal'
import BecomeProviderModal from 'components/BecomeProviderModal'
import ApplyIdentityModal from 'components/ApplyIdentityModal'
import NewWebRequestModal from 'components/NewWebRequestModal'
import MakeNewRequestModal from 'components/MakeNewRequestModal'
import LockedBalanchModal from 'components/LockedBalanceModal'

export default ({ modalName, data, hideModal }) => (
  <ModalContainer hideModal={hideModal}>
    {modalName === 'LOGIN' ? (
      <LoginModal />
    ) : modalName === 'BUY' ? (
      <BuySellModal type="buy" tokenAddress={data.tokenAddress} />
    ) : modalName === 'SELL' ? (
      <BuySellModal type="sell" tokenAddress={data.tokenAddress} />
    ) : modalName === 'PROPOSE' ? (
      <ProposeModal changes={data.changes} tokenAddress={data.tokenAddress} />
    ) : modalName === 'DEPOSITWITHDRAW' ? (
      <DepositWithdrawModal {...data} />
    ) : modalName === 'BEPROVIDER' ? (
      <BecomeProviderModal />
    ) : modalName === 'APPLYIDENTITY' ? (
      <ApplyIdentityModal />
    ) : modalName === 'NEW_WEB_REQUEST' ? (
      <NewWebRequestModal tcdAddress={data.tcdAddress} />
    ) : modalName === 'MAKE_NEW_REQUEST' ? (
      <MakeNewRequestModal
        request={data.request}
        tcdAddress={data.tcdAddress}
      />
    ) : modalName === 'LOCKED_BALANCH' ? (
      <LockedBalanchModal {...data} />
    ) : null}
  </ModalContainer>
)
