import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Text, Button, AbsoluteLink } from 'ui/common'
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
import { faDownload, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

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
  fontWight: 'bold',
  ml: '52px',
})`
  height: 30px;
  border-radius: 14px;
  background-color: #eeeeee;
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

const renderDataPoints = (tcdAddress, state, requests) => {
  return (
    <React.Fragment>
      <Box mt={3}>
        <FlipMove>
          {Object.keys(requests).map(key => {
            const lastRequest = requests[key][0]
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
                  <Flex
                    alignItems="center"
                    pt="3px"
                    width="700px"
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    <Logo src={image} />
                    <Text fontSize="15px" fontWeight="bold" color="#393939">
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
                    >
                      {requests[key].length} Keys
                    </Text>
                  </Flex>
                )}
                updatedAt={lastRequest.lastUpdate}
              >
                <React.Fragment>
                  <Flex style={{ borderTop: '2px solid #f3f7ff' }}>
                    <Flex justifyContent="space-between" width="100%">
                      <Flex alignItems="center" pt="10px" pb="16px">
                        <Method>{method}</Method>
                        <Text
                          color="#4a4a4a"
                          fontSize="14px"
                          fontWeight="600"
                          ml="21px"
                        >
                          {url}
                        </Text>
                      </Flex>
                      <Flex alignItems="center" mr="50px">
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
                            <Text
                              fontSize="11px"
                              color="#fff"
                              fontWeight="bold"
                            >
                              TEST CALL
                            </Text>
                            <FontAwesomeIcon
                              icon={faExchangeAlt}
                              color="#fff"
                            />
                          </Flex>
                        </TestCallButton>
                      </Flex>
                    </Flex>
                  </Flex>
                  <WebRequestTable mb={2} data={requests[key]} />
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
    const { tcdAddress, tcdPrefix } = this.props
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
                  {fetching ? '' : `${Object.keys(data).length} Keys Available`}
                </Text>
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
                {renderDataPoints(tcdAddress, this.state, data)}
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

export default connect(mapStateToProps)(WebRequestPage)
