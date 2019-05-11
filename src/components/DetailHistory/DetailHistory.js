import React from 'react'
import { Flex, Text } from 'ui/common'
import Richlist from 'components/Richlist'
import TransferHistory from 'components/TransferHistory'
import OrderHistory from 'components/OrderHistory'
import { colors } from 'ui'

export default class DetailHistory extends React.Component {
  state = {
    selectedTab: 0,
  }

  renderTab(text, tab) {
    const { selectedTab } = this.state
    return (
      <Flex
        onClick={() => this.setState({ selectedTab: tab })}
        mr={3}
        px={3}
        alignItems="center"
        style={{
          cursor: 'pointer',
          background: selectedTab === tab ? '#f6f9ff' : 'transparent',
          borderRadius: 20,
          height: 36,
        }}
      >
        <Text
          fontSize="15px"
          fontWeight={500}
          color={selectedTab === tab ? colors.blue.normal : undefined}
          fontWeight={selectedTab === tab ? '600' : undefined}
        >
          {text}
        </Text>
      </Flex>
    )
  }

  render() {
    const { selectedTab } = this.state
    const { communityAddress, pageSize } = this.props
    return (
      <Flex
        style={{ borderRadius: '10px', border: 'solid 1px #e9eaea' }}
        flexDirection="column"
        bg="white"
        width={1}
      >
        <Flex
          width={1}
          alignItems="center"
          flexDirection="row"
          px="30px"
          style={{ height: 72 }}
        >
          <Text mr={4} fontSize="15px" fontWeight="900" color="#393939">
            EXPLORE
          </Text>
          {this.renderTab('Rich List', 0)}
          {this.renderTab('Token Transfers', 1)}
          {this.renderTab('Orders', 2)}
        </Flex>
        <Flex>
          {selectedTab === 0 && (
            <Richlist communityAddress={communityAddress} pageSize={pageSize} />
          )}
          {selectedTab === 1 && (
            <TransferHistory
              communityAddress={communityAddress}
              pageSize={pageSize}
            />
          )}
          {selectedTab === 2 && (
            <OrderHistory
              communityAddress={communityAddress}
              pageSize={pageSize}
            />
          )}
        </Flex>
      </Flex>
    )
  }
}
