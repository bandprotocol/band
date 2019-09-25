import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Image, Flex, Text, Card } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

// Images
import AdtlSrc from 'images/airdropxfn_tl.svg'
import AdcSrc from 'images/airdropcoin.svg'
import Clouds from 'images/clouds.svg'

const ClaimButton = styled(Flex).attrs({
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
    xfnRewardContract,
    claimXFNReward,
    hideXFNRewardModal,
  } = props
  const [loading, setLoading] = useState(true)
  const [pendingTx, setPendingTx] = useState(false)

  useEffect(() => {
    ;(async () => {
      await new Promise(resolve =>
        setTimeout(resolve, 800 + Math.ceil(200 * Math.random())),
      )
      setLoading(false)
    })()
  }, [])

  const claim = async () => {
    if (!xfnRewardContract) return
    setPendingTx(true)
    await claimXFNReward(xfnRewardContract)
    setPendingTx(false)
    await new Promise(resolve => setTimeout(resolve, 100))
    hideXFNRewardModal()
  }

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
          style={{ borderRadius: '20px', maxWidth: '375px', zIndex: 1 }}
        >
          <Text
            fontWeight={300}
            fontSize="18px"
            color="white"
            lineHeight="24px"
          >
            Financial Data Feeds Token (
            <span style={{ fontWeight: 900 }}> XFN</span> ) is Lorem ipsum dolor
            sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Dolor sed viverra ipsum
            nunc aliquet bibendum enim.
          </Text>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{ position: 'relative' }}
        >
          <ClaimButton onClick={() => claim()}>
            <Text
              color="white"
              fontSize="24px"
              style={{ opacity: pendingTx ? 0 : 1 }}
            >
              Get XFN{' '}
              {rewardAmount >= 1
                ? rewardAmount.toFixed(2)
                : rewardAmount.toFixed(4)}{' '}
              Now!
            </Text>
          </ClaimButton>
          {pendingTx && (
            <ClaimButton
              style={{ position: 'absolute', top: '0px', width: '100%' }}
            >
              <CircleLoadingSpinner radius="40px" color="white" />
            </ClaimButton>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
