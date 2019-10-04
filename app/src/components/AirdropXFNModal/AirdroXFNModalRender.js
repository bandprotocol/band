import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Image, Flex, Text, Card, AbsoluteLink } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

// Images
import AdtlSrc from 'images/airdropxfn_tl.svg'
import AdcSrc from 'images/airdropcoin.svg'
import Clouds from 'images/clouds.svg'

const AirdropButton = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})`
  padding: 0px 30px;
  height: 64px;
  line-height: 64px;
  color: white;
  z-index: 9999999;
  cursor: pointer;
  border-radius: 32px;
  transition: all 250ms;
  background-image: linear-gradient(to left, #f75c9d, #8c69ff);
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.3);
  &:hover {
    background-image: linear-gradient(to left, #ff6ba9, #9f82ff);
    box-shadow: -1px 1px 5px 0px #8c69ff, 1px 1px 5px 0px #f75c9d;
  }
`

const MoveFlex1 = styled(Flex)`
  position: absolute;
  animation: move1 linear ${p => p.t || '10s'};
  animation-iteration-count: infinite;

  ${p => `@keyframes move1 {
    0% {
      transform: translate(${p.x1}, ${p.y});
    }
    100% {
      transform: translate(${p.x2}, ${p.y});
    }
  }`}
`

const MoveFlex2 = styled(Flex)`
  position: absolute;
  animation: move2 linear ${p => p.t || '10s'};
  animation-iteration-count: infinite;

  ${p => `@keyframes move2 {
  0% {
    transform: translate(${p.x1}, ${p.y});
  }
  100% {
    transform: translate(${p.x2}, ${p.y});
  }
}`}
`

export default props => {
  const {
    rewardAmount,
    claimXFNReward,
    hideXFNRewardModal,
    doneStep1 = false,
    doneStep2 = false,
    doneStep3 = false,
  } = props
  const [loading, setLoading] = useState(true)

  const [airDropPeriod] = useState(false)

  const [pendingTx, setPendingTx] = useState(false)

  useEffect(() => {
    ;(async () => {
      await new Promise(resolve =>
        setTimeout(resolve, 800 + Math.ceil(200 * Math.random())),
      )
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <Card
        variant="modal"
        style={{
          border: '0px',
          boxShadow: '1px 1px 49px rgba(0,0,0,0.25)',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={3}
          style={{
            minWidth: '500px',
            minHeight: '500px',
          }}
        >
          <CircleLoadingSpinner radius="80px" />
        </Flex>
      </Card>
    )
  }

  return (
    <Card
      variant="modal"
      style={{
        border: '0px',
        boxShadow: '1px 1px 49px rgba(0,0,0,0.25)',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Image
        src={AdtlSrc}
        style={{
          minWidth: '600px',
          opacity: '0.5',
          position: 'absolute',
          top: '-100px',
          left: '-200px',
          zIndex: 0,
        }}
      />
      <Image
        src={AdcSrc}
        style={{
          minWidth: '350px',
          opacity: '0.5',
          position: 'absolute',
          bottom: '-50px',
          right: '-100px',
          zIndex: 1,
        }}
      />

      <MoveFlex1
        x1="550px"
        x2="-200px"
        y="0px"
        t="20s"
        style={{ maxWidth: '200px', minWidth: '200px' }}
      >
        <Image
          src={Clouds}
          style={{
            minWidth: '100%',
            opacity: '0.5',
            zIndex: 2,
          }}
        />
      </MoveFlex1>

      <MoveFlex2
        x1="-400px"
        x2="600px"
        y="250px"
        t="13s"
        style={{ maxWidth: '400px', minWidth: '400px', zIndex: 3 }}
      >
        <Image
          src={Clouds}
          style={{
            minWidth: '100%',
            opacity: '0.5',
            zIndex: 3,
          }}
        />
      </MoveFlex2>

      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mb={3}
        style={{
          minWidth: '500px',
          minHeight: '500px',
        }}
      >
        <Flex
          width="75%"
          bg="#74608f"
          mb="30px"
          p="20px"
          style={{ borderRadius: '20px', maxWidth: '375px', zIndex: 3 }}
        >
          <Flex
            flexDirection="column"
            color="white"
            fontWeight={300}
            fontSize="18px"
            lineHeight="24px"
          >
            <Flex alignItems="flex-end" justifyContent="space-between">
              <Text fontSize="24px" mr="10px">
                Claim XFN Airdrop
              </Text>
              <AbsoluteLink href="https://medium.com/bandprotocol">
                <Text
                  fontSize="14px"
                  color="white"
                  px="4px"
                  style={{ border: '1px solid #ffffff', borderRadius: '8px' }}
                >
                  Learn more
                </Text>
              </AbsoluteLink>
            </Flex>
            <Flex mt="10px" flexDirection="column">
              <Text fontSize="14px" my="10px">
                From October 1st to October 7th 2019, a snapshot of BAND token
                balances will be taken everyday at 12 PM UTC. For each 10 BAND
                tokens held on average across 7 days, you will be able to claim
                1 XFN.
              </Text>
              <Flex alignItems="flex-start" mt="10px">
                <Flex alignItems="center">
                  <Text mr="10px">
                    <FontAwesomeIcon
                      icon={doneStep1 ? faCheckCircle : faCircle}
                    ></FontAwesomeIcon>
                  </Text>
                  <Text mr="10px">1.</Text>
                </Flex>
                <Text fontSize="16px">Login with Metamask or BandWallet.</Text>
              </Flex>
              <Flex alignItems="flex-start" mt="10px">
                <Flex alignItems="center">
                  <Text mr="10px">
                    <FontAwesomeIcon
                      icon={doneStep2 ? faCheckCircle : faCircle}
                    ></FontAwesomeIcon>
                  </Text>
                  <Text mr="10px">2.</Text>
                </Flex>
                <Text fontSize="16px">Transfer band to your account.</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{ position: 'relative' }}
        >
          <AirdropButton onClick={() => hideXFNRewardModal()}>
            <Text color="white" fontSize="24px">
              Understand
            </Text>
          </AirdropButton>
        </Flex>
      </Flex>
    </Card>
  )
}
