import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Button } from 'ui/common'
import { communityDetailSelector } from 'selectors/communities'
import PageStructure from 'components/DataSetPageStructure'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import {
  SportCountByTypeFetcher,
  SportByTypeFetcher,
  SportProvidersByTypeTimeTeamFetcher,
} from 'data/fetcher/SportFetcher'
import SportTable from 'components/table/SportTable'
import Loading from 'components/Loading'
import { createLoadingButton } from 'components/BaseButton'

const LoadMoreButton = createLoadingButton(styled(Button)`
  width: 200px;
  height: 40px;
  background-color: #7c84a6;
  margin: 10px 0px;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, #5269ff, #4890ff);
`)

const renderDataPoints = (
  tcdAddress,
  state,
  matches,
  currentSportLength,
  loadMoreList,
  onSearchTeam,
) => {
  const { type, home: searchHome, away: searchAway } = state
  return (
    <React.Fragment>
      <Box mt={3}>
        <FlipMove>
          {matches.map(
            ({
              lastUpdate,
              time,
              hasStartTime,
              home,
              away,
              homeFullName,
              awayFullName,
              scoreHome,
              scoreAway,
              keyOnChain,
            }) => (
              <DataPoint
                key={`${time.valueOf()}/${home}/${away}`}
                keyOnChain={keyOnChain}
                label={`${time.format(
                  hasStartTime ? 'YYYY/MM/DD hh:mm a' : 'YYYY/MM/DD',
                )}: ${homeFullName} - ${awayFullName}`}
                k={time}
                v={() => (
                  <Flex mr="-20px">
                    <Card
                      flex="0 0 auto"
                      bg="white"
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
                        color="#4a4a4a"
                      >
                        {scoreHome} - {scoreAway}
                      </Text>
                    </Card>
                  </Flex>
                )}
                updatedAt={lastUpdate}
              >
                <SportProvidersByTypeTimeTeamFetcher
                  tcdAddress={tcdAddress}
                  keyOnChain={keyOnChain}
                  type={type}
                  time={time.format('YYYYMMDD')}
                  home={home}
                  away={away}
                  startTime={hasStartTime ? time.format('HHmm') : '9999'}
                >
                  {({ fetching, data }) =>
                    fetching ? (
                      <Loading
                        height={214}
                        width={922}
                        rects={[
                          [24, 6, 922 - 48, 28, 8],
                          [24, 36 + 8 + 4, 922 - 48, 32 - 8, 8],
                          [24, 36 + 8 + 4 + 32, 922 - 48, 32 - 8, 8],
                          [24, 36 + 8 + 4 + 32 * 2, 922 - 48, 32 - 8, 8],
                          [24, 36 + 8 + 4 + 32 * 3, 922 - 48, 32 - 8, 8],
                          [24, 36 + 8 + 4 + 32 * 4, 922 - 48, 32 - 8, 8],
                        ]}
                      />
                    ) : (
                      <React.Fragment>
                        <SportTable mb={2} data={data} />
                      </React.Fragment>
                    )
                  }
                </SportProvidersByTypeTimeTeamFetcher>
              </DataPoint>
            ),
          )}
        </FlipMove>
      </Box>
      <SportCountByTypeFetcher type={type} home={searchHome} away={searchAway}>
        {({ fetching, data }) =>
          !data ||
          fetching ||
          currentSportLength == 0 ||
          currentSportLength >= data ||
          searchHome ||
          searchAway ? null : (
            <Flex width="100%" justifyContent="center" alignItems="center">
              <LoadMoreButton onClick={loadMoreList}>
                Load More Data
              </LoadMoreButton>
            </Flex>
          )
        }
      </SportCountByTypeFetcher>
    </React.Fragment>
  )
}

class SportPage extends React.Component {
  state = {
    numDataPoints: 0,
    type: 'EPL',
    nSportList: 10,
    home: null,
    away: null,
  }

  changeType(type) {
    this.setState({
      type,
      nSportList: 10,
      home: null,
      away: null,
    })
  }

  async loadMoreList(forceFetch) {
    const currentLength = this.currentSportLength
    this.setState({
      nSportList: this.state.nSportList + 10,
    })
    await new Promise(r => {
      const fetchChecker = setInterval(() => {
        forceFetch(true, true)
      }, 1500)
      const checker = setInterval(() => {
        if (this.currentSportLength > currentLength) {
          clearInterval(checker)
          clearInterval(fetchChecker)
          r()
        }
      }, 500)
    })
  }

  onSearchTeam(forceFetch, teamType, team) {
    this.setState(
      {
        [teamType]: team,
      },
      () => forceFetch(true, true),
    )
  }

  render() {
    const { tcdAddress, tcdPrefix } = this.props
    return (
      <PageStructure
        renderHeader={() => (
          <Flex
            flexDirection="column"
            pl="52px"
            width="100%"
            style={{ height: '100%' }}
            justifyContent="center"
          >
            <Text
              fontSize="27px"
              color="white"
              fontWeight="900"
              width="50%"
              style={{ lineHeight: '38px' }}
            >
              On-chain Data You Can Trust Readily Available for Ethereum Smart
              Contract
            </Text>
            <Text
              fontSize="18px"
              color="white"
              fontWeight="500"
              width="60%"
              style={{ lineHeight: '33px' }}
            >
              Token holders collectively curate trustworthy data providers. By
              staking their tokens, they earn a portion of fee from the
              providers.
            </Text>
          </Flex>
        )}
        renderSubheader={() => (
          <Flex
            width="100%"
            alignItems="center"
            color="#5269ff"
            pl="52px"
            style={{ height: '60px' }}
          >
            <Text fontWeight="900">
              {`${this.state.numDataPoints} Keys Available`}
            </Text>
          </Flex>
        )}
        {...this.props}
      >
        <SportByTypeFetcher
          tcdAddress={tcdAddress}
          tcdPrefix={tcdPrefix}
          setNumDataPoints={ndp => this.setState({ numDataPoints: ndp })}
        >
          {({ fetching, data, forceFetch }) => {
            if (fetching) {
              return (
                <Loading
                  height={281}
                  width={924}
                  rects={[
                    [0, 0, 120, 32],
                    [880, 0, 32, 32],
                    [0, 52, 924, 61],
                    [0, 135, 924, 61],
                    [0, 218, 924, 61],
                  ]}
                />
              )
            } else {
              this.currentSportLength = data.length
              return renderDataPoints(
                tcdAddress,
                this.state,
                data,
                this.currentSportLength,
                this.loadMoreList.bind(this, forceFetch),
                this.onSearchTeam.bind(this, forceFetch),
              )
            }
          }}
        </SportByTypeFetcher>
      </PageStructure>
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
