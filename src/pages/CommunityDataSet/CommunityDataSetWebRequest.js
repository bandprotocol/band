import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Text, Button, AbsoluteLink, Image } from 'ui/common'
import DataHeader from 'components/DataHeader'
import styled from 'styled-components'
import { communityDetailSelector } from 'selectors/communities'
import PageStructure from 'components/DataSetPageStructure'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { RequestByTCDFetcher } from 'data/fetcher/WebRequestFetcher'
import Loading from 'components/Loading'
import WebRequestTable from 'components/table/WebRequestTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import DualArrowSrc from 'images/dual-arrows.svg'
import { showModal } from 'actions'

import AddSymbol from 'images/add-symbol.svg'

const CustomButton = styled(Button).attrs({
  variant: 'gradientBlue',
})`
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
  height: 34px;
  padding: 0 18px 2px;
  align-self: flex-end;
  margin-bottom: 2px;
`

const Logo = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 14px;
  background-image: url(${p => p.src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`

const Method = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  width: '60px',
  fontSize: '14px',
  color: '#4a4a4a',
  ml: '52px',
})`
  height: 30px;
  border-radius: 14px;
  background-color: #eeeeee;
  font-weight: bold;
  font-family: bio-sans;
`

const ApiSpecButton = styled(Button).attrs({
  variant: 'outline',
  width: '113px',
  mx: '14px',
})`
  border-radius: 14px;
  border: 0.8px solid #4a4a4a;
  padding: 7px 14px;
  height: 28px;
  cursor: pointer;
`

const TestCallButton = styled(Button).attrs({
  variant: 'outline',
  width: '113px',
})`
  border-radius: 14px;
  border: 0;
  padding: 7px 14px;
  height: 28px;
  cursor: pointer;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to right, #4a4a4a, #656565);
`

const renderDataPoints = (requests, sortedIndex) => {
  return (
    <React.Fragment>
      <Box mt={3}>
        <FlipMove>
          {Object.keys(requests).map((key, index) => {
            const lastRequest = requests[sortedIndex[index].key][0]
            const request = requests[sortedIndex[index].key]
            const {
              meta: {
                info: { description, image },
              },
              request: { url, method },
            } = lastRequest
            return (
              <DataPoint
                key={lastRequest.lastUpdate}
                keyOnChain={lastRequest.key}
                label={() => (
                  <Flex alignItems="center" pt="3px">
                    <Logo src={image} />
                    <Text
                      fontSize="15px"
                      fontWeight="bold"
                      color="#393939"
                      flex={1}
                      style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        minWidth: 0,
                      }}
                    >
                      {description}
                    </Text>
                  </Flex>
                )}
                v={() => (
                  <Flex mr="10px">
                    <Text
                      fontFamily="code"
                      fontSize={14}
                      fontWeight="600"
                      textAlign="center"
                      color="#4a4a4a"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {requests[key].length} Keys
                    </Text>
                  </Flex>
                )}
                updatedAt={lastRequest.lastUpdate}
              >
                <React.Fragment>
                  <Flex
                    justifyContent="space-between"
                    width="100%"
                    style={{ borderTop: '2px solid #f3f7ff' }}
                  >
                    <Flex
                      alignItems="center"
                      pt="10px"
                      pb="16px"
                      flex={1}
                      style={{ minWidth: 0 }}
                    >
                      <Method>{method}</Method>
                      <Text
                        color="#4a4a4a"
                        fontSize="14px"
                        fontWeight="600"
                        ml="21px"
                        flex={1}
                        style={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}
                      >
                        {url}
                      </Text>
                    </Flex>
                    <Flex alignItems="center" mr="50px" flex="0 auto">
                      <AbsoluteLink
                        href={`https://ipfs.io/ipfs/${lastRequest.ipfsPath}`}
                      >
                        <ApiSpecButton>
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Text
                              fontSize="11px"
                              color="#4a4a4a"
                              fontWeight="bold"
                            >
                              API SPEC
                            </Text>
                            <FontAwesomeIcon
                              icon={faDownload}
                              color="#4a4a4a"
                            />
                          </Flex>
                        </ApiSpecButton>
                      </AbsoluteLink>
                      <TestCallButton onClick={() => alert('Surprise me!')}>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Text fontSize="11px" color="#fff" fontWeight="bold">
                            TEST CALL
                          </Text>
                          <Image src={DualArrowSrc} />
                        </Flex>
                      </TestCallButton>
                    </Flex>
                  </Flex>
                  <WebRequestTable mb={2} data={request} />
                </React.Fragment>
              </DataPoint>
            )
          })}
        </FlipMove>
      </Box>
    </React.Fragment>
  )
}

class WebRequestPage extends React.Component {
  render() {
    const { tcdAddress } = this.props
    return (
      <RequestByTCDFetcher tcdAddress={tcdAddress}>
        {({ fetching, data }) => (
          <PageStructure
            renderHeader={() => (
              <DataHeader
                lines={[
                  'On-chain Data You Can Trust',
                  'Readily Available for Ethereum Smart Contract',
                  'Token holders collectively curate trustworthy data providers.',
                  'By staking their tokens, they earn a portion of fee from the providers.',
                ]}
              />
            )}
            renderSubheader={() => (
              <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                color="#4a4a4a"
                pl="52px"
              >
                <Text fontSize="15px" fontFamily="head" fontWeight="600">
                  {fetching
                    ? ''
                    : `${
                        Object.keys(data.requests).length
                      } Endpoints Available`}
                </Text>
                <Flex ml="auto" mr="20px">
                  <CustomButton onClick={this.props.showNewEndpoint}>
                    <Image src={AddSymbol} height="12px" mt="-1px" mr={2} />
                    NEW ENDPOINT
                  </CustomButton>
                </Flex>
              </Flex>
            )}
            {...this.props}
          >
            {fetching ? (
              <Loading
                height={700}
                width={1141}
                rects={[
                  [0, 0, 1141, 60],
                  [0, 80, 1141, 60],
                  [0, 80 * 2, 1141, 60],
                  [0, 80 * 3, 1141, 60],
                  // [0, 80 * 4, 1141, 60],
                  // [0, 80 * 5, 1141, 60],
                  // [0, 80 * 6, 1141, 60],
                  // [0, 80 * 7, 1141, 60],
                  // [0, 80 * 8, 1141, 60],
                ]}
              />
            ) : (
              <React.Fragment>
                {renderDataPoints(data.requests, data.sortedIndex)}
              </React.Fragment>
            )}
          </PageStructure>
        )}
      </RequestByTCDFetcher>
    )
  }
}

const mapStateToProps = (state, { communityAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  if (!community) return {}

  let tcdPrefix = null
  try {
    tcdPrefix = community
      .get('tcds')
      .get(tcdAddress)
      .get('prefix')
  } catch (e) {}

  return {
    name: community.get('name'),
    address: community.get('address'),
    tcdAddress: tcdAddress,
    tcdPrefix: tcdPrefix.slice(0, -1),
  }
}

const mapDispatchToProps = (dispatch, { tcdAddress }) => ({
  showNewEndpoint: () =>
    dispatch(
      showModal('NEW_WEB_REQUEST', {
        tcdAddress,
      }),
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebRequestPage)
