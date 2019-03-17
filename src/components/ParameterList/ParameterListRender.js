import React from 'react'
import { Flex } from 'ui/common'
import ParameterCard from 'components/ParameterCard'

import { getParameterDetail } from 'utils/helper'

export default ({ params, isEdit, handleParameterChange }) => (
  <Flex flexWrap="wrap" justifyContent="space-between">
    {params.map(param => (
      <ParameterCard
        {...param}
        key={param.name}
        detail={getParameterDetail(param.name)}
        isEdit={isEdit}
        handleParameterChange={value =>
          handleParameterChange(param.name, value)
        }
      />
    ))}
  </Flex>
)
