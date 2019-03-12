import React from 'react'
import { Card, Flex, Box, Text } from 'ui/common'
import styled from 'styled-components'
import colors from 'ui/colors'

import ParameterInput from 'components/ParameterInput'

import { getUnitFromType, convertFromChain } from 'utils/helper'

const WhiteCard = styled(Card).attrs({
  variant: 'modal',
  width: '410px',
  mb: 3,
})`
  height: 200px;
`

export default ({
  name,
  description,
  value,
  type,
  isEdit,
  handleParameterChange,
}) => {
  const convertedValue = convertFromChain(value, type, getUnitFromType(type))
  return (
    <WhiteCard>
      <Flex
        flexDirection="column"
        style={{ height: '100%', padding: '28px 40px 28px 16px' }}
      >
        <Text fontSize={1} fontWeight="bold" color={colors.purple.normal}>
          {name}
        </Text>
        <Text color={colors.text.grey} fontSize={0} lineHeight={1.43} mt={3}>
          {description}
        </Text>
        <Box flex={1} />
        <Flex>
          <Text
            fontSize={0}
            fontWeight="bold"
            color={colors.purple.normal}
            mr={3}
          >
            Value:
          </Text>
          {isEdit ? (
            <ParameterInput
              value={convertedValue}
              type={type}
              handleParameterChange={handleParameterChange}
            />
          ) : (
            <Text fontSize={0}>
              {convertedValue.toFixed(2) + ' ' + getUnitFromType(type)}
            </Text>
          )}
        </Flex>
      </Flex>
    </WhiteCard>
  )
}
