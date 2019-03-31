import React from 'react'
import styled from 'styled-components/macro'
import { colors } from 'ui'
import BN from 'utils/bignumber'
import { Flex, Text, Image, Box, AbsoluteLink, Card, Bold } from 'ui/common'

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
  height: 38px;
`

const PriceDetail = ({ marketCap, price, last24Hrs }) => (
  <Flex
    flexDirection="row"
    pt={2}
    pb={1}
    justifyContent="space-around"
    alignItems="center"
  >
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text color={colors.purple.dark} fontSize={12} fontWeight="500">
        Market Cap.
      </Text>
      <Text color={colors.text.normal} fontSize={1} py="12px" fontWeight="500">
        $ {marketCap.shortPretty()}
      </Text>
    </Flex>
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={3}
    >
      <Text color={colors.purple.dark} fontSize={12} fontWeight="500">
        Price
      </Text>
      <Text color={colors.text.normal} fontSize={1} py="12px" fontWeight="500">
        $ {price.shortPretty()}
      </Text>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text color={colors.purple.dark} fontSize={12} fontWeight="500">
        Last 24 hrs.
      </Text>
      <Text
        color={last24Hrs >= 0.0 ? colors.green.normal : colors.red.normal}
        fontSize={1}
        fontWeight="500"
        py="12px"
      >
        {last24Hrs >= 0.0 ? '+' : null}
        {last24Hrs} %
      </Text>
    </Flex>
  </Flex>
)

export default ({
  community: {
    name,
    banner,
    website,
    organization,
    description,
    marketCap,
    price,
    last24Hrs,
  },
  bandPrice,
  onClick,
}) => (
  <Card
    variant="primary"
    flex={['', '0 0 350px']}
    p="14px"
    bg="#fff"
    my={3}
    mx="20px"
    css={{
      alignSelf: 'flex-start',
      ...(onClick
        ? {
            cursor: 'pointer',
            transition: 'all 200ms',
            boxShadow: '0 0 0 0 #ffffff',
            border: '0px solid #ffffff',

            '&:hover': {
              boxShadow: '0 10px 17px 0 #e6e9f5',
            },
          }
        : {}),
    }}
    style={{
      borderRadius: '10px',
      padding: '0px',
      overflow: 'hidden',
    }}
    onClick={onClick}
  >
    {/* Image Banner */}
    <div
      style={{
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '150px',
      }}
    />
    <Flex
      flexDirection={['column-reverse', 'row']}
      alignItems="flex-start"
      pl={[2, 0]}
    >
      <Box flex={1} mx="20px">
        <Flex flexDirection="row" alignItems="center">
          <WrapText
            color={colors.text.normal}
            size={16}
            fontWeight="500"
            lineHeight={2}
            mt={1}
          >
            {name}
          </WrapText>
          <Text>
            {website && (
              <AbsoluteLink
                href={website}
                style={{ marginLeft: 10, fontSize: '0.9em' }}
                dark
                onClick={e => e.stopPropagation()}
              >
                <i className="fas fa-external-link-alt" />
              </AbsoluteLink>
            )}
          </Text>
        </Flex>
        <WrapText fontSize={11} color="#4a3e86" fontWeight="200">
          By {organization}
        </WrapText>
        <Description lineHeight="19px" fontSize={12} mt={2} mb={2}>
          {description}
        </Description>
      </Box>
    </Flex>
    {/* PriceDetail */}
    <PriceDetail
      marketCap={BN.parse(marketCap).bandToUSD(bandPrice)}
      price={BN.parse(price).bandToUSD(bandPrice)}
      last24Hrs={last24Hrs.toFixed(2)}
    />
  </Card>
)
