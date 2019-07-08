import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Button } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import { createLoadingButton } from 'components/BaseButton'
import {
  LotteryCountByTypeFetcher,
  LotteyByTCDAddress,
  LotteryProvidersByTCDAddressTimeFetcher,
} from 'data/fetcher/LotteryFetcher'
import LotteryTable from 'components/table/LotteryTable'
import Loading from 'components/Loading'

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
  tcdAddress,
  lotteries,
  currentLotteryLength,
  loadMoreList,
) => (
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
              </LotteryProvidersByTCDAddressTimeFetcher>
            </DataPoint>
          ),
        )}
      </FlipMove>
    </Box>
    <LotteryCountByTypeFetcher>
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
  state = { numDataPoints: 0, nLotteryList: 10 }

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
    const { tcdAddress } = this.props
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
        <LotteyByTCDAddress
          tcdAddress={tcdAddress}
          nList={this.state.nLotteryList} // TODO: for infinity scroll
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
              this.currentLotteryLength = data.length
              return renderDataPoints(
                tcdAddress,
                data,
                this.currentLotteryLength,
                this.loadMoreList.bind(this, forceFetch),
              )
            }
          }}
        </LotteyByTCDAddress>
      </PageStructure>
    )
  }
}
