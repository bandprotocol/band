import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, AbsoluteLink, Image } from 'ui/common'
import PageContainer from 'components/PageContainer'
import PageStructure from 'components/DataSetPageStructure'
import Snippet from 'components/Snippet'
import Integration from 'data/Integration/index'
import DataHeader from 'components/DataHeader'
import { getTCDInfomation } from 'utils/tcds'
import IntegrationHeader from 'images/integration-header.svg'
import Overview1 from 'images/overview_1.svg'
import Overview2 from 'images/overview_2.svg'
import Overview3 from 'images/overview_3.svg'
import QueryResult from 'images/queryResult.svg'

const TabButton = styled(Flex).attrs({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})`
  font-family: bio-sans;
  background-color: transparent;
  cursor: pointer;
  font-weight: 500;
  height: 46px;
  color: #333;
  font-size: 15px;

  ${p =>
    p.active
      ? `
    font-weight: 600;
    background: rgba(36, 77, 255, 0.05);
    border-bottom: 2px solid #5269ff;


    &:first-child {
      border-bottom-left-radius: 10px;
    }
    &:last-child {
      border-bottom-right-radius: 10px;
    }
  `
      : `
    font-weight: 400;
  `}
`

const PointerLeftPart = styled(Flex)`
  position: relative;
  padding-left: 10px;
  font-size: 15px;
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

const Oval = ({ text, radius }) => (
  <Flex
    bg="#e7ecff"
    style={{
      minWidth: radius,
      minHeight: radius,
      maxWidth: radius,
      maxHeight: radius,
      borderRadius: '50%',
    }}
  >
    <Text color="#5269ff" fontWeight={900} m="auto">
      {text}
    </Text>
  </Flex>
)

const replaceAllAddresses = (text, address) => {
  if (!address) {
    return text
  }
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    const j = words[i].indexOf('0x')
    const wl = words[i].length
    if (j >= 0 && wl >= 42) {
      words[i] = words[i].slice(0, j) + address + words[i].slice(j + 42, wl)
    }
  }
  return words.join(' ')
}

const HighlightText = ({ text }) => {
  const words = text.split(' ')
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
          if (word[0] === '•') {
            return <HighlightSpan>{word.slice(1)}</HighlightSpan>
          } else if (word.includes('0x') && word.length > 40) {
            return <HighlightSpan>{word}</HighlightSpan>
          }
        } catch (e) {}
        return <React.Fragment>{word + ' '}</React.Fragment>
      })}
    </React.Fragment>
  )
}

const TwoColumnList = ({ list }) => (
  <Box pl={4}>
    {list.map(e => (
      <Flex flexDirection="row" mt="10px">
        <Text
          lineHeight="23px"
          fontWeight={500}
          fontSize="13px"
          style={{ minWidth: '20px' }}
        >
          {e[0]}
        </Text>
        <Text lineHeight="23px" fontWeight={500} fontSize="15px">
          <HighlightText text={e[1]} />
        </Text>
      </Flex>
    ))}
  </Box>
)

const getQueryFeeCode = address => `
// ${address} is TCD address
QueryInterface q = QueryInterface(${address});

// call q.queryPrice() to ask for query price
uint256 currentQueryPrice = q.queryPrice();
`

export default class CommunityIntegrationRender extends React.Component {
  state = { codingStepNum: 0, tabNum: 0 }

  constructor(props) {
    super(props)
    this.specRef = [React.createRef(), React.createRef(), React.createRef()]
    this.containerRef = React.createRef()
  }

  render() {
    let { name: communityName, tcdAddress, tcdPrefix } = this.props
    tcdAddress = tcdAddress || '0x'
    const info =
      (tcdPrefix && Integration[communityName][tcdPrefix]) ||
      Integration[communityName][Object.keys(Integration[communityName])[0]]

    const keyFormat = info.keyFormat[Object.keys(info.keyFormat)[0]]
    const overviews = info.overview
    const dataFormat = info.dataFormat

    const tcdInfo = getTCDInfomation(tcdPrefix + ':')

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
              height: '46px',
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
          ref={this.containerRef}
          style={{
            borderRadius: '8px',
            position: 'relative',
            boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Text
            fontSize="24px"
            mt="28px"
            mx="80px"
            fontFamily="head"
            fontWeight={900}
          >
            {this.state.tabNum === 0 && 'Overview 🔍'}
            {this.state.tabNum === 1 && 'Coding 👨‍💻'}
            {this.state.tabNum === 2 && 'Specification 📝'}
          </Text>
          {this.state.tabNum === 0 && (
            <React.Fragment>
              <Flex flexDirection="row">
                <Text
                  lineHeight={1.65}
                  fontWeight={500}
                  fontSize="15px"
                  mt="30px"
                  mx="80px"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  Welcome to Band Protocol's{' '}
                  <HighlightSpan>{tcdInfo.shortLabel}</HighlightSpan>dataset
                  integration. {overviews[0]}
                </Text>
              </Flex>
              <Flex
                flexDirection="row"
                mt="30px"
                pb="30px"
                mx="80px"
                style={{ borderBottom: '1px solid #e7ecff' }}
              >
                <Flex flex={1} flexDirection="row" justifyContent="center">
                  <Box>
                    <Flex flex={1} flexDirection="row" justifyContent="center">
                      <Text
                        lineHeight="20px"
                        fontWeight={700}
                        fontSize="16px"
                        fontFamily="head"
                        style={{ minWidth: '30px' }}
                      >
                        1.
                      </Text>
                      <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                        <HighlightText text={overviews[1]} />
                      </Text>
                    </Flex>
                    <br />
                    <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                      📌 See{' '}
                      <span
                        onClick={() => {
                          this.setState({ tabNum: 2 })
                          window.document.body.scrollTo(
                            0,
                            this.containerRef.current.offsetTop - 60,
                          )
                        }}
                        style={{
                          color: '#5269ff',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Specification
                      </span>{' '}
                      to learn how query keys are constructed.
                    </Text>
                  </Box>
                </Flex>
                <Flex flex={1} pr="20px" justifyContent="flex-end" mb="30px">
                  <Image src={Overview1} height="100%" />
                </Flex>
              </Flex>
              <Flex flexDirection="row" pt="60px" pb="20px" mr="40px">
                <Flex flex={2} mr="20px">
                  <Image src={Overview2} height="26 0px" />
                </Flex>
                <Flex ml={3} flex={1} flexDirection="column">
                  <Flex flexDirection="row" mt="10px">
                    <Text
                      lineHeight="20px"
                      fontWeight={700}
                      fontSize="16px"
                      fontFamily="head"
                      style={{ minWidth: '30px' }}
                    >
                      2.
                    </Text>
                    <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                      <HighlightText text="Query data from the chosen key:" />
                      <br />
                    </Text>
                  </Flex>
                  <TwoColumnList
                    list={[
                      [
                        '🔸',
                        `Declare Band Protocol's provided •QueryInterface.`,
                      ],
                      [
                        '🔸',
                        `Create a QueryInterface instance referencing to contract address ↴ ${tcdAddress} .`,
                      ],
                      [
                        '🔸',
                        `Call •query function with the •key along with the 0.001 ETH query fee.`,
                      ],
                    ]}
                  />
                  <br />
                  <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                    📌 See{' '}
                    <span
                      onClick={() => {
                        this.setState({ tabNum: 1 })
                        window.document.body.scrollTo(
                          0,
                          this.containerRef.current.offsetTop - 60,
                        )
                      }}
                      style={{
                        color: '#5269ff',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Coding
                    </span>{' '}
                    for code example.
                  </Text>
                </Flex>
              </Flex>
              <Flex
                flexDirection="row"
                pt="60px"
                mt="30px"
                mx="80px"
                style={{
                  borderTop: '1px solid #e7ecff',
                }}
              >
                <Flex flex={1} flexDirection="column">
                  <Flex flexDirection="row" mt="10px">
                    <Text
                      lineHeight="20px"
                      fontWeight={700}
                      fontSize="16px"
                      fontFamily="head"
                      style={{ minWidth: '30px' }}
                    >
                      3.
                    </Text>
                    <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                      <HighlightText text="The •query call returns a bundle of •output , •updatedAt , and •status ." />
                    </Text>
                  </Flex>
                  <TwoColumnList
                    list={[
                      [
                        '🔸',
                        `•output is the query's output, which can be decoded .`,
                      ],
                      [
                        '🔸',
                        `•updatedAt is the timestamp at which the data is updated.`,
                      ],
                      [
                        '🔸',
                        `•status is the query's status, one of •OK , •NOT_AVAILABLE , or •DISAGREEMENT .`,
                      ],
                    ]}
                  />
                  <br />
                  <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                    📌 See{' '}
                    <span
                      onClick={() => {
                        this.setState({ tabNum: 2 })
                        window.document.body.scrollTo(
                          0,
                          this.containerRef.current.offsetTop - 60,
                        )
                      }}
                      style={{
                        color: '#5269ff',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Specification
                    </span>{' '}
                    to learn how to parse the output data.
                  </Text>
                </Flex>
                <Flex flex={1} justifyContent="flex-end">
                  <Image src={Overview3} height="300px" />
                </Flex>
              </Flex>
              {/* <Flex
                mt="60px"
                mx="80px"
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
                    For more detail about overall dataset group work please
                    visit this{' '}
                    <AbsoluteLink
                      style={{ color: 'white', textDecoration: 'underline' }}
                      href="https://medium.com/bandprotocol"
                    >
                      article.
                    </AbsoluteLink>
                  </Text>
                </Flex>
              </Flex> */}
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
                fontSize="15px"
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
                pr="5px"
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
                      zIndex: 1,
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
                  <Text fontSize="15px" lineHeight={1.67} fontWeight={500}>
                    <HighlightText
                      text={replaceAllAddresses(
                        info.description[this.state.codingStepNum || 0],
                        tcdAddress,
                      )}
                    />
                  </Text>
                </Flex>
                <Snippet
                  code={replaceAllAddresses(
                    info.solidity[this.state.codingStepNum || 0],
                    tcdAddress,
                  )}
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
              <Flex flexDirection="column" mt="30px" mx="80px">
                <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                  The specification of calling query function only have 3 things
                  to concern.
                </Text>
                <Flex flexDirection="row" mt="30px">
                  {[
                    'How much ETH to pay per query?',
                    'How to build a query key?',
                    'How to decode the query result?',
                  ].map((e, i) => (
                    <Flex flex={1} flexDirection="column">
                      <Oval radius="30px" text={i + 1} />
                      <Text
                        mt="15px"
                        lineHeight={1.65}
                        fontWeight={900}
                        fontSize="15px"
                      >
                        {e}
                      </Text>
                      <Text
                        mt="5px"
                        color="#5269ff"
                        onClick={() =>
                          window.document.body.scrollTo(
                            0,
                            this.specRef[i].current.offsetTop +
                              window.innerHeight / 2,
                          )
                        }
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        Read more
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex
                mt="30px"
                mx="80px"
                flexDirection="column"
                style={{ borderTop: '1px solid #e7ecff' }}
                ref={this.specRef[0]}
              >
                <Text fontSize="20px" fontWeight={900} mt="30px">
                  How much to pay per query? 💸
                </Text>
                <Text fontSize="15px" mt="30px">
                  Your smart contract can know this by asking TCD contract via
                  function <HighlightSpan>queryPrice()</HighlightSpan>.
                </Text>
                <Flex mt="30px">
                  <Snippet code={getQueryFeeCode(tcdAddress)} />
                </Flex>
                {/* <Text mt="30px" fontSize="15px">
                  For more details, please visit{' '}
                  <span
                    onClick={() => {
                      this.setState({ tabNum: 1, codingStepNum: 2 })
                      window.document.body.scrollTo(
                        0,
                        this.containerRef.current.offsetTop - 60,
                      )
                    }}
                    style={{
                      color: '#5269ff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    Coding
                  </span>{' '}
                  tab
                </Text> */}
                <Text fontSize="15px" mt="30px" lineHeight="1.65">
                  Query prices are controlled by dataset token holders via
                  governance parameters voting. Therefore, it is important to
                  note that different datasets may have different query prices
                </Text>
              </Flex>
              <Flex
                mt="30px"
                mx="80px"
                flexDirection="column"
                style={{ borderTop: '1px solid #e7ecff' }}
                ref={this.specRef[1]}
              >
                <Text fontSize="20px" fontWeight={900} mt="30px">
                  {`How to build a query key? 🔑`}
                </Text>
                <Text
                  lineHeight={1.65}
                  fontWeight={500}
                  fontSize="15px"
                  mt="30px"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <HighlightText text={keyFormat.description} />
                </Text>
                <Flex mt="30px" flexWrap="wrap">
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
                        ml="20px"
                        fontSize={key[1].length >= 32 ? '13px' : '15px'}
                        fontWeight={500}
                      >
                        <HighlightText text={key[1]} />
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Flex
                mt="30px"
                mx="80px"
                flexDirection="column"
                style={{ borderTop: '1px solid #e7ecff' }}
                ref={this.specRef[2]}
              >
                <Text fontSize="20px" fontWeight={900} mt="30px">
                  How to decode the query result? ❓
                </Text>
                <Text my="15px">
                  Result returned from calling query function consists of 3
                  parts.
                </Text>
                <Flex width={1 / 2} mb="15px" flexDirection="row">
                  <Flex flex={1}>
                    <Text lineHeight={1.65} fontWeight={900} fontSize="15px">
                      1. output
                    </Text>
                  </Flex>
                  <Flex flex={1}>
                    <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                      The raw output value
                    </Text>
                  </Flex>
                </Flex>
                <Flex width={1 / 2} mb="15px" flexDirection="row">
                  <Flex flex={1}>
                    <Text lineHeight={1.65} fontWeight={900} fontSize="15px">
                      2. updatedAt
                    </Text>
                  </Flex>
                  <Flex flex={1}>
                    <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                      Last update time
                    </Text>
                  </Flex>
                </Flex>
                <Flex width={1 / 2} mb="15px" flexDirection="row">
                  <Flex flex={1}>
                    <Text lineHeight={1.65} fontWeight={900} fontSize="15px">
                      3. status
                    </Text>
                  </Flex>
                  <Flex flex={1}>
                    <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                      The status of this query
                    </Text>
                  </Flex>
                </Flex>
                <Image src={QueryResult} width="100%" />
                <Text fontSize="18px" fontWeight={500} mt="20px">
                  {`Output decoding 🧬⚙`}
                </Text>
                <Text
                  mt="30px"
                  lineHeight={1.65}
                  fontWeight={500}
                  fontSize="15px"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <HighlightText text={dataFormat.description} />
                </Text>
                {/* <Text lineHeight={1.65} fontWeight={500} fontSize="15px">
                  See{' '}
                  <span
                    onClick={() => {
                      this.setState({ tabNum: 1, codingStepNum: 0 })
                      window.document.body.scrollTo(
                        0,
                        this.containerRef.current.offsetTop - 60,
                      )
                    }}
                    style={{
                      color: '#5269ff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    Coding
                  </span>{' '}
                  tab for, well, example.
                </Text> */}
              </Flex>
            </React.Fragment>
          )}
        </PageContainer>
      </PageStructure>
    )
  }
}
