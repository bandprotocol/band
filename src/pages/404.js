import React from 'react'
import { Flex, Box, Text } from 'rebass'

export default () => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    style={{ height: 'calc(100vh - 497px)' }}
  >
    <Box my={4}>
      <Text fontWeight={600} fontSize={24}>
        404: You've wondered too far!
      </Text>
    </Box>

    <Box>
      <Text fontSize={16}>No block is found here</Text>
    </Box>
  </Flex>
)
