import React from 'react'
import styled from 'styled-components'

import { Flex, Box, Image, Text, AbsoluteLink, Button } from 'ui/common'

import { colors } from 'ui'

import ConfirmIcon from 'images/checkmark_symbol.svg'

const Circle = styled(Box)`
  min-height: 75px;
  min-width: 75px;
  border-radius: 50%;
`

const ConfirmationText = styled(Text)`
  text-decoration: underline;
  font-size: 14px;
  font-weight: 500;
`

const CloseButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: 500;
`

export default ({ confirmationNumber, txLink, onClose }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    bg="#ffffff"
    width="430px"
    p="40px 20px 20px"
    style={{ borderRadius: '6px' }}
  >
    <Flex justifyContent="center" style={{ position: 'relative' }}>
      <Circle bg={colors.purple.normal} />
      <Image
        src={ConfirmIcon}
        style={{ position: 'absolute', zIndex: 5 }}
        mt="22px"
      />
    </Flex>
    <Text fontSize={16} fontWeight="bold" color={colors.purple.dark} my="25px">
      DONE!
    </Text>
    <Text
      fontSize={14}
      textAlign="center"
      letterSpacing="-0.2px"
      color={colors.text.normal}
      mb={4}
    >
      Please wait for the transaction to be included in
      <br /> the blockchain. This operation may take up to 5 minutes.
    </Text>
    <AbsoluteLink href={txLink}>
      <ConfirmationText>
        {confirmationNumber}/12 blocks confirmed
      </ConfirmationText>
    </AbsoluteLink>
    <CloseButton variant="primary" mt="40px" onClick={onClose}>
      OK
    </CloseButton>
  </Flex>
)
