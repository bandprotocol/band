import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import ParameterInput from 'components/ParameterInput'
import colors from 'ui/colors'
import { getParameterDetail, convertFromChain } from 'utils/helper'

const A = styled.a`
  color: #4e3ca9;
  text-decoration: underline;
`

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${p => p.bg || '#7c84a6'};
  width: ${p => p.size || '20px'};
  height: ${p => p.size || '20px'};
  position: relative;
  color: white;
`

const ParamRect = styled(Flex)`
  width: 315px;
  height: 340px;
  border-radius: 6px;
  background-color: #f4f6ff;
  padding: 25px;
`

const CircleTooltip = () => (
  <Circle>
    <Text
      style={{
        position: 'relative',
        float: 'left',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      ?
    </Text>
  </Circle>
)

const GroupTitle = ({ title }) => (
  <Flex flexDirection="row">
    <Flex mr="10px">
      <Text fontSize="20px" fontWeight={500} color="#4e3ca9">
        {title}
      </Text>
    </Flex>
    <CircleTooltip />
  </Flex>
)

const ParameterField = ({ name, value, handleParameterChange }) => {
  const detail = getParameterDetail(name)
  const [convertedValue, unit] = convertFromChain(value, detail.type)

  return (
    <React.Fragment>
      <Flex flexDirection="row" alignItems="center" mt="20px">
        <Flex mr="10px">
          <Text fontSize="14px" fontWeight={500} color={colors.purple.dark}>
            {name}
          </Text>
        </Flex>
        <CircleTooltip />
      </Flex>
      <Flex mt="10px" alignItems="center">
        <ParameterInput
          width="250px"
          height="35px"
          borderColor="#e7ecff"
          value={convertedValue}
          type={detail.type}
          unit={unit}
          handleParameterChange={handleParameterChange}
        />
      </Flex>
    </React.Fragment>
  )
}

export default ({ kvs, setKeyValue }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    style={{ height: '600px' }}
    mt="40px"
  >
    {/* Header */}
    <Flex width="535px" flexDirection="column" alignItems="center">
      <Text fontSize="20px" fontWeight={500} color="#4e3ca9">
        Parameters
      </Text>
      <Text
        fontSize="16px"
        fontWeight={300}
        textAlign="center"
        mt="10px"
        lineHeight={1.69}
        letterSpacing={0.6}
      >
        Spicy jalapeno bacon ipsum dolor amet sausage pig jerky tail tongue
        frankfurter andouille.{' '}
        <A style={{ 'text-decoration': 'underline' }}>Learn more</A>
      </Text>
    </Flex>
    {/* Params Box */}
    <Flex flexDirection="row" mt="50px" width="720px">
      <Flex flex={1}>
        <Flex flexDirection="column">
          <GroupTitle title="Params" />
          <ParamRect mt="15px" flexDirection="column">
            {/* expiration_time */}
            <ParameterField
              name="expiration_time"
              value={kvs['params:expiration_time']}
              handleParameterChange={value =>
                setKeyValue('params:expiration_time', value)
              }
            />
            {/* min_participation_pct */}
            <ParameterField
              name="min_participation_pct"
              value={kvs['params:min_participation_pct']}
              handleParameterChange={value =>
                setKeyValue('params:min_participation_pct', value)
              }
            />
            {/* support_required_pct */}
            <ParameterField
              name="support_required_pct"
              value={kvs['params:support_required_pct']}
              handleParameterChange={value =>
                setKeyValue('params:support_required_pct', value)
              }
            />
          </ParamRect>
        </Flex>
      </Flex>
      {/* Curve Box */}
      <Flex flex={1} justifyContent="flex-end">
        <Flex flexDirection="column">
          <GroupTitle title="Curve" />
          <ParamRect mt="15px" flexDirection="column">
            {/* liqudity_fee */}
            <ParameterField
              name="liqudity_fee"
              value={kvs['curve:liqudity_fee']}
              handleParameterChange={value =>
                setKeyValue('curve:liqudity_fee', value)
              }
            />
            {/* inflation_rate */}
            <ParameterField
              name="inflation_rate"
              value={kvs['curve:inflation_rate']}
              handleParameterChange={value =>
                setKeyValue('curve:inflation_rate', value)
              }
            />
          </ParamRect>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)
