import React from 'react'
import styled from 'styled-components'

import { Flex, Text } from 'ui/common'

const BgCard = styled(Flex).attrs({
  bg: 'white',
  flexDirection: 'column',
})`
  width: 400px;
  height: 281px;
  border-radius: 6px;
  box-shadow: 0 12px 23px 0 rgba(0, 0, 0, 0.13);
`

export default () => {
  return (
    <BgCard mt="100px">
      <Flex
        style={{ height: '55px', borderBottom: '1px solid #ededed' }}
        pl="30px"
        alignItems="center"
      >
        <Text color="#4e3ca9" fontFamily="Avenir-Heavy" fontSize="14px">
          Become a provider
        </Text>
      </Flex>
      <Flex pt="20px" px="30px" flexDirection="column">
        <Text color="#4a4a4a" fontSize="14px" lineHeight={1.43}>
          Please contact: contact@bandprotocol.com
        </Text>
      </Flex>
    </BgCard>
  )
}
