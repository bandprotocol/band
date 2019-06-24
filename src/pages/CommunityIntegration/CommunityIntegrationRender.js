import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, AbsoluteLink } from 'ui/common'
import PageContainer from 'components/PageContainer'
import PageStructure from 'components/DataSetPageStructure'
import Snippet from 'components/Snippet'
import Integration from 'data/Integration'

const Pointer = styled(Flex)`
  position: relative;
  padding-left: 10px;
  font-size: 16px;
  font-weight: ${props => (props.isSelected ? '900' : '500')};
  color: ${props => (props.isSelected ? 'white' : '#4a4a4a')}
  background: ${props =>
    props.isSelected
      ? `linear-gradient(to right, #5269ff, #4890ff)`
      : `#f4f8ff`};
  transition: all 200ms;
  cursor: pointer;
  :before {
    content: '';
    position: absolute;
    right: -15px;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 15px solid
      ${props => (props.isSelected ? `#4890ff` : `#f4f8ff`)};
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }
`

export default class CommunityIntegrationRender extends React.Component {
  state = { tabNum: 0 }

  render() {
    const { name: communityName } = this.props
    const info = Integration[communityName]
    return (
      <PageStructure
        name={communityName}
        breadcrumb={{ path: 'integration', label: 'Integration' }}
        renderHeader={() => (
          <Flex flexDirection="column" style={{ width: '100%' }}>
            <Flex flexDirection="column" pl="52px">
              <Text
                fontSize="27px"
                color="white"
                fontWeight="900"
                width="50%"
                style={{ lineHeight: '38px' }}
              >
                {info.h1}
              </Text>
              <Text
                fontSize="18px"
                color="white"
                fontWeight="500"
                width="60%"
                style={{ lineHeight: '33px' }}
              >
                {info.h2}
              </Text>
            </Flex>
          </Flex>
        )}
        {...this.props}
      >
        <PageContainer bg="white" style={{ borderRadius: '8px' }}>
          <Text fontSize="24px" mt="50px" mx="80px" fontWeight={900}>
            Example Situation <span>🤔</span>
          </Text>
          <Text
            lineHeight={1.65}
            fontWeight={500}
            fontSize="16px"
            mt="20px"
            mx="80px"
          >
            {info.example}
          </Text>
          <Flex
            flexDirection="row-reverse"
            mt="20px"
            mx="80px"
            pr="30px"
            style={{
              minHeight: '50px',
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
                fontSize="12px"
                style={{ borderRadius: '4px', fontFamily: 'Source Code Pro' }}
              >
                {info.contractName}
              </Text>
            </Pointer>
          </Flex>
          <Flex style={{ minHeight: '100px' }} />
          <Flex mt="-100px" mx="-8px" justifyContent="center" />
          <Box mt="10px" mx="80px">
            <Flex alignItems="center" style={{ minHeight: '100px' }}>
              <Text fontSize="16px" lineHeight={1.67} fontWeight={500}>
                {info.description[this.state.tabNum || 0]}
              </Text>
            </Flex>
            <Snippet dataset={communityName} codeIndex={this.state.tabNum} />
            <Flex
              mt="25px"
              bg="#6b8bf5"
              style={{
                overflow: 'hidden',
                maxHeight: '80px',
                minHeight: '80px',
                borderRadius: '10px',
                position: 'relative',
              }}
            >
              <Flex
                bg="#4b6fe6"
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  minHeight: '500px',
                  minWidth: '500px',
                  right: '-220px',
                  top: '-420px',
                }}
              />
              <Flex style={{ margin: 'auto', zIndex: 1 }}>
                <Text color="white" fontSize="18px">
                  We encourage you to see it in action, so feel free to try
                  these codes on {` `}
                  <AbsoluteLink
                    style={{ color: 'white' }}
                    href="https://remix.ethereum.org"
                  >
                    https://remix.ethereum.org
                  </AbsoluteLink>
                </Text>
              </Flex>
            </Flex>
          </Box>
        </PageContainer>
      </PageStructure>
    )
  }
}
