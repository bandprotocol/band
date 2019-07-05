import React from 'react'
import styled from 'styled-components/macro'
import { colors } from 'ui'
import BN from 'utils/bignumber'
import { Flex, Text, Image, Box, Button, Link } from 'ui/common'

const WrapText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  white-space: nowrap;
`

const Description = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 2;
  height: 45px;
  line-height: 25px;
  width: 325px;
`

const StyledCard = styled(Flex)`
  cursor: pointer;
  transition: all 200ms;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.25);
  &:hover: {
    box-shadow: 0 5px 10px 0 red;
    transform: scale(1.7);
  }
`

const MagicPattern = ({ color, num = 25, size = '5px', space = '5px' }) => {
  const numPoints = [...Array(num).keys()]
  return (
    <Flex
      flexWrap="wrap"
      style={{
        width: '80px',
        position: 'absolute',
        bottom: '10px',
        left: '15px',
      }}
    >
      {numPoints.map(() => (
        <Box
          width={size}
          m={space}
          style={{
            height: size,
            borderRadius: '50%',
            backgroundImage:
              color || 'linear-gradient(52deg, #406ae7, #c63ad6)',
          }}
        />
      ))}
    </Flex>
  )
  return <div />
}

const DisplayIcon = ({ src, bgColor }) => (
  <Flex
    width="95px"
    justifyContent="center"
    alignItems="center"
    mt="5px"
    style={{
      height: '95px',
      borderRadius: '50%',
      backgroundImage: bgColor,
      boxShadow: '0 5px 10px 0 #d3dcea',
    }}
  >
    <Image src={src} />
  </Flex>
)

const PriceDetail = ({ marketCap, price, last24Hrs, statusBg }) => (
  <Flex
    flexDirection="row"
    pt="14px"
    pb={1}
    px="15px"
    justifyContent="space-around"
    alignItems="center"
    bg={statusBg || '#ebf1ff'}
    my={3}
    style={{ borderRadius: '10px' }}
  >
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text color="#4a4a4a" fontSize={12} fontWeight="500">
        Market Cap.
      </Text>
      <Text color="#5269ff" fontSize={1} py="10px" fontWeight="900">
        $ {marketCap.shortPretty()}
      </Text>
    </Flex>
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={3}
      style={{
        borderLeft: '1px solid rgba(255, 255,255 ,0.22)',
        borderRight: '1px solid rgba(255, 255,255 ,0.22)',
      }}
    >
      <Text color="#4a4a4a" fontSize={12} fontWeight="500">
        Price/Token
      </Text>
      <Text color="#5269ff" fontSize={1} py="10px" fontWeight="900">
        $ {price.shortPretty()}
      </Text>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text color="#4a4a4a" fontSize={12} fontWeight="500">
        Last 24 hrs.
      </Text>
      <Text
        color={last24Hrs >= 0.0 ? '#42c47f' : colors.red.normal}
        fontSize={1}
        fontWeight="900"
        py="10px"
      >
        {last24Hrs >= 0.0 ? '+' : null}
        {last24Hrs} %
      </Text>
    </Flex>
  </Flex>
)

export default ({
  community: {
    tokenAddress,
    name,
    description,
    marketCap,
    price,
    last24Hrs,
    logo,
  },
  bandPrice,
  borderColor,
  onClick,
  bgColor,
  statusBg,
  defaultTcd,
  isTcd,
}) => (
  <StyledCard
    flex={['', '0 0 500px']}
    p="14px"
    my={3}
    mx="16px"
    style={{
      height: '290px',
      borderRadius: '10px',
      borderColor,
      padding: '0px',
      overflow: 'hidden',
      backgroundImage:
        borderColor || 'linear-gradient(to left, #ffca55, #ff7155)',
    }}
    onClick={onClick}
  >
    <Flex
      bg="white"
      m="1px"
      style={{ overflow: 'hidden', borderRadius: '10px', position: 'relative' }}
    >
      <MagicPattern color={borderColor} />
      <Flex p="25px 30px" color="#4a4a4a">
        <DisplayIcon src={logo} bgColor={borderColor} />
        <Flex flexDirection="column" mx="18px">
          <WrapText fontSize="20px" fontWeight="900" lineHeight={2} mt={1}>
            {name}
          </WrapText>
          <Description fontSize="15px" mb={2}>
            {description}
          </Description>
          <PriceDetail
            marketCap={BN.parse(marketCap).bandToUSD(bandPrice)}
            price={BN.parse(price).bandToUSD(bandPrice)}
            last24Hrs={last24Hrs.toFixed(2)}
            statusBg={statusBg}
          />
          <Flex flexDirection="row" alignItems="center" mt={2}>
            <Link to={`/community/${tokenAddress}/overview`}>
              <Button
                variant="blue"
                style={{
                  padding: '12px 25px',
                  minWidth: '120px',
                  maxWidth: '120px',
                  fontWeight: '900',
                }}
                onClick={e => e.stopPropagation(e)}
              >
                Overview
              </Button>
            </Link>
            <Link to={`/community/${tokenAddress}/${defaultTcd}/dataset`}>
              <Button
                variant="lightblue"
                ml={3}
                style={{
                  padding: isTcd ? '12px 25px' : '12px 5px',
                  minWidth: '120px',
                  maxWidth: '120px',
                  whiteSpace: 'noWrap',
                  fontWeight: '900',
                }}
                onClick={e => e.stopPropagation(e)}
              >
                {isTcd ? 'Dataset' : 'Visit Website'}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </StyledCard>
)
