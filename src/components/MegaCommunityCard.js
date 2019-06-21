import React from 'react'
import styled from 'styled-components/macro'
import { colors } from 'ui'
import BN from 'utils/bignumber'
import {
  Flex,
  Text,
  Image,
  Box,
  AbsoluteLink,
  Card,
  Button,
  Link,
} from 'ui/common'

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
  width: 320px;
`

const DisplayIcon = ({ src }) => (
  <Flex
    width="95px"
    bg="#3c55f9"
    justifyContent="center"
    alignItems="center"
    mt="5px"
    style={{ height: '95px', border: '2px solid #fff', borderRadius: '9px' }}
  >
    <Image src={src} />
  </Flex>
)

const PriceDetail = ({ marketCap, price, last24Hrs }) => (
  <Flex
    flexDirection="row"
    pt={2}
    pb={1}
    justifyContent="space-around"
    alignItems="center"
    bg="#3c55f9"
    my={3}
    style={{ borderRadius: '10px' }}
  >
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text color="#c4d7ff" fontSize={12} fontWeight="500">
        Market Cap.
      </Text>
      <Text color="#fff" fontSize={1} py="10px" fontWeight="500">
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
      <Text color="#c4d7ff" fontSize={12} fontWeight="500">
        Price/Token
      </Text>
      <Text color="#fff" fontSize={1} py="10px" fontWeight="500">
        $ {price.shortPretty()}
      </Text>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text color="#c4d7ff" fontSize={12} fontWeight="500">
        Last 24 hrs.
      </Text>
      <Text
        color={last24Hrs >= 0.0 ? '#4dfea0' : colors.red.normal}
        fontSize={1}
        fontWeight="500"
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
    banner,
    website,
    organization,
    description,
    marketCap,
    price,
    last24Hrs,
    logo,
  },
  bandPrice,
  onClick,
  bgColor,
  isTcd,
}) => (
  <Card
    variant="primary"
    flex={['', '0 0 500px']}
    p="14px"
    my={3}
    mx="16px"
    css={{
      alignSelf: 'flex-start',
      backgroundImage: bgColor || 'linear-gradient(to right, #5c62ff, #5a9bff)',
      boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.25)',
      ...(onClick
        ? {
            cursor: 'pointer',
            transition: 'all 200ms',
            boxShadow: '0 0 0 0 #ffffff',
            '&:hover': {
              boxShadow: '0 10px 17px 0 #e6e9f5',
            },
          }
        : {}),
    }}
    style={{
      height: '290px',
      borderRadius: '10px',
      padding: '0px',
      overflow: 'hidden',
    }}
    onClick={onClick}
  >
    {/* Image Banner */}
    <Flex flexDirection="column" alignItems="flex-start" pl="30px" color="#fff">
      <Flex alignItems="center">
        <WrapText fontSize="20px" fontWeight="900" lineHeight={2} mt={1}>
          {name}
        </WrapText>
      </Flex>
      <Box
        bg="rgba(255,255,255, 0.3)"
        mx="-30px"
        width="115%"
        mb={3}
        style={{ height: '2px' }}
      />
      <Flex>
        <DisplayIcon src={logo} />
        <Flex flexDirection="column" mx="18px">
          <Description fontSize="15px" mb={2}>
            {description}
          </Description>
          <PriceDetail
            marketCap={BN.parse(marketCap).bandToUSD(bandPrice)}
            price={BN.parse(price).bandToUSD(bandPrice)}
            last24Hrs={last24Hrs.toFixed(2)}
          />
          <Flex flexDirection="row" alignItems="center" mt={2}>
            <Link to={`/community/${tokenAddress}/overview`}>
              <Button
                variant="white"
                style={{ padding: '12px 25px' }}
                onClick={e => e.stopPropagation(e)}
              >
                Overview
              </Button>
            </Link>
            {isTcd ? (
              <Link to={`/community/${tokenAddress}/dataset`}>
                <Button
                  variant="white"
                  ml={3}
                  style={{ padding: '12px 25px' }}
                  onClick={e => e.stopPropagation(e)}
                >
                  Dataset
                </Button>
              </Link>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Card>
)
