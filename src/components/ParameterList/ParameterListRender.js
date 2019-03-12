import React from 'react'
import { Flex } from 'ui/common'
import ParameterCard from 'components/ParameterCard'

import { getParameterType } from 'utils/helper'

export default ({ params, isEdit, handleParameterChange }) => (
  <Flex flexWrap="wrap" justifyContent="space-between" px={4}>
    {params.map(param => (
      <ParameterCard
        {...param}
        key={param.name}
        type={getParameterType(param.name)}
        isEdit={isEdit}
        handleParameterChange={value =>
          handleParameterChange(param.name, value)
        }
      />
    ))}
  </Flex>
)
