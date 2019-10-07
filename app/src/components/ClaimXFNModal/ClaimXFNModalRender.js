import React from 'react'
import styled from 'styled-components'
import { Image, Flex, Text, Card } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

// Images
import AdtlSrc from 'images/airdropxfn_tl.svg'
import AdcSrc from 'images/airdropcoin.svg'
import Clouds from 'images/clouds.svg'
import BN from 'utils/bignumber'

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
  const { claim, snapShots, bandAvg, loading, pendingTx } = props

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
          flexDirection="column"
          alignItems="center"
          style={{
            borderRadius: '20px',
            maxWidth: '375px',
            zIndex: 3,
            color: 'white',
          }}
        >
          <Text
            fontWeight={300}
            fontSize="24px"
            color="white"
            lineHeight="24px"
          >
            Your BAND token snapshots
          </Text>
          <Flex width={1} mt="20px" mb="10px" style={{ fontWeight: 700 }}>
            <Flex flex={1}>Date</Flex>
            <Flex flex={1} justifyContent="flex-end">
              Amount (BAND)
            </Flex>
          </Flex>
          {snapShots.map((e, i) => {
            return (
              <Flex width={1} my="5px" key={i}>
                <Flex flex={1}>
                  {new Date(e.date * 1000)
                    .toDateString()
                    .split(' ')
                    .slice(1)
                    .join(' ')}
                </Flex>
                <Flex flex={1} justifyContent="flex-end">
                  {e.bandAmount.pretty()}
                </Flex>
              </Flex>
            )
          })}
        </Flex>

        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{ position: 'relative' }}
        >
          {bandAvg.isZero() ? (
            <Flex
              bg="rgba(255,255,255,0.5)"
              p="20px"
              flexDirection="column"
              alignItems="center"
              style={{
                borderRadius: '20px',
                maxWidth: '375px',
                zIndex: 3,
              }}
            >
              <Text fontSize="24px" mb="20px">
                Oops!
              </Text>
              You didn't hodl any BAND from October 1st to October 7th 2019
            </Flex>
          ) : (
            <ClaimButton onClick={() => claim()}>
              <Text
                color="white"
                fontSize="24px"
                style={{ opacity: pendingTx ? 0 : 1 }}
              >
                Get {bandAvg.div(new BN(10)).pretty()} XFN Now!
              </Text>
            </ClaimButton>
          )}
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
