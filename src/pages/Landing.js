import React from 'react'
import { Flex, Box, Text } from 'rebass'

export default props => (
  <Flex flexDirection="column" alignItems="center">
    <Box my={4}>
      <Text fontWeight={600} fontSize={24}>
        Let's BUIDL
      </Text>
    </Box>

    <Box>
      <Text fontSize={16}>Your adventure starts here.</Text>
    </Box>
  </Flex>
)
