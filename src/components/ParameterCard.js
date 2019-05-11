import React from 'react'
import { Card, Flex, Text } from 'ui/common'
import styled from 'styled-components'
import colors from 'ui/colors'

import ParameterInput from 'components/ParameterInput'

import { convertFromChain } from 'utils/helper'

const WhiteCard = styled(Card).attrs({
  border: 'solid 1px #dee2f0',
  bg: '#ffffff',
  width: '365px',
  mb: 3,
  mr: '24px',
})`
  height: 200px;
  border-radius: 10px;
`

export default ({ name, value, detail, isEdit, handleParameterChange }) => {
  const [convertedValue, unit] = convertFromChain(value, detail.type)
  return (
    <WhiteCard>
      <Flex
        flexDirection="column"
        style={{ height: '100%', padding: '28px 40px 28px 21px' }}
      >
        <Text fontSize={1} fontWeight="bold" color={colors.blue.dark}>
          {name}
        </Text>
        <Text color={colors.text.grey} fontSize={0} lineHeight={1.43} mt={3}>
          {detail.description}
        </Text>
        <Flex flex={1} />
        <Flex alignItems="center" py={1} mt={3} style={{ height: '30px' }}>
          <Text fontSize={0} color={colors.blue.dark} mr={3}>
            Value:
          </Text>
          {isEdit ? (
            <ParameterInput
              value={convertedValue}
              type={detail.type}
              unit={unit}
              handleParameterChange={handleParameterChange}
            />
          ) : (
            <Text
              fontSize={0}
              width="80%"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {convertedValue + ' ' + unit}
            </Text>
          )}
        </Flex>
      </Flex>
    </WhiteCard>
  )
}
