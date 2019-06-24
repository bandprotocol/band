import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'

const WithBottomBorder = styled(Flex)`
  border-radius: 6px;
  border: solid 1px #dde5ff;
  background-color: #fafbff;
  max-width: 350px;
  min-width: 350px;
  &:not(:last-child) {
    border-bottom: 1px solid #e6eaff;
  }
`

export default ({ title, description, current, changeTo }) => (
  <WithBottomBorder
    py="18px"
    flexDirection="column"
    pl="20px"
    pr="10px"
    mb="15px"
    mr="15px"
  >
    <Text fontWeight="900" color="#5269ff">
      {title}
    </Text>
    <Flex mt="20px">
      <Text fontSize={0} lineHeight={1.43}>
        {description}
      </Text>
    </Flex>
    <Flex flexDirection="column" mt="20px">
      <Flex>
        <Flex mr="10px">
          <Text fontSize={0} fontWeight="500" color="#5269ff">
            Current:
          </Text>
        </Flex>
        <Flex>
          <Text
            fontSize={0}
            fontWeight="500"
            style={{
              width: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {current}
          </Text>
        </Flex>
      </Flex>
      <Flex mt="10px">
        <Flex mr="10px">
          <Text
            fontSize={0}
            fontWeight="500"
            color="#5269ff"
            style={{
              width: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            Change to:
          </Text>
        </Flex>
        <Flex>
          <Text fontSize={0} fontWeight="700">
            {changeTo}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </WithBottomBorder>
)
