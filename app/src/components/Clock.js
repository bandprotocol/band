import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Flex, Text } from 'rebass'
import { isMobile } from '../ui/media'

const Time = styled(Text).attrs({
  fontSize: isMobile() ? '30px' : '144px',
  color: 'white',
})`
  font-family: Avenir;
`

const SeparateIcon = () => (
  <Text
    fontWeight="900"
    fontSize={['20px', '60px']}
    color="white"
    mx={['5px', '14px']}
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
  font-family: Avenir;
`

export default props => {
  const { duration } = props
  return (
    <Flex p="34px 53px 30px" justifyContent="center" width="100%">
      {/* Time */}
      <Flex justifyContent="center" alignItems="center">
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
