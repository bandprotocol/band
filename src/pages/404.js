import React from 'react'
import { Flex, Box, Text } from 'rebass'

export default props => (
  <Flex flexDirection="column" alignItems="center">
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
