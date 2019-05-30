import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Image, Button, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import PageContainer from 'components/PageContainer'
import Snippet from 'components/Snippet'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { createLoadingButton } from 'components/BaseButton'
import {
  LotteryCountByTypeFetcher,
  LotteryByTypeFetcher,
  LotteryProvidersByTypeTimeFetcher,
} from 'data/fetcher/LotteryFetcher'
import LotteryTable from 'components/table/LotteryTable'
import DatasetTab from 'components/DatasetTab'
import Loading from 'components/Loading'

import MmnSrc from 'images/dataset-megamillions.png'
import PwbSrc from 'images/dataset-powerball.png'

const pad = n => `0${n}`.slice(-2)

const Ball = styled(Text).attrs(p => ({
  mr: p.mr || 2,
  fontSize: 15,
  fontFamily: 'code',
  fontWeight: '700',
  color: 'white',
}))`
  height: 36px;
  width: 36px;
  line-height: 36px;
  background: ${p => (p.red ? colors.gradient.purple : '#6a6b81')};
  border-radius: 50%;
  text-align: center;
`

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
  type,
  lotteries,
  currentLotteryLength,
  loadMoreList,
) => (
  <React.Fragment>
    <Flex>
      <Heading>{lotteries.length} Ðata Points</Heading>
      <Box ml="auto" mr={3}>
        <Text fontSize={26}>
          <ion-icon name="md-search" />
        </Text>
      </Box>
    </Flex>
    <Box mt={3}>
      <FlipMove>
        {lotteries.map(
          ({
            time,
            lastUpdate,
            redBall,
            whiteBall1,
            whiteBall2,
            whiteBall3,
            whiteBall4,
            whiteBall5,
            mul,
            keyOnChain,
          }) => (
            <DataPoint
              key={time.valueOf()}
              label={time.format('ddd, MMMM DD YYYY')}
              keyOnChain={keyOnChain}
              k={time}
              v={() => (
                <Flex alignItems="center" mr="-8px">
                  <Ball>{pad(whiteBall1)}</Ball>
                  <Ball>{pad(whiteBall2)}</Ball>
                  <Ball>{pad(whiteBall3)}</Ball>
                  <Ball>{pad(whiteBall4)}</Ball>
                  <Ball>{pad(whiteBall5)}</Ball>
                  <Ball>{pad(whiteBall5)}</Ball>
                  <Ball mr={3} red>
                    {pad(redBall)}
                  </Ball>
                  <Card
                    borderRight="solid 1px #DBDAFF"
                    style={{ height: '36px' }}
                    mr={3}
                  />
                  <Text
                    color="purple"
                    fontSize={16}
                    fontFamily="code"
                    fontWeight="900"
                  >
                    {mul}x
                  </Text>
                </Flex>
              )}
              updatedAt={lastUpdate}
            >
              <LotteryProvidersByTypeTimeFetcher
                type={type}
                time={time.format('YYYYMMDD')}
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
                      <LotteryTable mb={2} data={data} />
                    </React.Fragment>
                  )
                }
              </LotteryProvidersByTypeTimeFetcher>
            </DataPoint>
          ),
        )}
      </FlipMove>
    </Box>
    <LotteryCountByTypeFetcher type={type}>
      {({ fetching, data }) =>
        fetching || currentLotteryLength >= data ? null : (
          <Flex width="100%" justifyContent="center" alignItems="center">
            <LoadMoreButton onClick={loadMoreList}>
              Load More Data
            </LoadMoreButton>
          </Flex>
        )
      }
    </LotteryCountByTypeFetcher>
  </React.Fragment>
)

export default class LotteryPage extends React.Component {
  state = { type: 'PWB', nLotteryList: 10 }

  changeType(type, forceFetch) {
    this.setState({
      type,
      nLotteryList: 10,
    })
    forceFetch()
  }

  async loadMoreList(forceFetch) {
    const currentLength = this.currentLotteryLength
    this.setState({
      nLotteryList: this.state.nLotteryList + 10,
    })
    await new Promise(r => {
      const fetchChecker = setInterval(() => {
        forceFetch(true, true)
      }, 1500)
      const checker = setInterval(() => {
        if (this.currentLotteryLength > currentLength) {
          clearInterval(checker)
          clearInterval(fetchChecker)
          r()
        }
      }, 500)
    })
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
              Lottery
            </Text>
            <Text fontSize="20px" mt={3}>
              Get winning numbers of lotteries all around the world
            </Text>
          </Flex>
        )}
        {...this.props}
      >
        <PageContainer>
          <Flex mt="-100px" mx="-8px" justifyContent="center">
            <LotteryCountByTypeFetcher type="PWB">
              {({ fetching, data, forceFetch }) => (
                <DatasetTab
                  mx="8px"
                  title="Powerball"
                  subtitle={fetching ? 'Loading ...' : `${data} Rounds`}
                  src={PwbSrc}
                  active={this.state.type === 'PWB'}
                  onClick={() => this.changeType('PWB', forceFetch)}
                />
              )}
            </LotteryCountByTypeFetcher>
            <LotteryCountByTypeFetcher type="PWB">
              {({ fetching, data, forceFetch }) => (
                <DatasetTab
                  mx="8px"
                  title="Mega Millions"
                  subtitle={fetching ? 'Loading ...' : `${data} Rounds`}
                  src={MmnSrc}
                  active={this.state.type === 'MMN'}
                  onClick={() => this.changeType('MMN', forceFetch)}
                />
              )}
            </LotteryCountByTypeFetcher>
          </Flex>
          <Box mt="24px">
            <Snippet dataset="lottery" />
          </Box>
          <Box mt={5}>
            <LotteryByTypeFetcher
              type={this.state.type}
              nList={this.state.nLotteryList}
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
                  this.currentLotteryLength = data.length
                  return renderDataPoints(
                    this.state.type,
                    data,
                    this.currentLotteryLength,
                    this.loadMoreList.bind(this, forceFetch),
                  )
                }
              }}
            </LotteryByTypeFetcher>
          </Box>
        </PageContainer>
      </PageStructure>
    )
  }
}
