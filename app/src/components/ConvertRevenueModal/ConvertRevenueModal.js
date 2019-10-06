import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { hideModal, tcdRevenueToStake, tcdWithdraw } from 'actions'
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
  fontSize: '14px',
  fontWeight: 500,
  width: '120px',
  mx: '10px',
})`
  line-height: 1.3;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${props => props.bg};
  pointer-events: auto;
  color: white;
`

class ConvertRevenueModal extends React.Component {
  render() {
    const {
      hideConvertModal,
      dispatchWithdraw,
      dispatchRevenueToStake,
      userRevenue,
      tcdAddress,
      dataSourceAddress,
      stake,
      totalOwnership,
    } = this.props
    const revenueAmount = userRevenue.mul(totalOwnership).div(stake)
    return (
      <BgCard mt="100px">
        <Flex
          style={{ height: '55px', borderBottom: '1px solid #ededed' }}
          pl="30px"
          alignItems="center"
        >
          <Flex>
            <Text
              color="#4e3ca9"
              fontFamily="Avenir-Heavy"
              fontSize="14px"
              style={{ whiteSpace: 'nowrap' }}
            >
              Stake or Withdraw
            </Text>
          </Flex>
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
            Stake the revenue or Withdraw the revenue
          </Text>
          <Flex
            style={{ verticalAlign: 'baseline' }}
            width={1}
            justifyContent="center"
          >
            <Flex mt="35px" mb="20px">
              <CustomButton
                bg="#42c47f"
                onClick={() =>
                  console.log(dataSourceAddress) ||
                  dispatchRevenueToStake(
                    tcdAddress,
                    dataSourceAddress,
                    userRevenue.pretty(6),
                  )
                }
              >
                Stake Revenue
              </CustomButton>
              <CustomButton
                bg="#ec6363"
                onClick={() =>
                  dispatchWithdraw(
                    tcdAddress,
                    dataSourceAddress,
                    revenueAmount,
                    userRevenue.pretty(6),
                  )
                }
              >
                Widthdraw Revenue{' '}
              </CustomButton>
            </Flex>
          </Flex>
        </Flex>
      </BgCard>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  hideConvertModal: () => dispatch(hideModal()),
  dispatchRevenueToStake: (tcdAddress, dataSourceAddress, revenueAmount) =>
    dispatch(tcdRevenueToStake(tcdAddress, dataSourceAddress, revenueAmount)),
  dispatchWithdraw: (tcdAddress, dataSourceAddress, stake, withdrawAmount) =>
    dispatch(tcdWithdraw(tcdAddress, dataSourceAddress, stake, withdrawAmount)),
})

export default connect(
  null,
  mapDispatchToProps,
)(ConvertRevenueModal)
