import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { hideModal, tcdDeposit, tcdWithdraw } from 'actions'
import { communityDetailSelector } from 'selectors/communities'
import {
  communityBalanceSelector,
  tokenLockByTCDSelector,
} from 'selectors/balances'
import BN from 'utils/bignumber'
import { Flex, Button, Text } from 'ui/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const BgCard = styled(Flex).attrs({
  bg: 'white',
  flexDirection: 'column',
})`
  width: 400px;
  height: 281px;
  border-radius: 6px;
  box-shadow: 0 12px 23px 0 rgba(0, 0, 0, 0.13);
`
const CustomButton = styled(Button).attrs({
  fontSize: '16px',
  fontWeight: 500,
  width: '120px',
})`
  margin: 0px 25px;
  border-radius: 6px;
  transition: 0.5s all;
  cursor: pointer;
  background-color: '#7c84a6';
`

class ConvertRevenueModal extends React.Component {
  render() {
    const {
      hideConvertModal,
      dispatchWithdraw,
      userRevenue,
      tcdAddress,
      dataSourceAddress,
      stake,
    } = this.props
    return (
      <BgCard mt="100px">
        <Flex
          style={{ height: '55px', borderBottom: '1px solid #ededed' }}
          pl="30px"
          alignItems="center"
        >
          <Text color="#4e3ca9" fontFamily="Avenir-Heavy" fontSize="14px">
            ConvertRevenueModal
          </Text>
          <Flex
            width={1}
            justifyContent="flex-end"
            pr="30px"
            style={{ cursor: 'pointer' }}
            onClick={() => hideConvertModal()}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Flex>
        </Flex>
        <Flex
          pt="20px"
          px="30px"
          height="200px"
          flexDirection="column"
          style={{ position: 'relative' }}
        >
          <Text color="#4a4a4a" fontSize="14px" lineHeight={1.43}>
            Stake the revenue or withdraw the revenue
          </Text>
          <Flex
            style={{ verticalAlign: 'baseline' }}
            width={1}
            justifyContent="center"
          >
            <Flex my="50px">
              <CustomButton
                onClick={() =>
                  dispatchWithdraw(
                    tcdAddress,
                    dataSourceAddress,
                    0,
                    userRevenue.pretty(),
                  )
                }
              >
                Stake Revenue
              </CustomButton>
              <CustomButton
                onClick={() =>
                  dispatchWithdraw(
                    tcdAddress,
                    dataSourceAddress,
                    userRevenue,
                    userRevenue.pretty(),
                  )
                }
              >
                Withdraw Revenue{' '}
              </CustomButton>
            </Flex>
          </Flex>
        </Flex>
      </BgCard>
    )
  }
}

const mapStateToProps = (
  state,
  {
    userRevenue,
    tokenAddress,
    dataSourceAddress,
    tcdAddress,
    userOwnership,
    stake,
    totalOwnership,
  },
) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  return {
    userRevenue,
    userOwnership,
    stake,
    totalOwnership,
    tokenAddress,
    dataSourceAddress,
    tcdAddress,
    symbol: community.get('symbol'),
    balance: communityBalanceSelector(state, { address: tokenAddress }).sub(
      tokenLockByTCDSelector(state, { address: tokenAddress, tcdAddress }),
    ),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideConvertModal: () => dispatch(hideModal()),
  dispatchWithdraw: (tcdAddress, dataSourceAddress, stake, withdrawAmount) =>
    dispatch(tcdWithdraw(tcdAddress, dataSourceAddress, stake, withdrawAmount)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConvertRevenueModal)
