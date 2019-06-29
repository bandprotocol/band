import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, AbsoluteLink, Button, Image } from 'ui/common'
import PageContainer from 'components/PageContainer'
import PageStructure from 'components/DataSetPageStructure'
import Snippet from 'components/Snippet'
import Integration from 'data/Integration/index'
import DataHeader from 'components/DataHeader'

const RoundButton = styled(Button)`
  margin: auto 20px;
  width: 200px;
  height: 36px;
  border-radius: 20px;
  background-color: ${p => (p.active ? '#dbe4ff' : 'white')};
  color: ${p => (p.active ? '#5269ff' : '#4a4a4a')};
  transition: all 200ms;
  box-shadow: ${p =>
    p.active
      ? '0 2px 5px 0px rgba(0, 0, 0, 0.1)'
      : '0 1px 2px 0px rgba(0, 0, 0, 0.05)'};
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, 0.1);
  }
`

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

const HighlightSpan = styled.span`
  color: #ff5252;
  background-color: #fff8de;
  text-align: center;
  padding: 0px 5px;
  border-radius: 4px;
`

const Sup = styled.span`
  vertical-align: super;
  font-size: smaller;
`

const HighlightText = ({ text }) => {
  const words = text.split(' ')
  const keyWords = ['/', '0x', 'byte', 'query', 'uint']
  return (
    <React.Fragment>
      {words.map((word, i) => {
        try {
          if (word.includes('^')) {
            const [a, b] = word.split('^')
            return (
              <span>
                {a}
                <Sup>{b}</Sup>
              </span>
            )
          }
          for (const k of keyWords) {
            if (word.toLowerCase().includes(k)) {
              return <HighlightSpan>{word + ' '}</HighlightSpan>
            }
          }
        } catch (e) {}
        return <React.Fragment>{word + ' '}</React.Fragment>
      })}
    </React.Fragment>
  )
}

export default class CommunityIntegrationRender extends React.Component {
  state = { codingStepNum: 0, tabNum: this.props.hideTodo ? 1 : 0 }

  render() {
    const { name: communityName, tcdPrefix, hideTodo } = this.props
    const info =
      (tcdPrefix && Integration[communityName][tcdPrefix]) ||
      Integration[communityName][Object.keys(Integration[communityName])[0]]

    const keyFormat = info.keyFormat[Object.keys(info.keyFormat)[0]]
    const dataFormat = info.dataFormat

    return (
      <PageStructure
        name={communityName}
        breadcrumb={{ path: 'integration', label: 'Integration' }}
        renderHeader={() => (
          <DataHeader
            lines={[
              `Integrate Off-Chain ${info.label[0].toUpperCase() +
                info.label.slice(1).toLowerCase()} Data to`,
              `Your Smart Contracts in Minutes`,
              `Looking for a simple, decentralized, and secured way for your Dapps to`,
              `consume trusted ${info.label.toLowerCase()} information? We got you covered!`,
            ]}
          />
        )}
        {...this.props}
      >
        <PageContainer
          bg="white"
          style={{
            borderRadius: '8px',
            position: 'relative',
            boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Flex
            justifyContent="center"
            style={{
              width: '100%',
              left: '0px',
              top: '0px',
              height: '65px',
              position: 'absolute',
              borderBottom: 'solid 1px #e7ecff',
            }}
          >
            {/* Hack for hiding */}
            {hideTodo ? null : (
              <RoundButton
                active={this.state.tabNum === 0}
                onClick={() => this.setState({ tabNum: 0 })}
              >
                Example Situation <span>🤔</span>
              </RoundButton>
            )}
            <RoundButton
              active={this.state.tabNum === 1}
              onClick={() => this.setState({ tabNum: 1 })}
            >
              Key Format <span>🔑</span>
            </RoundButton>
            <RoundButton
              active={this.state.tabNum === 2}
              onClick={() => this.setState({ tabNum: 2 })}
            >
              Data Format <span>📝</span>
            </RoundButton>
          </Flex>
          <Text fontSize="24px" mt="95px" mx="80px" fontWeight={900}>
            {this.state.tabNum === 0 && 'Example Situation 🤔'}
            {this.state.tabNum === 1 && 'Key Format 🔑'}
            {this.state.tabNum === 2 && 'Data Format 📝'}
          </Text>
          {this.state.tabNum === 0 && (
            <React.Fragment>
              <Text
                lineHeight={1.65}
                fontWeight={500}
                fontSize="16px"
                mt="30px"
                mx="80px"
              >
                <HighlightText text={info.example} />
              </Text>
              <Flex
                flexDirection="row-reverse"
                mt="30px"
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
                  isSelected={this.state.codingStepNum === 2}
                  onClick={() => this.setState({ codingStepNum: 2 })}
                >
                  Step # 3: Call
                  <Text
                    bg={this.state.codingStepNum === 2 ? '#3c55f9' : '#fff8de'}
                    mx="5px"
                    p="5px"
                    style={{
                      borderRadius: '4px',
                      fontFamily: 'Source Code Pro',
                    }}
                  >
                    query
                  </Text>
                  Function
                </Pointer>
                <Pointer
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  isSelected={this.state.codingStepNum === 1}
                  onClick={() => this.setState({ codingStepNum: 1 })}
                >
                  Step # 2: Add
                  <Text
                    bg={this.state.codingStepNum === 1 ? '#3c55f9' : '#fff8de'}
                    ml="5px"
                    p="5px"
                    style={{
                      borderRadius: '4px',
                      fontFamily: 'Source Code Pro',
                    }}
                  >
                    QueryInterface
                  </Text>
                </Pointer>
                <Pointer
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  isSelected={this.state.codingStepNum === 0}
                  onClick={() => this.setState({ codingStepNum: 0 })}
                >
                  Step # 1: Create
                  <Text
                    bg={this.state.codingStepNum === 0 ? '#3c55f9' : '#fff8de'}
                    ml="5px"
                    p="5px"
                    fontSize="12px"
                    style={{
                      borderRadius: '4px',
                      fontFamily: 'Source Code Pro',
                    }}
                  >
                    {info.contractName}
                  </Text>
                </Pointer>
              </Flex>
              <Flex style={{ minHeight: '140px' }} />
              <Flex mt="-140px" mx="-8px" justifyContent="center" />
              <Box mx="80px">
                <Flex alignItems="center" style={{ minHeight: '140px' }}>
                  <Text fontSize="16px" lineHeight={1.67} fontWeight={500}>
                    <HighlightText
                      text={info.description[this.state.codingStepNum || 0]}
                    />
                  </Text>
                </Flex>
                <Snippet
                  code={info.solidity}
                  dataset={communityName}
                  codeIndex={this.state.codingStepNum}
                />
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
            </React.Fragment>
          )}
          {this.state.tabNum === 1 && (
            <React.Fragment>
              <Flex>
                <Text
                  lineHeight={1.65}
                  fontWeight={500}
                  fontSize="16px"
                  mt="30px"
                  pl="10px"
                  mx="80px"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <HighlightText text={keyFormat.description} />
                </Text>
              </Flex>
              <Flex mt="30px" mx="60px" flexWrap="wrap">
                {keyFormat.keys.map(key => (
                  <Flex
                    alignItems="center"
                    mt="-1px"
                    mx="20px"
                    px="10px"
                    style={{
                      border: 'solid 1px #d7dfff',
                      maxWidth: '400px',
                      minWidth: '400px',
                      maxHeight: '50px',
                      minHeight: '50px',
                    }}
                  >
                    {key[2] && (
                      <Flex style={{ maxWidth: '40px' }} mr="5px">
                        <Box
                          mr={2}
                          style={{
                            width: 36,
                            height: 36,
                            backgroundImage: `url(${key[2]})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </Flex>
                    )}
                    <Text
                      fontFamily="code"
                      fontWeight="600"
                      fontSize="15px"
                      flex={1}
                    >
                      {key[0]}
                    </Text>
                    <Text
                      fontSize={key[1].length >= 32 ? '13px' : '16px'}
                      fontWeight={500}
                    >
                      <HighlightText text={key[1]} />
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </React.Fragment>
          )}
          {this.state.tabNum === 2 && (
            <React.Fragment>
              <Flex>
                <Text
                  lineHeight={1.65}
                  fontWeight={500}
                  fontSize="16px"
                  mt="30px"
                  pl="10px"
                  mx="80px"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <HighlightText text={dataFormat.description} />
                </Text>
              </Flex>
            </React.Fragment>
          )}
        </PageContainer>
      </PageStructure>
    )
  }
}
