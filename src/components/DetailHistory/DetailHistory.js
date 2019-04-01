import React from 'react'
import { Flex, Text } from 'ui/common'
import Richlist from 'components/Richlist'
import TransferHistory from 'components/TransferHistory'
import OrderHistory from 'components/OrderHistory'

export default class DetailHistory extends React.Component {
  state = {
    selectedTab: 0,
  }
  render() {
    const { selectedTab } = this.state
    const { communityAddress, pageSize } = this.props
    return (
      <Flex
        style={{ borderRadius: '10px' }}
        flexDirection="column"
        bg="white"
        width={1}
      >
        <Flex width={1} flexDirection="row" pt="30px" px="30px">
          <Flex width={[1 / 7]}>
            <Flex
              onClick={() => this.setState({ selectedTab: 0 })}
              style={{
                cursor: 'pointer',
                borderBottom:
                  selectedTab === 0 ? 'solid 2px #4e3ca9' : undefined,
                height: '35px',
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={500}
                color={selectedTab === 0 ? '#4e3ca9' : undefined}
              >
                Rich list
              </Text>
            </Flex>
          </Flex>
          <Flex width={[1 / 7]}>
            <Flex
              onClick={() => this.setState({ selectedTab: 1 })}
              style={{
                cursor: 'pointer',
                borderBottom:
                  selectedTab === 1 ? 'solid 2px #4e3ca9' : undefined,
                height: '35px',
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={500}
                color={selectedTab === 1 ? '#4e3ca9' : undefined}
              >
                Transfer
              </Text>
            </Flex>
          </Flex>
          <Flex width={[1 / 7]}>
            <Flex
              onClick={() => this.setState({ selectedTab: 2 })}
              style={{
                cursor: 'pointer',
                borderBottom:
                  selectedTab === 2 ? 'solid 2px #4e3ca9' : undefined,
                height: '35px',
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={500}
                color={selectedTab === 2 ? '#4e3ca9' : undefined}
              >
                Orders
              </Text>
            </Flex>
          </Flex>
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
