import React from 'react'
import Modal from 'react-modal'
import { Flex, Box } from 'ui/common'
import styled from 'styled-components'

import ModalContainer from 'components/ModalContainer'

// modal
import LoginModal from 'containers/LoginModal'
import BuySellModal from 'containers/BuySellModal'
import ConfirmModal from 'containers/ConfirmModal'

export default ({ modalName, data, hideModal }) => (
  <ModalContainer hideModal={hideModal}>
    {modalName == 'LOGIN' ? (
      <LoginModal />
    ) : modalName === 'BUY' ? (
      <BuySellModal type="BUY" communityName={data.communityName} />
    ) : modalName === 'SELL' ? (
      <BuySellModal type="SELL" communityName={data.communityName} />
    ) : modalName === 'CONFIRMATION' ? (
      <ConfirmModal txHash={data.txHash} />
    ) : null}
  </ModalContainer>
)
