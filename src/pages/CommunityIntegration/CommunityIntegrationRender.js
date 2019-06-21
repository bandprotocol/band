import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Flex, Box, Text } from 'ui/common'
import PageContainer from 'components/PageContainer'
import PageStructure from 'components/DataSetPageStructure'
import Snippet from 'components/Snippet'
import Code from 'data/Code'

const Pointer = styled(Flex)`
  position: relative;
  padding-left: 20px;
  font-size: 18px;
  font-weight: ${props => (props.isSelected ? '900' : '500')};
  color: ${props => (props.isSelected ? 'white' : '#4a4a4a')}
  transition: all 200ms;
  background: ${props =>
    props.isSelected
      ? `linear-gradient(to right, #5269ff, #4890ff)`
      : `#f4f8ff`};
  :before {
    content: '';
    position: absolute;
    right: -30px;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 30px solid
      ${props => (props.isSelected ? `#4890ff` : `#f4f8ff`)};
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
  }
`

export default class CommunityIntegration extends React.Component {
  state = { tabNum: 0 }

  render() {
    return (
      <PageStructure
        bgIndex={1}
        currentPage={{ path: 'integration', label: 'Integration' }}
        renderHeader={() => (
          <Flex flexDirection="column" style={{ width: '100%' }}>
            <Flex flexDirection="column" pl="50px">
              <Text
                fontSize="30px"
                lineHeight={1.4}
                style={{ width: '50%' }}
                fontWeight="900"
              >
                Integrate Off-Chain Price Data to Your Smart Contracts in
                Minutes!
              </Text>
              <Text
                fontSize="20px"
                lineHeight={1.4}
                style={{ width: '60%' }}
                mt={3}
              >
                Looking for a simple, decentralized, and secured way for your
                Dapps to consume trusted price information? We got you covered!
              </Text>
            </Flex>
          </Flex>
        )}
        {...this.props}
      >
        <PageContainer
          bg="white"
          py="40px"
          px="60px"
          style={{ borderRadius: '8px' }}
        >
          <Text fontSize="35px" mt="30px" fontWeight={900}>
            Example Situation <span>🤔</span>
          </Text>
          <Text
            lineHeight={1.65}
            fontWeight={500}
            mt="20px"
            style={{ width: '90%' }}
          >
            Say you have a simple smart contract for selling concert tickets.
            Users must pay in ETH, but we want the price of each ticket to be
            exactly 10 USD. In other words, a ticket costs whatever amount ETH
            worth 10 USD at the purchase time. The smart contract needs a
            real-time exchange rate of ETH/USD. <span>👇👇👇</span>
          </Text>
          <Flex
            flexDirection="row-reverse"
            mt="20px"
            pr="30px"
            style={{
              minHeight: '100px',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Pointer
              flex={1}
              justifyContent="center"
              alignItems="center"
              isSelected={this.state.tabNum === 2}
              onClick={() => this.setState({ tabNum: 2 })}
            >
              Step # 3: Call
              <Text
                bg={this.state.tabNum === 2 ? '#3c55f9' : '#fff8de'}
                mx="5px"
                p="5px"
                style={{ borderRadius: '4px', fontFamily: 'Source Code Pro' }}
              >
                query
              </Text>
              Function
            </Pointer>
            <Pointer
              flex={1}
              justifyContent="center"
              alignItems="center"
              isSelected={this.state.tabNum === 1}
              onClick={() => this.setState({ tabNum: 1 })}
            >
              Step # 2: Add
              <Text
                bg={this.state.tabNum === 1 ? '#3c55f9' : '#fff8de'}
                ml="5px"
                p="5px"
                style={{ borderRadius: '4px', fontFamily: 'Source Code Pro' }}
              >
                QueryInterface
              </Text>
            </Pointer>
            <Pointer
              flex={1}
              justifyContent="center"
              alignItems="center"
              isSelected={this.state.tabNum === 0}
              onClick={() => this.setState({ tabNum: 0 })}
            >
              Step # 1: Create
              <Text
                bg={this.state.tabNum === 0 ? '#3c55f9' : '#fff8de'}
                ml="5px"
                p="5px"
                style={{ borderRadius: '4px', fontFamily: 'Source Code Pro' }}
              >
                TicketContract
              </Text>
            </Pointer>
          </Flex>
          <Flex style={{ minHeight: '100px' }} />
          <Flex mt="-100px" mx="-8px" justifyContent="center" />
          <Box mt="24px">
            <Flex my="20px" alignItems="center" style={{ minHeight: '100px' }}>
              <Text fontSize="18px" lineHeight={1.67} fontWeight={500}>
                {Code['price'].description[this.state.tabNum || 0]}
              </Text>
            </Flex>
            <Snippet dataset="price" codeIndex={this.state.tabNum} />
          </Box>
        </PageContainer>
      </PageStructure>
    )
  }
}
