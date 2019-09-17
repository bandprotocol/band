import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Flex, Text } from 'ui/common'

const Time = styled(Text).attrs({
  fontSize: '144px',
  color: 'white',
})`
  text-shadow: 1px 1px 20px #000000;
  font-family: Open Sans;
`

const SeparateIcon = () => (
  <Text
    fontWeight="900"
    fontSize="60px"
    color="white"
    mx="14px"
    mb="18px"
    style={{ textShadow: '1px 1px 20px #000000' }}
  >
    :
  </Text>
)

const Indicator = styled(Text).attrs({
  fontSize: '28px',
  fontWeight: '300',
  color: 'white',
})`
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
    this.countInterval = setInterval(() => {
      duration = moment.duration(duration - interval, 'milliseconds')
      if (duration <= 0) window.location.reload()
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
          >
            <Time>{duration.days()}</Time>
            <Indicator>days</Indicator>
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
            <Indicator>hours</Indicator>
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
            <Indicator>minutes</Indicator>
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
            <Indicator>seconds</Indicator>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
