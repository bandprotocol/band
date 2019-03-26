import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, AbsoluteLink } from 'ui/common'
import ParameterInput from 'components/ParameterInput'
import colors from 'ui/colors'

const A = styled.a`
  color: #8868ff;
  font-weight: 500;
  text-decoration: underline;
`

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${p => p.bg || '#8868ff'};
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

export default ({ setKeyValue }) => (
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
                <Text fontSize="14px" fontWeight={500} color="#4e3ca9">
                  expiration_time
                </Text>
              </Flex>
              <CircleTooltip />
            </Flex>
            <Flex mt="10px" alignItems="center">
              <ParameterInput
                type="TIME"
                width="250px"
                height="35px"
                borderColor="#e7ecff"
                handleParameterChange={val =>
                  setKeyValue('params:expiration_time', val.toString())
                }
              />
            </Flex>
            <Flex flexDirection="row" alignItems="center" mt="20px">
              <Flex mr="10px">
                <Text fontSize="14px" fontWeight={500} color="#4e3ca9">
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
                handleParameterChange={val =>
                  setKeyValue('params:min_participation_pct', val.toString())
                }
              />
            </Flex>
            <Flex flexDirection="row" alignItems="center" mt="20px">
              <Flex mr="10px">
                <Text fontSize="14px" fontWeight={500} color="#4e3ca9">
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
                handleParameterChange={val =>
                  setKeyValue('params:support_required_pct', val.toString())
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
                <Text fontSize="14px" fontWeight={500} color="#4e3ca9">
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
                handleParameterChange={val =>
                  setKeyValue('curve:liqudity_fee', val.toString())
                }
              />
            </Flex>
            <Flex flexDirection="row" alignItems="center" mt="20px">
              <Flex mr="10px">
                <Text fontSize="14px" fontWeight={500} color="#4e3ca9">
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
                handleParameterChange={val =>
                  setKeyValue('curve:inflation_rate', val.toString())
                }
              />
            </Flex>
          </ParamRect>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)
