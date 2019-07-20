import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Text, Card } from 'ui/common'
import DataHeader from 'components/DataHeader'
import styled from 'styled-components'
import { communityDetailSelector } from 'selectors/communities'
import PageStructure from 'components/DataSetPageStructure'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { getDetail } from 'data/detail/sport'
import {
  SportCountByTCDFetcher,
  SportByTCDFetcher,
  SportProvidersByTypeTimeTeamFetcher,
} from 'data/fetcher/SportFetcher'
import SportTable from 'components/table/SportTable'
import Loading from 'components/Loading'
import SearchSelect from 'components/SearchSelect'
import { getOptionsByPrefix } from 'utils/sportTeam'
import PaginationRender from 'components/Pagination/PaginationRender'

const LogoTeam = styled(Flex).attrs({
  mx: '5px',
})`
  background-image: url(${p => p.src});
  width: ${p => p.size};
  height: ${p => p.size};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`

const renderDataPoints = (tcdAddress, state, matches) => {
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
                label={() => (
                  <Flex alignItems="center" pt="3px">
                    {time.format(
                      hasStartTime ? 'YYYY/MM/DD hh:mm a' : 'YYYY/MM/DD',
                    )}
                    :{' '}
                    <LogoTeam
                      src={getDetail(homeFullName, 'home').logo}
                      size="30px"
                    />
                    {homeFullName} {` vs. `}
                    <LogoTeam
                      src={getDetail(awayFullName, 'away').logo}
                      size="30px"
                    />
                    {awayFullName}
                  </Flex>
                )}
                k={time}
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
                  time={time.format('YYYYMMDD')}
                  home={home}
                  away={away}
                  startTime={hasStartTime ? time.format('HHmm') : '9999'}
                >
                  {({ fetching, data }) =>
                    fetching ? (
                      <Loading
                        height={90}
                        width={922}
                        rects={[
                          [24, 6, 922 - 48, 28, 8],
                          [24, 36 + 8 + 4, 922 - 48, 32 - 8, 8],
                          // [24, 36 + 8 + 4 + 32, 922 - 48, 32 - 8, 8],
                          // [24, 36 + 8 + 4 + 32 * 2, 922 - 48, 32 - 8, 8],
                          // [24, 36 + 8 + 4 + 32 * 3, 922 - 48, 32 - 8, 8],
                          // [24, 36 + 8 + 4 + 32 * 4, 922 - 48, 32 - 8, 8],
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
    </React.Fragment>
  )
}

class SportPage extends React.Component {
  state = {
    nSportList: 10,
    currentPage: 1,

    // search
    home: null,
    away: null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tcdAddress !== this.props.tcdAddress) {
      this.setState({
        currentPage: 1,
      })
    }
  }

  onSearchTeam(teamType, team) {
    this.setState({
      [teamType]: team,
    })
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { tcdAddress, tcdPrefix } = this.props
    const { currentPage, nSportList } = this.state
    return (
      <SportCountByTCDFetcher tcdAddress={tcdAddress} {...this.state}>
        {({ fetching: countFetching, data: totalCount }) => (
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
                  {countFetching ? '' : `${totalCount} Keys Available`}
                </Text>
                <Flex mr="20px" width="330px" justifyConten="space-around">
                  <SearchSelect
                    options={getOptionsByPrefix(tcdPrefix)}
                    placeholder="Home"
                    onSearch={value => this.onSearchTeam('home', value)}
                  />
                  <SearchSelect
                    options={getOptionsByPrefix(tcdPrefix)}
                    placeholder="Away"
                    onSearch={value => this.onSearchTeam('away', value)}
                  />
                </Flex>
              </Flex>
            )}
            {...this.props}
          >
            <SportByTCDFetcher
              tcdAddress={tcdAddress}
              tcdPrefix={tcdPrefix}
              {...this.state}
            >
              {({ fetching, data, forceFetch }) => {
                if (fetching || countFetching) {
                  return (
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
                  )
                } else {
                  return (
                    <React.Fragment>
                      {renderDataPoints(tcdAddress, this.state, data)}
                    </React.Fragment>
                  )
                }
              }}
            </SportByTCDFetcher>
            <PaginationRender
              currentPage={currentPage}
              numberOfPages={Math.ceil(totalCount / nSportList) || 1}
              onChangePage={this.onChangePage.bind(this)}
            />
          </PageStructure>
        )}
      </SportCountByTCDFetcher>
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
