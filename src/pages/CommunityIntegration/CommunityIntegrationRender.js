import React, { Children } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, AbsoluteLink } from 'ui/common'
import PageContainer from 'components/PageContainer'
import PageStructure from 'components/DataSetPageStructure'
import Snippet from 'components/Snippet'
import Integration from 'data/Integration/index'
import DataHeader from 'components/DataHeader'
import IntegrationHeader from 'images/integration-header.svg'
import DataPortal from 'images/dataportal.svg'

const TabButton = styled(Flex).attrs({
  width: '380px',
  justifyContent: 'center',
  alignItems: 'center',
})`
  background-color: transparent;
  color: ${p => (p.active ? '#5269ff' : '#4a4a4a')};
  cursor: pointer;
  border-bottom: ${p => (p.active ? '1px solid #5269ff' : '0')};
  font-weight: 500;
  height: 60px;
`

const PointerLeftPart = styled(Flex)`
  position: relative;
  padding-left: 10px;
  font-size: 16px;
  border-radius: 4px;
  color: ${props => (props.isSelected ? 'white' : '#4a4a4a')}
  background: ${props => (props.isSelected ? '#5269ff' : 'rgba(0,0,0,0)')};
  ${props =>
    props.isSelected && 'box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.34);'}
  cursor: pointer;
`

const Pointer = props => (
  <PointerLeftPart
    {...props}
    flex={1}
    justifyContent="center"
    alignItems="center"
  >
    {props.isSelected && (
      <Flex
        bg="#5269ff"
        style={{
          position: 'absolute',
          right: '-12px',
          minWidth: '28px',
          minHeight: '28px',
          borderRadius: '4px',
          transform: 'matrix(0.5, -0.7071, 0.5, 0.7071, 0, 0)',
        }}
      />
    )}
    {props.children}
  </PointerLeftPart>
)

const HighlightSpan = styled.span`
  color: #ff5252;
  background-color: #fbfbfb;
  border: 1px solid #eaeaea;
  text-align: center;
  padding: 0px 5px;
  margin-right: 5px;
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
              return <HighlightSpan>{word}</HighlightSpan>
            }
          }
        } catch (e) {}
        return <React.Fragment>{word + ' '}</React.Fragment>
      })}
    </React.Fragment>
  )
}

export default class CommunityIntegrationRender extends React.Component {
  state = { codingStepNum: 0, tabNum: 0 }

  render() {
    const { name: communityName, tcdPrefix } = this.props
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
        renderSubheader={() => (
          <Flex
            justifyContent="center"
            alignItems="center"
            width="100%"
            style={{
              height: '60px',
            }}
          >
            <TabButton
              active={this.state.tabNum === 0}
              onClick={() => this.setState({ tabNum: 0 })}
            >
              {'Overview 🔍'}
            </TabButton>
            <TabButton
              active={this.state.tabNum === 1}
              onClick={() => this.setState({ tabNum: 1 })}
            >
              {'Coding 👨‍💻'}
            </TabButton>
            <TabButton
              active={this.state.tabNum === 2}
              onClick={() => this.setState({ tabNum: 2 })}
            >
              {'Specification 📝'}
            </TabButton>
          </Flex>
        )}
        headerImage={IntegrationHeader}
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
          <Text fontSize="24px" mt="28px" mx="80px" fontWeight={900}>
            {this.state.tabNum === 0 && 'Overview 🔍'}
            {this.state.tabNum === 1 && 'Coding 👨‍💻'}
            {this.state.tabNum === 2 && 'Specification 📝'}
          </Text>
          {this.state.tabNum === 0 && (
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
            </React.Fragment>
          )}
          {this.state.tabNum === 1 && (
            <React.Fragment>
              <Text
                lineHeight={1.65}
                fontWeight={700}
                fontSize="18px"
                mt="30px"
                mx="80px"
              >
                Example Situation
              </Text>
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
                py="5px"
                pl="5px"
                pr="25px"
                style={{
                  position: 'relative',
                  border: '1px solid #c8cfff',
                  minHeight: '50px',
                  borderRadius: '4px',
                }}
              >
                <Flex
                  bg="white"
                  style={{
                    right: '-17px',
                    minWidth: '37px',
                    minHeight: '37px',
                    borderRadius: '4px',
                    position: 'absolute',
                    border: '1px solid #c8cfff',
                    transform: 'matrix(0.5, -0.7071, 0.5, 0.7071, 0, 0)',
                  }}
                />
                <Flex
                  bg="white"
                  style={{
                    top: '0px',
                    right: '0px',
                    minWidth: '30px',
                    minHeight: '48px',
                    position: 'absolute',
                    borderRadius: '4px',
                  }}
                />
                <Pointer
                  isSelected={this.state.codingStepNum === 2}
                  onClick={() => this.setState({ codingStepNum: 2 })}
                >
                  Step # 3: Call
                  <Text
                    bg={this.state.codingStepNum === 2 ? '#3c55f9' : '#fbfbfb'}
                    color={this.state.codingStepNum === 2 ? 'white' : '#ff5252'}
                    mx="5px"
                    p="5px"
                    style={{
                      borderRadius: '4px',
                      border:
                        this.state.codingStepNum === 2
                          ? '0px'
                          : '1px solid #eaeaea',
                      fontFamily: 'Source Code Pro',
                    }}
                  >
                    query
                  </Text>
                  Function
                </Pointer>
                <Pointer
                  isSelected={this.state.codingStepNum === 1}
                  onClick={() => this.setState({ codingStepNum: 1 })}
                >
                  Step # 2: Add
                  <Text
                    bg={this.state.codingStepNum === 1 ? '#3c55f9' : '#fbfbfb'}
                    color={this.state.codingStepNum === 1 ? 'white' : '#ff5252'}
                    ml="5px"
                    p="5px"
                    style={{
                      borderRadius: '4px',
                      border:
                        this.state.codingStepNum === 1
                          ? '0px'
                          : '1px solid #eaeaea',
                      fontFamily: 'Source Code Pro',
                    }}
                  >
                    QueryInterface
                  </Text>
                </Pointer>
                <Pointer
                  isSelected={this.state.codingStepNum === 0}
                  onClick={() => this.setState({ codingStepNum: 0 })}
                >
                  Step # 1: Create
                  <Text
                    bg={this.state.codingStepNum === 0 ? '#3c55f9' : '#fbfbfb'}
                    color={this.state.codingStepNum === 0 ? 'white' : '#ff5252'}
                    ml="5px"
                    p="5px"
                    fontSize="12px"
                    style={{
                      borderRadius: '4px',
                      border:
                        this.state.codingStepNum === 0
                          ? '0px'
                          : '1px solid #eaeaea',
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
          {this.state.tabNum === 2 && (
            <React.Fragment>
              <Flex flexDirection="column" mt="30px" pl="10px" mx="80px">
                <Text lineHeight={1.65} fontWeight={500} fontSize="16px">
                  The specification of calling query function only have 3 things
                  to concern.
                </Text>
                <Text lineHeight={1.65} fontWeight={500} fontSize="16px">
                  1. How much to pay per each query ↓.
                </Text>
                <Text lineHeight={1.65} fontWeight={500} fontSize="16px">
                  2. How a single key of this TCD is form ↓.
                </Text>
                <Text lineHeight={1.65} fontWeight={500} fontSize="16px">
                  3. How to decode the return result ↓.
                </Text>
              </Flex>
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
        </PageContainer>
      </PageStructure>
    )
  }
}
