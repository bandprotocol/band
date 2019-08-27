import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Image } from 'ui/common'
import DatePicker from 'react-datepicker'
import 'DatePicker.css'
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
import DatasetTab from 'components/DatasetTab'
import CalendarSrc from 'images/calendar.svg'

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

const renderDataPoints = (tcdAddress, tcdPrefix, lotteries) => (
  <React.Fragment>
    <Box mt={3}>
      <FlipMove>
        {lotteries.map(
          ({
            lotteryType,
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
              label={
                (tcdPrefix === 'tcd' ? lotteryType + ': ' : '') +
                time.format('ddd, MMMM DD YYYY')
              }
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

const MONTH = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatDate = rawDate => {
  const [monthIndex, year] = rawDate.split('/')
  return `${MONTH[monthIndex - 1]} ${year}`
}

const Calendar = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})`
  width: 49px;
  height: 35px;
  border-radius: 17.5px;
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to right, #5269ff, #4890ff);
`

const DateContainer = ({ value, onClick }) => (
  <Flex
    width="245px"
    bg="#fff"
    alignItems="center"
    justifyContent="space-between"
    onClick={onClick}
    style={{
      height: '35px',
      borderRadius: '17.5px',
      border: 'solid 1px #e7ecff',
      cursor: 'pointer',
    }}
  >
    <Text pl="20px" color="#4a4a4a" fontSize="14px" fontWeight="500">
      {formatDate(value)}
    </Text>
    <Calendar>
      <Image src={CalendarSrc} />
    </Calendar>
  </Flex>
)

export default class LotteryPage extends React.Component {
  state = {
    nLotteryList: 10,
    currentPage: 1,
    selectedDate: new Date(),
    type: 'MMN',
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tcdAddress !== this.props.tcdAddress) {
      this.setState({
        currentPage: 1,
        selectedDate: new Date(),
      })
    }
  }
  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  onChangeDate = newDate => {
    this.setState({
      selectedDate: newDate,
    })
  }

  render() {
    const { tcdAddress, tcdPrefix } = this.props
    const { currentPage, nLotteryList, selectedDate, type } = this.state

    return (
      <LotteryCountByTCDFetcher
        type={type}
        tcdAddress={tcdAddress}
        selectedDate={selectedDate}
      >
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
                pr="20px"
              >
                <Text fontSize="15px" fontFamily="head" fontWeight="600">
                  {countFetching ? '' : `${totalCount} Rounds Available`}
                </Text>
                <Box style={{ position: 'relative' }}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={this.onChangeDate}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    customInput={<DateContainer />}
                  />
                </Box>
              </Flex>
            )}
            {...this.props}
          >
            <Flex justifyContent="center">
              <DatasetTab
                mx="8px"
                title="Megamillions"
                src={MmnSrc}
                active={this.state.type === 'MMN'}
                onClick={() => this.setState({ type: 'MMN' })}
              />
              <DatasetTab
                mx="8px"
                title="Powerball"
                src={PwbSrc}
                active={this.state.type === 'PWB'}
                onClick={() => this.setState({ type: 'PWB' })}
              />
            </Flex>
            <LotteyByTCDAddress tcdAddress={tcdAddress} {...this.state}>
              {({ fetching, data }) => {
                if (fetching || countFetching) {
                  return (
                    <Loading
                      height={700}
                      width={1141}
                      rects={[
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
                  return this.currentLotteryLength !== 0 ? (
                    renderDataPoints(tcdAddress, tcdPrefix, data)
                  ) : (
                    <Flex
                      mt="100px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize="28px" fontFamily="head" fontWeight="600">
                        There is no data avaliable.
                      </Text>
                    </Flex>
                  )
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
