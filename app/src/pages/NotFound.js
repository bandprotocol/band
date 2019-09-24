import React from 'react'
import { Flex, Text } from 'ui/common'

const NotFound = () => {
  return (
    <Flex width="100%" mt="200px" ml="30vw" flexDirection="column">
      <Text fontSize="40px" color="black">
        Oops!
      </Text>
      <Text fontSize="20px" mt="30px">
        We can't seem to find the page you're asking for.
      </Text>
    </Flex>
  )
}

export default NotFound
