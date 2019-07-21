import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Card, Text, Flex, AbsoluteLink } from 'ui/common'
import { convertToBalls, decodeScores } from 'utils/helper'
import { IPFS } from 'band.js'

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

const Ball = styled(Text).attrs(p => ({
  mr: p.mr || 2,
  fontSize: 12,
  fontFamily: 'code',
  fontWeight: '700',
  color: 'white',
}))`
  height: 28px;
  width: 28px;
  line-height: 28px;
  background: ${p => (p.red ? colors.gradient.purple : '#6a6b81')};
  border-radius: 50%;
  text-align: center;
`

export const getFormat = symbol => {
  switch (symbol.toUpperCase()) {
    case 'XFN':
    default:
      return {
        logIdentifier: 'price of trading pair',
        formatValue: price => {
          const p = parseInt(price) / 1e18
          return (
            <Data>
              {p.toLocaleString('en-US', {
                currency: 'USD',
                ...(p > 1
                  ? {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  : {
                      minimumSignificantDigits: 2,
                      maximumSignificantDigits: 3,
                    }),
              })}
            </Data>
          )
        },
      }
    case 'XLT':
      return {
        logIdentifier: 'date of lottery release',
        formatValue: value => {
          const balls = convertToBalls(value)
          return (
            <Flex
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Ball>{balls['whiteBall1']}</Ball>
              <Ball>{balls['whiteBall2']}</Ball>
              <Ball>{balls['whiteBall3']}</Ball>
              <Ball>{balls['whiteBall4']}</Ball>
              <Ball>{balls['whiteBall5']}</Ball>
              <Ball red>{balls['redBall']}</Ball>
              <Card
                borderRight="solid 1px #DBDAFF"
                style={{ height: '36px' }}
                mr={2}
              />
              <Text
                color="purple"
                fontSize={16}
                fontFamily="code"
                fontWeight="900"
              >
                {balls['mul']}x
              </Text>
            </Flex>
          )
        },
      }
    case 'XSP':
      return {
        logIdentifier: "sport's match",
        formatValue: value => {
          const [scoreHome, scoreAway] = decodeScores(value)
          return (
            <Data>
              {scoreHome} - {scoreAway}
            </Data>
          )
        },
      }
    case 'XWB':
      return {
        logIdentifier: "web's requests",
        formatValue: value => {
          return <Data>{value}</Data>
        },
      }
  }
}

export const getFormatDataKey = (symbol, key) => {
  switch (symbol) {
    case 'XWB':
      const ipfsPath = IPFS.toIPFSHash(key.slice(6, 70))
      return (
        <AbsoluteLink href={`https://ipfs.io/ipfs/${ipfsPath}`}>
          {ipfsPath}
        </AbsoluteLink>
      )
    default:
      return key
  }
}
