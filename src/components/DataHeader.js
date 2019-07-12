import React from 'react'
import { Flex, Text, H2, H4 } from 'ui/common'

export default ({ lines }) => (
  <Flex flexDirection="column" style={{ width: '100%' }}>
    <Flex flexDirection="column" m="15px 52px">
      <H2 lineHeight="34px">
        {lines[0]}
        <br />
        {lines[1]}
      </H2>
      <H4 mt="8px" fontWeight="500" lineHeight="28px">
        {lines[2]}
        <br />
        {lines[3]}
      </H4>
    </Flex>
  </Flex>
)
