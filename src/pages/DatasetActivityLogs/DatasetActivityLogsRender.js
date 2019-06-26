import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Flex, Box, Text, Card, Image, Button, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const SearchBox = styled.input`
  border-radius: 18px;
  border: solid 1px #e7ecff;
  padding: 0 1em 0 1.4em;
  width: 360px;
  line-height: 32px;
  font-size: 14px;
`

/*
{value.toLocaleString('en-US', {
                    currency: 'USD',
                    minimumFractionDigits: type === 'FX' ? 4 : 2,
                    maximumFractionDigits: type === 'FX' ? 4 : 2,
                  })}
*/

const Data = ({ children }) => (
  <Card
    flex="0 0 auto"
    bg="#f3f6ff"
    border="solid 1px #a4bdfe"
    py={1}
    px={3}
    borderRadius="4px"
  >
    <Text ml="auto" fontFamily="code" fontSize={14} fontWeight="bold">
      {children}
    </Text>
  </Card>
)

const Report = ({
  event: {
    data: {
      provider,
      signature: { r, s, v },
      timestamp,
      value,
    },
    id,
    key: dataKey,
  },
}) => (
  <Flex
    py="18px"
    px="32px"
    style={{ borderBottom: 'solid 1px #eef3ff' }}
    alignItems="flex-start"
  >
    <Jazzicon diameter={28} seed={jsNumberForAddress(provider)} />
    <Box ml="32px" flex={1}>
      <Flex>
        <Text fontSize="14px" fontWeight="700">
          PowerBall.com
        </Text>
        <Text fontSize="14px" fontWeight="700" mx={2} color="#4d7dff">
          reported price of trading pair
        </Text>
        <Text fontSize="14px" fontWeight="700">
          {dataKey}
        </Text>
      </Flex>
      <Flex mt="10px">
        <Text fontSize="14px" color="#9e9e9e">
          Just now
        </Text>
        <Text fontSize="14px" ml={2} color="#9baeda">
          signed by {provider}
        </Text>
      </Flex>
    </Box>
    <Data>{value}</Data>
  </Flex>
)

const Broadcast = ({
  event: {
    data: { reported_data, timestamp, tx_hash },
    id,
    key: dataKey,
  },
}) => (
  <Flex
    py="18px"
    px="32px"
    style={{ borderBottom: 'solid 1px #eef3ff' }}
    alignItems="flex-start"
  >
    <Jazzicon
      diameter={28}
      seed={jsNumberForAddress('0x0000000000000000000000000000000000000000')}
    />{' '}
    {/** TODO: Use Band Address */}
    <Box ml="32px" flex={1}>
      <Flex>
        <Text fontSize="14px" fontWeight="700">
          Band Protocol
        </Text>
        <Text fontSize="14px" fontWeight="700" mx={2} color="#42c47f">
          reported price of trading pair
        </Text>
        <Text fontSize="14px" fontWeight="700">
          {dataKey}
        </Text>
      </Flex>
      <Flex mt="10px" mb="20px">
        <Text fontSize="14px" color="#9e9e9e">
          Just now
        </Text>
        <Text fontSize="14px" ml={2} color="#9baeda">
          tx {tx_hash}
        </Text>
      </Flex>
      {Object.entries(reported_data)
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([k, v]) => (
          <Flex ml={2} alignItems="center" style={{ position: 'relative' }}>
            <Box
              flex="0 0 auto"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                borderLeft: 'solid 1px #eef3ff',
                transform: 'translateY(-50%)',
              }}
            />
            <Box flex="0 0 15px" style={{ borderTop: 'solid 1px #eef3ff' }} />
            <Flex flex="0 0 120px" alignItems="center">
              <Text mx={2} flex=" 0 0 auto" fontSize="14px" fontWeight="700">
                {'PowerBall'}
              </Text>
              <Box flex="1" style={{ borderTop: 'solid 1px #eef3ff' }} />
            </Flex>
            <Text flex={1} fontSize="13px" color="#9baeda">
              {k}
            </Text>
            <Box my={1}>
              <Data>{v}</Data>
            </Box>
          </Flex>
        ))}
    </Box>
  </Flex>
)

export default props => (
  <PageStructure
    renderHeader={() => (
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Text fontSize="36px" fontWeight="900">
          Lottery
        </Text>
        <Text fontSize="20px" mt={3}>
          Get winning numbers of lotteries all around the world
        </Text>
      </Flex>
    )}
    {...props}
  >
    <Card
      bg="#ffffff"
      px={4}
      py={3}
      borderRadius="10px"
      boxShadow="0 2px 9px 4px rgba(0, 0, 0, 0.04)"
    >
      <Flex py={2} alignItems="center">
        <Text fontWeight="700" fontSize="20px">
          Activity Logs
        </Text>
        <Box flex={1} />
        <SearchBox placeholder="Search" />
      </Flex>
      <Box mt={2}>
        {props.data.map(event =>
          event.type === 'REPORT' ? (
            <Report key={event.id} event={event} />
          ) : event.type === 'BROADCAST' ? (
            <Broadcast key={event.id} event={event} />
          ) : null,
        )}
      </Box>
    </Card>
  </PageStructure>
)
