import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Text, Card } from 'ui/common'
import DataHeader from 'components/DataHeader'
import styled from 'styled-components'
import { communityDetailSelector } from 'selectors/communities'
import PageStructure from 'components/DataSetPageStructure'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { RequestByTCDFetcher } from 'data/fetcher/WebRequestFetcher'
import Loading from 'components/Loading'

const renderDataPoints = (tcdAddress, state, requests) => {
  return (
    <React.Fragment>
      <Box mt={3}>
        <FlipMove>
          {Object.keys(requests).map(key => (
            <DataPoint
              key={requests[key][0].lastUpdate}
              keyOnChain={requests[key].key}
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
                  {key}
                </Flex>
              )}
              v={() => (
                <Flex mr="-20px">
                  <Card
                    flex="0 0 auto"
                    bg="#eaf2ff"
                    px="auto"
                    mx="20px"
                    borderRadius="4px"
                    style={{
                      lineHeight: '36px',
                      width: '84px',
                      height: '35px',
                    }}
                  >
                    <Text
                      fontFamily="code"
                      fontSize={14}
                      fontWeight="bold"
                      textAlign="center"
                      color="#506fff"
                    >
                      {requests[key].value}
                    </Text>
                  </Card>
                </Flex>
              )}
              updatedAt={requests[key][0].lastUpdate}
            >
              {/* Inside */}
              PPPPP
            </DataPoint>
          ))}
        </FlipMove>
      </Box>
    </React.Fragment>
  )
}

class SportPage extends React.Component {
  state = {
    nSportList: 10,
    currentPage: 1,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tcdAddress !== this.props.tcdAddress) {
      this.setState({
        currentPage: 1,
      })
    }
  }

  render() {
    const { tcdAddress, tcdPrefix } = this.props
    const { currentPage, nSportList } = this.state
    return (
      <RequestByTCDFetcher tcdAddress={tcdAddress} {...this.state}>
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
                  [0, 80 * 4, 1141, 60],
                  [0, 80 * 5, 1141, 60],
                  [0, 80 * 6, 1141, 60],
                  [0, 80 * 7, 1141, 60],
                  [0, 80 * 8, 1141, 60],
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

export default connect(mapStateToProps)(SportPage)
