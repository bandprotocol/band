import React from 'react'
import { Flex, Text } from 'ui/common'

export default ({ lines }) => (
  <Flex flexDirection="column" style={{ width: '100%' }}>
    <Flex flexDirection="column" m="15px 52px">
      <Text fontSize="26px" color="white" fontWeight="900" lineHeight="34px">
        {lines[0]}
        <br />
        {lines[1]}
      </Text>
      <Text
        mt="8px"
        fontSize="18px"
        color="white"
        fontWeight="500"
        lineHeight="28px"
      >
        {lines[2]}
        <br />
        {lines[3]}
      </Text>
    </Flex>
  </Flex>
)
