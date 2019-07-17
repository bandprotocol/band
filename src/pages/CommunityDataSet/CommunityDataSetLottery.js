import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Flex, Box, Text, Card } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import DataHeader from 'components/DataHeader'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import {
  LotteryCountByTCDFetcher,
  LotteyByTCDAddress,
  LotteryProvidersByTCDAddressTimeFetcher,
} from 'data/fetcher/LotteryFetcher'
import LotteryTable from 'components/table/LotteryTable'
import Loading from 'components/Loading'
import PaginationRender from 'components/Pagination/PaginationRender'

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

const renderDataPoints = (tcdAddress, lotteries) => (
  <React.Fragment>
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
              <LotteryProvidersByTCDAddressTimeFetcher
                tcdAddress={tcdAddress}
                keyOnChain={keyOnChain}
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
                      <LotteryTable mb={2} data={data} />
                    </React.Fragment>
                  )
                }
              </LotteryProvidersByTCDAddressTimeFetcher>
            </DataPoint>
          ),
        )}
      </FlipMove>
    </Box>
  </React.Fragment>
)

export default class LotteryPage extends React.Component {
  state = { nLotteryList: 10, currentPage: 1 }

  componentDidUpdate(prevProps) {
    if (prevProps.tcdAddress !== this.props.tcdAddress) {
      this.setState({
        currentPage: 1,
      })
    }
  }
  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { tcdAddress } = this.props
    const { currentPage, nLotteryList } = this.state
    return (
      <LotteryCountByTCDFetcher tcdAddress={tcdAddress}>
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
              <Flex width="100%" alignItems="center" color="#4a4a4a" pl="52px">
                <Text fontSize="16px" fontFamily="head" fontWeight="600">
                  {countFetching
                    ? 'loading... '
                    : `${totalCount} Keys Available`}
                </Text>
              </Flex>
            )}
            {...this.props}
          >
            <LotteyByTCDAddress tcdAddress={tcdAddress} {...this.state}>
              {({ fetching, data }) => {
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
                  this.currentLotteryLength = data.length
                  return renderDataPoints(tcdAddress, data)
                }
              }}
            </LotteyByTCDAddress>
            <PaginationRender
              currentPage={currentPage}
              numberOfPages={Math.ceil(totalCount / nLotteryList) || 1}
              onChangePage={this.onChangePage.bind(this)}
            />
          </PageStructure>
        )}
      </LotteryCountByTCDFetcher>
    )
  }
}
