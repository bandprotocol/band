import React from 'react'
import { Flex, Text } from 'ui/common'
import ParameterCard from 'components/ParameterCard'
import { getParameterDetail } from 'utils/helper'

export default ({ params }) => (
  <Flex
    flexDirection="column"
    mt="30px"
    bg="#fff"
    p="25px"
    style={{
      borderRadius: '10px',
      boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
    }}
  >
    <Text fontSize="20px" color="#393939" fontWeight="900">
      Configurations
    </Text>
    <Flex flexWrap="wrap" mt="28px">
      {params.map(param => (
        <ParameterCard
          {...param}
          key={param.name}
          detail={getParameterDetail(param.name)}
          isEdit={false}
          padding="17px 23px 19px 19px"
          margin="0px 20px 17px 0px"
          width="346px"
        />
      ))}
    </Flex>
  </Flex>
)
