import React from 'react'
import { Flex, Text, H2, H3 } from 'ui/common'

export default ({ lines }) => (
  <Flex flexDirection="column" style={{ width: '100%' }}>
    <Flex flexDirection="column" m="0px 46px 10px">
      <H2 lineHeight="32px" style={{ fontSize: '24px' }}>
        {lines[0]}
        <br />
        {lines[1]}
      </H2>
      <H3
        mt="8px"
        fontWeight="500"
        lineHeight="24px"
        style={{ fontSize: '16px' }}
      >
        {lines[2]}
        <br />
        {lines[3]}
      </H3>
    </Flex>
  </Flex>
)
