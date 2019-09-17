import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Flex, Text } from 'ui/common'
import { isMobile } from 'ui/media'

const Time = styled(Text).attrs({
  fontSize: isMobile() ? '30px' : '144px',
  color: 'white',
})`
  font-family: Open Sans;
`

const SeparateIcon = () => (
  <Text
    fontWeight="900"
    fontSize={['20px', '60px']}
    color="white"
    mx={['5px', '14px']}
    mt={['3px', '40px']}
    style={{ alignSelf: 'flex-start' }}
  >
    :
  </Text>
)

const Indicator = styled(Text).attrs({
  fontSize: isMobile() ? '14px' : '21px',
  fontWeight: '300',
  color: 'rgba(255,255,255,0.61)',
})`
  margin-top: 30px;
  font-family: Open Sans;
`

export default class Countdown extends React.Component {
  state = {
    duration: moment.duration(0 * 1000, 'milliseconds'),
  }

  componentDidMount() {
    const eventTime = this.props.eventTime
    const currentTime = moment().unix()
    const diffTime = eventTime - currentTime
    let duration = moment.duration(diffTime * 1000, 'milliseconds')
    const interval = 1000

    // set first time
    duration = moment.duration(duration - interval, 'milliseconds')
    this.setState({
      duration,
    })

    this.countInterval = setInterval(() => {
      duration = moment.duration(duration - interval, 'milliseconds')

      this.setState({
        duration,
      })
    }, interval)
  }

  componentWillUnmount() {
    clearInterval(this.countInterval)
  }

  render() {
    const { duration } = this.state
    return (
      <Flex
        bg="transparent"
        p="34px 53px 30px"
        justifyContent="center"
        width="100%"
      >
        {/* Time */}
        <Flex
          justifyContent="center"
          alignItems="center"
          style={{ zIndex: '1' }}
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={{ minWidth: isMobile() ? '55px' : '165px' }}
          >
            <Time>{duration.days()}</Time>
            <Indicator>Days</Indicator>
          </Flex>
          <SeparateIcon />
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Time>
              {duration
                .hours()
                .toString()
                .padStart(2, '0')}
            </Time>
            <Indicator>Hours</Indicator>
          </Flex>
          <SeparateIcon />
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Time>
              {duration
                .minutes()
                .toString()
                .padStart(2, '0')}
            </Time>
            <Indicator>Minutes</Indicator>
          </Flex>
          <SeparateIcon />
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Time>
              {duration
                .seconds()
                .toString()
                .padStart(2, '0')}
            </Time>
            <Indicator>Seconds</Indicator>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
