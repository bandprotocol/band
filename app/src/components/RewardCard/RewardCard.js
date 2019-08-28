import React from 'react'
import { Flex, Text, Card, Image, AbsoluteLink, Button, Box } from 'ui/common'
import colors from 'ui/colors'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt, faCheck } from '@fortawesome/free-solid-svg-icons'

const MaskCircle = styled(Box)`
  position: absolute;
  background: ${colors.background.lighter};
  border: solid 1.5px #e7ecff;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  top: -13px;

  &:after {
    position: absolute;
    content: '';
    height: 26px;
    width: 12px;
    left: -1px;
    top: -2px;
    background: ${colors.background.lighter};
    z-index: 1;
  }

  ${p =>
    p.right
      ? `
    left: -13px;
  `
      : `
    right: -13px;
    transform: rotate(180deg);
  `}
`

const BottomTicket = styled(Flex).attrs({
  bg: '#fff',
  mt: '-30px',
  alignItems: 'center',
  justifyContent: 'center',
})`
position: relative;
    border: solid 1.5px #e7ecff;
    borderRadius: 4px;
    border-top-style: dashed;
    border-top-width: 3.3px;
    height: 86px;
    boxShadow: '0 12px 12px 0 #f3f5ff;
    background: #000;
`

const claimedOpacity = '0.6'

export default ({
  src,
  link,
  header,
  total,
  period,
  logedin,
  claimed,
  amount,
  onClick,
}) => (
  <Flex flexDirection="column" px={2} py={2}>
    <Card
      variant="detail"
      py={3}
      pl={4}
      pr={3}
      bg="#fff"
      style={{
        borderBottomWidth: `${logedin ? '0px' : '1.5px'}`,
        alignSelf: 'flex-start',
        width: '290px',
        height: '265px',
        opacity: `${claimed ? claimedOpacity : '1'}`,
      }}
    >
      <Flex flexDirection="column">
        <Flex alignItems="flex-start">
          {/* Reward Image */}
          <Image
            src={src}
            borderRadius="50%"
            width="100px"
            height="100px"
            m={2}
          />
          {/* LinkIcon */}
          {link && (
            <AbsoluteLink
              href={link}
              style={{ marginLeft: 'auto', fontSize: '1.2em' }}
              dark
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </AbsoluteLink>
          )}
        </Flex>
        {/* Header */}
        <Text color={colors.purple.dark} fontSize={2} fontWeight="600" py={3}>
          {header}
        </Text>
        {/* Total Reward */}
        <Flex flexDirection="row" py={2}>
          <Text color={colors.text.grey} fontSize={0} fontWeight="500">
            Total Reward:
          </Text>
          <Text
            color={colors.purple.normal}
            fontSize={0}
            fontWeight="bold"
            px={2}
          >
            {total}
          </Text>
        </Flex>
        {/* Period */}
        <Flex flexDirection="row" py={1}>
          <Text color={colors.text.grey} fontSize={0} fontWeight="500">
            Period:
          </Text>
          <Text
            color={colors.purple.normal}
            fontSize={0}
            fontWeight="bold"
            px={2}
          >
            {period}
          </Text>
        </Flex>
      </Flex>
    </Card>
    {logedin && (
      <BottomTicket style={{ opacity: `${claimed ? claimedOpacity : '1'}` }}>
        <MaskCircle />
        <MaskCircle right />
        <Button
          variant="primary"
          style={{
            fontSize: 14,
            boxShadow: '0 4px 5px 0 rgba(136, 104, 255, 0.26)',
            pointerEvents: `${claimed ? 'none' : 'auto'}`,
          }}
          onClick={onClick}
        >
          {claimed && (
            <FontAwesomeIcon icon={faCheck} style={{ paddingRight: '4px' }} />
          )}
          Get {amount}
        </Button>
      </BottomTicket>
    )}
  </Flex>
)
