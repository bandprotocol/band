import React from 'react'
import { Flex, Text, H2 } from 'ui/common'
import { FormattedMessage } from 'react-intl'

export default ({ lines }) => (
  <Flex flexDirection="column" style={{ width: '100%' }}>
    <Flex flexDirection="column" m="0px 46px">
      <H2 lineHeight="32px" style={{ fontSize: '24px' }}>
        <FormattedMessage id={lines[0]}></FormattedMessage>
        <br />
        <FormattedMessage id={lines[1]}></FormattedMessage>
      </H2>
      <Text
        mt="10px"
        fontWeight="500"
        lineHeight="26px"
        color="#ffffff"
        style={{ fontSize: '16px' }}
      >
        <FormattedMessage id={lines[2]}></FormattedMessage>
        <br />
        <FormattedMessage id={lines[3]}></FormattedMessage>
      </Text>
    </Flex>
  </Flex>
)
