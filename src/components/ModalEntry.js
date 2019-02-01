import React from 'react'
import Modal from 'react-modal'
import { Flex, Box } from 'ui/common'
import styled from 'styled-components'

// modal
import LoginModal from 'containers/LoginModal'
import BuySellModal from 'containers/BuySellModal'
import ConfirmModal from 'containers/ConfirmModal'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(160, 172, 191, 0.45);
  z-index: 2;
`

const Content = styled.div`
  position: absolute;
  top: 120px;
  border: 0px solid #ccc;
  background: #fff;
  overflow: auto;
  webkitoverflowscrolling: touch;
  border-radius: 6px;
  outline: none;
  padding: 0px;
  z-index: 3;
`

export default ({ modalName, data, hideModal }) =>
  modalName !== undefined ? (
    <Overlay onClick={hideModal}>
      <Flex alignItems="center" justifyContent="center" pl="280px">
        <Content onClick={e => e.stopPropagation()}>
          {modalName == 'LOGIN' ? (
            <LoginModal />
          ) : modalName === 'BUY' ? (
            <BuySellModal type="BUY" communityName={data.communityName} />
          ) : modalName === 'SELL' ? (
            <BuySellModal type="SELL" communityName={data.communityName} />
          ) : modalName === 'CONFIRMATION' ? (
            <ConfirmModal txHash={data.txHash} />
          ) : (
            <Box />
          )}
        </Content>
      </Flex>
    </Overlay>
  ) : null
