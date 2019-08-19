import React from 'react'
import { Flex, Text, Image, Box } from 'ui/common'
import ArrowRight from 'images/icon-right-arrow.svg'

export default ({ text, ml = '0px', padding = '16px' }) => (
  <Flex flexDirection="row" alignItems="center"  ml={ml} style={{ height: '35px' }}>
    <Text
      fontWeight="bold"
      color="#323232"
      style={{ fontFamily: 'bio-sans', whiteSpace: 'nowrap' }}
    >
      {text}
    </Text>
    <Box>
      <Image src={ArrowRight} ml={padding} />
    </Box>
  </Flex>
)
