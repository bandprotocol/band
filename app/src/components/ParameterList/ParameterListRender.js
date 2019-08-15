import React from 'react'
import { Flex } from 'ui/common'
import ParameterCard from 'components/ParameterCard'

import { getParameterDetail } from 'utils/helper'

export default ({ params, isEdit, handleParameterChange, whiteCardStyle }) => (
  <Flex flexWrap="wrap" mr="-24px">
    {params.map(param => (
      <ParameterCard
        {...param}
        key={param.name}
        detail={getParameterDetail(param.name)}
        isEdit={isEdit}
        whiteCardStyle={whiteCardStyle}
        handleParameterChange={value =>
          handleParameterChange(param.name, value)
        }
      />
    ))}
    {params.length % 3 === 2 && <Flex width="370px" />}
  </Flex>
)
