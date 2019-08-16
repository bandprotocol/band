import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { hideModal } from 'actions'
import { communityDetailSelector } from 'selectors/communities'
import {
  communityLockBalanceSelector,
  tokenLockByTCDSelector,
} from 'selectors/balances'
import { Flex, Button, Text } from 'ui/common'
import { getTCDInfomation } from 'utils/tcds'

const BgCard = styled(Flex).attrs({
  bg: 'white',
  flexDirection: 'column',
})`
  width: 600px;
  height: 381px;
  border-radius: 6px;
  box-shadow: 0 12px 23px 0 rgba(0, 0, 0, 0.13);
`

class LockedBalanceModal extends React.Component {
  render() {
    const {
      hideLockedBalanchModal,
      stakePerTcds,
      unstakePerTcds,
      tcds,
    } = this.props

    const headRender = (
      <Flex flexDirection="row" width="100%" my={2}>
        <Flex flex={2} px="10px">
          <Text
            color="#6878e2"
            fontSize="14px"
            lineHeight="1.4em"
            fontWeight="bold"
          >
            TCDS
          </Text>
        </Flex>
        <Flex flex={1} px="10px">
          <Text
            color="#6878e2"
            fontSize="14px"
            lineHeight="1.4em"
            fontWeight="bold"
          >
            Staked
          </Text>
        </Flex>
        <Flex flex={1} px="10px">
          <Text
            color="#6878e2"
            fontSize="14px"
            lineHeight="1.4em"
            fontWeight="bold"
          >
            Unstake
          </Text>
        </Flex>
      </Flex>
    )

    const bodyRender = tcds.map((tcd, i) => {
      return (
        <Flex my={2} flexDirection="row" width="100%">
          <Flex flex={2}>
            <Text>{getTCDInfomation(tcds[i].prefix).label}</Text>
          </Flex>
          <Flex flex={1}>
            <Text>{stakePerTcds[i].pretty()}</Text>
          </Flex>
          <Flex flex={1}>
            <Text>{unstakePerTcds[i].pretty()}</Text>
          </Flex>
        </Flex>
      )
    })

    return (
      <BgCard mt="100px">
        <Flex
          style={{ height: '55px', borderBottom: '1px solid #ededed' }}
          pl="30px"
          alignItems="center"
        >
          <Text color="#4e3ca9" fontFamily="Avenir-Heavy" fontSize="14px">
            LockedBalanceModal
          </Text>
          <Flex
            width={1}
            justifyContent="flex-end"
            pr="30px"
            style={{ cursor: 'pointer' }}
            onClick={() => hideLockedBalanchModal()}
          >
            <i className="fas fa-times" />
          </Flex>
        </Flex>
        <Flex
          pt="20px"
          px="30px"
          height="200px"
          flexDirection="column"
          style={{ position: 'relative' }}
        >
          {headRender}
          {bodyRender}
          <Flex>
            <Text>Staked: </Text>
            <Text>Staked in tcd</Text>
          </Flex>
          <Flex>
            <Text>Unstake: </Text>
            <Text>Locked - Stake</Text>
          </Flex>
        </Flex>
      </BgCard>
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  const tcdsToJS = community.get('tcds').toJS()
  const tcds = Object.keys(tcdsToJS).map(key => {
    return {
      address: key,
      prefix: tcdsToJS[key].prefix,
    }
  })
  const lockBalance = communityLockBalanceSelector(state, {
    address: tokenAddress,
  })

  const stakePerTcds = tcds.map(tcd => {
    return tokenLockByTCDSelector(state, {
      address: tokenAddress,
      tcdAddress: tcd.address,
    })
  })

  const unstakePerTcds = tcds.map(tcd => {
    return lockBalance.sub(
      tokenLockByTCDSelector(state, {
        address: tokenAddress,
        tcdAddress: tcd.address,
      }),
    )
  })

  return {
    name: community.get('name'),
    src: community.get('logo'),
    lockBalance: lockBalance,
    tcds: tcds,
    stakePerTcds: stakePerTcds,
    unstakePerTcds: unstakePerTcds,
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideLockedBalanchModal: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LockedBalanceModal)
