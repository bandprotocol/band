import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Flex, Text, Button, Image } from 'rebass'
import Clock from '../components/Clock'
import { isMobile } from '../ui/media'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import BGPC from '../images/bgPC.svg'

const Time = styled(Text).attrs({
  fontSize: isMobile() ? '30px' : '144px',
  color: 'white',
})

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

const A = styled.a`
  text-decoration: none;
  &hover: {
    text-decoration: none;
  }
`

const BgContainer = styled(Flex)`
  flex-direction: row;
  position: fixed;
  width: 100%;
  height: auto;
  top: 0;
  left: 0;
  z-index: -1;
  background-image: linear-gradient(119deg, #1d2850, rgba(0, 0, 0, 0)),
    linear-gradient(45deg, #082352, #eb7667);
`

const Indicator = styled(Text).attrs({
  fontSize: isMobile() ? '14px' : '21px',
  fontWeight: '300',
  color: 'rgba(255,255,255,0.61)',
})`
  margin-top: 30px;
`

export default class Countdown extends React.Component {
  render() {
    const { duration, isCountdown } = this.props
    return (
      <Flex
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <BgContainer>
          <Image
            src={BGPC}
            style={{ minHeight: '100vh', minWidth: '100vw', opacity: 0 }}
          />
        </BgContainer>
        <Text fontSize={['30px', '50px']} color="white">
          Data Governance Portal
        </Text>
        {isCountdown ? (
          <Clock duration={duration}></Clock>
        ) : (
          <Text mt="20px" color="white" fontSize="50px">
            Mainnet live now
          </Text>
        )}
        <Flex mt="30px">
          <A href="https://app.kovan.bandprotocol.com/" target="_black">
            <Flex
              justifyContent="center"
              alignItems="center"
              style={{
                width: isMobile() ? '280px' : '450px',
                height: '55px',
                borderRadius: '27.5px',
                boxShadow: '0 8px 16px 0 #68356e',
                cursor: 'pointer',
                backgroundImage: 'linear-gradient(51deg, #9e32ab, #ffb45b)',
              }}
            >
              <Text color="white" fontSize={['16px', '24px']}>
                Go To Kovan Testnet Portal
              </Text>
            </Flex>
          </A>
        </Flex>
        <Flex mt="30px">
          <A href="https://app-rinkeby.bandprotocol.com/" target="_black">
            <Flex
              justifyContent="center"
              alignItems="center"
              style={{
                width: isMobile() ? '280px' : '450px',
                height: '55px',
                borderRadius: '27.5px',
                cursor: 'pointer',
                backgroundImage: 'linear-gradient(51deg, #333333, #555555)',
              }}
            >
              <Text color="white" fontSize={['16px', '24px']}>
                Go To Rinkeby (old) Testnet Portal
              </Text>
            </Flex>
          </A>
        </Flex>
      </Flex>
    )
  }
}
