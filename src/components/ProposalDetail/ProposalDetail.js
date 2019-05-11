import React from 'react'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'

export default ({ title, description, current, changeTo }) => (
  <Flex
    py="20px"
    flexDirection="column"
    style={{ borderBottom: '1px solid #cbcfe3' }}
  >
    <Text fontWeight="500" color={colors.blue.dark}>
      {title}
    </Text>
    <Flex mt="20px">
      <Text fontSize={0} lineHeight={1.43}>
        {description}
      </Text>
    </Flex>
    <Flex flexDirection="row" flex={1} mt="20px">
      <Flex width={1 / 5}>
        <Flex mr="10px">
          <Text fontSize={0} fontWeight="500" color={colors.blue.dark}>
            Current:
          </Text>
        </Flex>
        <Flex>
          <Text
            fontSize={0}
            fontWeight="500"
            width="80px"
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {current}
          </Text>
        </Flex>
      </Flex>
      <Flex width={1 / 5}>
        <Flex mr="10px">
          <Text fontSize={0} fontWeight="500" color={colors.blue.dark}>
            Change to:
          </Text>
        </Flex>
        <Flex>
          <Text fontSize={0} fontWeight="500">
            {changeTo}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)
