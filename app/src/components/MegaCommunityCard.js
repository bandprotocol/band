import React from 'react'
import styled from 'styled-components/macro'
import { colors } from 'ui'
import BN from 'utils/bignumber'
import { Flex, Text, Image, Box, Button, Link, H3 } from 'ui/common'

const WrapText = styled(H3)`
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  white-space: nowrap;
`

const Description = styled(Text)`
  font-size: 16px;
  color: #747474;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-wrap: normal;
  -webkit-line-clamp: 2;
  height: 45px;
  line-height: 25px;
  width: 310px;
`

const StyledCard = styled(Flex)`
  cursor: pointer;
  transition: all 200ms;
  box-shadow: 0 2px 6px 0 #d4deed;
`

const MagicPattern = ({ color, num = 25, size = 5, space = 5 }) => {
  const numPoints = [...Array(num).keys()]

  const ratio = 10
  size = size * ratio
  space = space * ratio

  return (
    <Flex
      flexWrap="wrap"
      style={{
        width: Math.sqrt(num) * size + Math.sqrt(num) * space * 2,
        position: 'absolute',
        bottom: '10px',
        left: '15px',
        transformOrigin: 'bottom left',
        transform: `scale(${1 / ratio})`,
      }}
    >
      {numPoints.map(() => (
        <Box
          style={{
            margin: space,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundImage:
              color || 'linear-gradient(52deg, #406ae7, #c63ad6)',
          }}
        />
      ))}
    </Flex>
  )
}

const DisplayIcon = ({ src, bgColor }) => (
  <Flex
    width="76px"
    justifyContent="center"
    alignItems="center"
    mt="5px"
    style={{
      height: '76px',
      borderRadius: '50%',
      backgroundImage: bgColor,
      boxShadow: '0 5px 10px 0 #d3dcea',
      overflow: 'hidden',
    }}
  >
    <Box
      style={{
        width: '68px',
        height: '68px',
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    />
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
    last24HrsPrice,
    logo,
  },
  bandPrice,
  borderColor,
  onClick,
  bgColor,
  statusBg,
  defaultTcd,
  isTcd,
}) => {
  return (
    <StyledCard
      flex={['', '0 0 500px']}
      p="14px"
      my={3}
      mx="16px"
      style={{
        height: '290px',
        borderRadius: '10px',
        padding: '0px',
        overflow: 'hidden',
        backgroundColor: '#FAFCFF',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <MagicPattern color={borderColor} />
      <Flex p="16px 24px" color="#4a4a4a">
        <DisplayIcon src={logo} bgColor={borderColor} />
        <Flex flexDirection="column" ml="28px">
          <WrapText fontWeight="600" lineHeight={1.2} mt={1} mb="0.5em">
            {name}
          </WrapText>
          <Description mb={2}>{description}</Description>
          <PriceDetail
            marketCap={BN.parse(marketCap).bandToUSD(bandPrice)}
            price={BN.parse(price).bandToUSD(bandPrice)}
            last24Hrs={(
              ((price - last24HrsPrice) / last24HrsPrice) *
              100
            ).toFixed(2)}
            statusBg={statusBg}
          />
          <Flex flexDirection="row" alignItems="center" mt={2}>
            <Link
              to={`/community/${tokenAddress}/overview`}
              onClick={e => e.stopPropagation()}
            >
              <Button
                variant="blue"
                style={{
                  padding: '10px 25px 14px',
                  minWidth: '120px',
                  maxWidth: '120px',
                  fontWeight: '900',
                  fontSize: '15px',
                }}
              >
                Overview
              </Button>
            </Link>
            <Link
              to={`/community/${tokenAddress}/dataset`}
              onClick={e => e.stopPropagation()}
            >
              <Button
                variant="lightblue"
                ml={3}
                style={{
                  padding: '10px 25px 14px',
                  minWidth: '140px',
                  maxWidth: '140px',
                  whiteSpace: 'noWrap',
                  fontWeight: '900',
                  fontSize: '15px',
                }}
              >
                {isTcd ? 'Explore Data' : 'Visit Website'}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </StyledCard>
  )
}
