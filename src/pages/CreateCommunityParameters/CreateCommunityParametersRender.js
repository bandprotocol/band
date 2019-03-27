import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, AbsoluteLink } from 'ui/common'
import ParameterInput from 'components/ParameterInput'
import colors from 'ui/colors'

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

export default ({ setKeyValue, kvs }) => {
  const handleParamsChange = (key, val, type, unit) => {
    console.log(key, val, type, unit)
    setKeyValue(key, val.toString(), type, unit)
  }
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      style={{ height: '600px' }}
      mt="40px"
    >
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
      <Flex flexDirection="row" mt="50px" width="720px">
        <Flex flex={1}>
          <Flex flexDirection="column">
            <Flex flexDirection="row">
              <Flex mr="10px">
                <Text fontSize="20px" fontWeight={500} color="#4e3ca9">
                  Params
                </Text>
              </Flex>
              <CircleTooltip />
            </Flex>
            <ParamRect mt="15px" flexDirection="column">
              <Flex flexDirection="row" alignItems="center" mt="20px">
                <Flex mr="10px">
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color={colors.purple.dark}
                  >
                    expiration_time
                  </Text>
                </Flex>
                <CircleTooltip />
              </Flex>
              <Flex mt="10px" alignItems="center">
                <ParameterInput
                  type="TIME"
                  unit="minutes"
                  width="250px"
                  height="35px"
                  borderColor="#e7ecff"
                  value={kvs['params:expiration_time']}
                  handleParameterChange={(val, type, unit) =>
                    handleParamsChange(
                      'params:expiration_time',
                      val,
                      type,
                      unit,
                    )
                  }
                />
              </Flex>
              <Flex flexDirection="row" alignItems="center" mt="20px">
                <Flex mr="10px">
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color={colors.purple.dark}
                  >
                    min_participation_pct
                  </Text>
                </Flex>
                <CircleTooltip />
              </Flex>
              <Flex mt="10px" alignItems="center">
                <ParameterInput
                  type="PERCENTAGE"
                  width="250px"
                  height="35px"
                  borderColor="#e7ecff"
                  unit="%"
                  value={kvs['params:min_participation_pct']}
                  handleParameterChange={(val, type, unit) =>
                    handleParamsChange(
                      'params:min_participation_pct',
                      val,
                      type,
                      unit,
                    )
                  }
                />
              </Flex>
              <Flex flexDirection="row" alignItems="center" mt="20px">
                <Flex mr="10px">
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color={colors.purple.dark}
                  >
                    support_required_pct
                  </Text>
                </Flex>
                <CircleTooltip />
              </Flex>
              <Flex mt="10px" alignItems="center">
                <ParameterInput
                  type="PERCENTAGE"
                  width="250px"
                  height="35px"
                  borderColor="#e7ecff"
                  unit="%"
                  value={kvs['params:support_required_pct']}
                  handleParameterChange={(val, type, unit) =>
                    handleParamsChange(
                      'params:support_required_pct',
                      val,
                      type,
                      unit,
                    )
                  }
                />
              </Flex>
            </ParamRect>
          </Flex>
        </Flex>
        <Flex flex={1} justifyContent="flex-end">
          <Flex flexDirection="column">
            <Flex flexDirection="row">
              <Flex mr="10px">
                <Text fontSize="20px" fontWeight={500} color="#4e3ca9">
                  Curve
                </Text>
              </Flex>
              <CircleTooltip />
            </Flex>
            <ParamRect mt="15px" flexDirection="column">
              <Flex flexDirection="row" alignItems="center" mt="20px">
                <Flex mr="10px">
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color={colors.purple.dark}
                  >
                    liqudity_fee
                  </Text>
                </Flex>
                <CircleTooltip />
              </Flex>
              <Flex mt="10px">
                <ParameterInput
                  type="PERCENTAGE"
                  width="250px"
                  height="35px"
                  borderColor="#e7ecff"
                  unit="%"
                  value={kvs['curve:liqudity_fee']}
                  handleParameterChange={(val, type, unit) =>
                    handleParamsChange('curve:liqudity_fee', val, type, unit)
                  }
                />
              </Flex>
              <Flex flexDirection="row" alignItems="center" mt="20px">
                <Flex mr="10px">
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color={colors.purple.dark}
                  >
                    inflation_rate
                  </Text>
                </Flex>
                <CircleTooltip />
              </Flex>
              <Flex mt="10px">
                <ParameterInput
                  type="PERCENTAGE"
                  width="250px"
                  height="35px"
                  borderColor="#e7ecff"
                  unit="%"
                  value={kvs['curve:inflation_rate']}
                  handleParameterChange={(val, type, unit) =>
                    handleParamsChange('curve:inflation_rate', val, type, unit)
                  }
                />
              </Flex>
            </ParamRect>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
