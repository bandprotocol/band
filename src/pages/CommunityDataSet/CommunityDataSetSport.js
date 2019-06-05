import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Button, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import PageContainer from 'components/PageContainer'
import Snippet from 'components/Snippet'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import {
  SportCountByTypeFetcher,
  SportByTypeFetcher,
  SportProvidersByTypeTimeTeamFetcher,
} from 'data/fetcher/SportFetcher'
import SportTable from 'components/table/SportTable'
import DatasetTab from 'components/DatasetTab'
import Loading from 'components/Loading'
import { createLoadingButton } from 'components/BaseButton'
import SearchSelect from 'components/SearchSelect'
import { getOptionsByType } from 'utils/sportTeam'

import SoccerSrc from 'images/dataset-soccer.png'
import BasketballSrc from 'images/dataset-basketball.png'
import AmericanFootballSrc from 'images/dataset-americanfootball.png'
import BaseballSrc from 'images/dataset-baseball.png'

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
  { type, home: searchHome, away: searchAway },
  matches,
  currentSportLength,
  loadMoreList,
  onSearchTeam,
) => (
  <React.Fragment>
    <Flex alignItems="center" justifyContent="space-between">
      <Heading>{matches.length} Ðata Points</Heading>
      <Flex width="30%">
        <SearchSelect
          options={getOptionsByType(type)}
          placeholder="Home"
          onSearch={value => onSearchTeam('home', value)}
        />
        <SearchSelect
          options={getOptionsByType(type)}
          placeholder="Away"
          onSearch={value => onSearchTeam('away', value)}
        />
      </Flex>
    </Flex>
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
                  <Card flex="0 0 auto" py={2} px={3}>
                    <Text
                      ml="auto"
                      fontFamily="code"
                      fontSize={15}
                      fontWeight="bold"
                      textAlign="right"
                      style={{ width: 30 }}
                    >
                      {home}
                    </Text>
                  </Card>
                  <Card
                    flex="0 0 auto"
                    bg="#6A6B81"
                    px={1}
                    borderRadius="3px"
                    style={{ lineHeight: '36px' }}
                  >
                    <Text
                      fontFamily="code"
                      fontSize={14}
                      fontWeight="bold"
                      textAlign="center"
                      color="white"
                      style={{ width: 88 }}
                    >
                      {scoreHome} - {scoreAway}
                    </Text>
                  </Card>
                  <Card flex="0 0 auto" py={2} px={3}>
                    <Text
                      ml="auto"
                      fontFamily="code"
                      fontSize={15}
                      fontWeight="bold"
                      textAlign="left"
                      style={{ width: 30 }}
                    >
                      {away}
                    </Text>
                  </Card>
                </Flex>
              )}
              updatedAt={lastUpdate}
            >
              <SportProvidersByTypeTimeTeamFetcher
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

export default class SportPage extends React.Component {
  state = {
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
    return (
      <PageStructure
        renderHeader={() => (
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Text fontSize="36px" fontWeight="900">
              Sport Events
            </Text>
            <Text fontSize="20px" mt={3}>
              Accurate live scores from soccer, basketball, American football
              and baseball.
            </Text>
          </Flex>
        )}
        {...this.props}
      >
        <PageContainer>
          <Flex mt="-100px" mx="-8px" justifyContent="center">
            <SportCountByTypeFetcher type="EPL">
              {({ fetching, data }) => (
                <DatasetTab
                  mx="8px"
                  title="Soccer"
                  subtitle={fetching ? 'Loading ...' : `${data} Matches`}
                  src={SoccerSrc}
                  active={this.state.type === 'EPL'}
                  onClick={() => this.changeType('EPL')}
                />
              )}
            </SportCountByTypeFetcher>
            <SportCountByTypeFetcher type="NBA">
              {({ fetching, data }) => (
                <DatasetTab
                  mx="8px"
                  title="Basketball"
                  subtitle={fetching ? 'Loading ...' : `${data} Matches`}
                  src={BasketballSrc}
                  active={this.state.type === 'NBA'}
                  onClick={() => this.changeType('NBA')}
                />
              )}
            </SportCountByTypeFetcher>
            <SportCountByTypeFetcher type="NFL">
              {({ fetching, data }) => (
                <DatasetTab
                  mx="8px"
                  title="American Football"
                  subtitle={fetching ? 'Loading ...' : `${data} Matches`}
                  src={AmericanFootballSrc}
                  active={this.state.type === 'NFL'}
                  onClick={() => this.changeType('NFL')}
                />
              )}
            </SportCountByTypeFetcher>
            <SportCountByTypeFetcher type="MLB">
              {({ fetching, data }) => (
                <DatasetTab
                  mx="8px"
                  title="Baseball"
                  subtitle={fetching ? 'Loading ...' : `${data} Matches`}
                  src={BaseballSrc}
                  active={this.state.type === 'MLB'}
                  onClick={() => this.changeType('MLB')}
                />
              )}
            </SportCountByTypeFetcher>
          </Flex>
          <Box mt="24px">
            <Snippet dataset="sport" />
          </Box>
          <Box mt={5}>
            <SportByTypeFetcher
              type={this.state.type}
              nList={this.state.nSportList}
              home={this.state.home}
              away={this.state.away}
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
                    this.state,
                    data,
                    this.currentSportLength,
                    this.loadMoreList.bind(this, forceFetch),
                    this.onSearchTeam.bind(this, forceFetch),
                  )
                }
              }}
            </SportByTypeFetcher>
          </Box>
        </PageContainer>
      </PageStructure>
    )
  }
}
