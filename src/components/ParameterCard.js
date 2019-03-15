import React from 'react'
import { Card, Flex, Box, Text } from 'ui/common'
import styled from 'styled-components'
import colors from 'ui/colors'

import ParameterInput from 'components/ParameterInput'

import { getUnitFromType, convertFromChain } from 'utils/helper'

const WhiteCard = styled(Card).attrs({
  variant: 'modal',
  width: '412px',
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
        <Text fontSize={0} fontWeight="bold" color={colors.purple.normal}>
          {name}
        </Text>
        {/* TODO: Mock description */}
        <Text color={colors.text.grey} fontSize={0} lineHeight={1.43} mt={3}>
          {description ||
            'The percentage of the reward pool in a challenge which is awarded to the winning party. Must be between 50% (the stake amount) to 100% (the total reward pool).'}
        </Text>
        <Flex alignItems="center" py={2} mt={2}>
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
            <Text
              fontSize={0}
              width="80%"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {convertedValue + ' ' + getUnitFromType(type)}
            </Text>
          )}
        </Flex>
      </Flex>
    </WhiteCard>
  )
}
