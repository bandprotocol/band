import React from 'react'
import styled from 'styled-components'
import Slider from 'components/Slider'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'

const Label = styled(Text).attrs({
  fontWeight: '500',
  fontSize: '14px',
  mt: '16px',
  mx: '10px',
  color: colors.normal,
})``

const Input = styled.input`
  width: 270px;
  line-height: 20px;
  border: 1px solid #e7ecff;
  border-radius: 3px;
  padding: 5px 20px;

  :placeholder {
    color: #cbcfe3;
    font-size: 12px;
  }
`

export default ({
  values: {
    slope,
    priceEnd,
    turningPoint,
    minSlope,
    maxSlope,
    minTurningPoint,
    maxTurningPoint,
    minPriceEnd,
    maxPriceEnd,
  },
  onChange,
}) => {
  const handleSlopeBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handleSlopeInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newRatio = parseFloat(value)
      onChange(name, clampSlope(newRatio))
    }
  }

  const clampSlope = s => {
    if (s < minSlope) {
      return minSlope
    } else if (s > maxSlope) {
      return maxSlope
    }
    return s
  }

  const handlePriceEndBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handlePriceEndInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newRatio = parseFloat(value)
      onChange(name, clampPriceEnd(newRatio))
    }
  }

  const clampPriceEnd = p => {
    if (p < minPriceEnd) {
      return minPriceEnd
    } else if (p > maxPriceEnd) {
      return maxPriceEnd
    }
    return p
  }

  const handleTurningPointBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handleTurningPointInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newRatio = parseFloat(value)
      onChange(name, clampTP(newRatio))
    }
  }

  const clampTP = _b => {
    if (_b < minTurningPoint) {
      return minTurningPoint
    } else if (_b > maxTurningPoint) {
      return maxTurningPoint
    }
    return _b
  }
  return (
    <Flex flexDirection="column" alignItems="flex-start" p={3}>
      {/* Rate of increase */}
      <Flex
        my={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="100%" justifyContent="flex-start">
          <Label>Rate of increase(x10^(-4))</Label>
        </Flex>
        <Slider
          value={(clampSlope(slope) * 100) / (maxSlope - minSlope)}
          name="slope"
          min={minSlope}
          max={maxSlope}
          onChange={handleSlopeBar}
        />
        <Input
          type="text"
          name="slope"
          defaultValue={clampSlope(slope)}
          value={clampSlope(slope)}
          onChange={handleSlopeInput}
        />
      </Flex>
      {/* Turning Point */}
      <Flex
        my={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="100%" justifyContent="flex-start">
          <Label>Turning point supply</Label>
        </Flex>
        <Slider
          value={
            (clampTP(turningPoint) * 100) / (maxTurningPoint - minTurningPoint)
          }
          name="turningPoint"
          min={minTurningPoint}
          max={maxTurningPoint}
          onChange={handleTurningPointBar}
        />
        <Input
          type="text"
          name="turningPoint"
          value={clampTP(turningPoint)}
          defaultValue={clampTP(turningPoint)}
          onChange={handleTurningPointInput}
        />
      </Flex>
      {/* Maximum Price */}
      <Flex
        my={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="100%" justifyContent="flex-start">
          <Label> Maximum Price</Label>
        </Flex>
        <Slider
          value={(clampPriceEnd(priceEnd) * 100) / (maxPriceEnd - minPriceEnd)}
          name="priceEnd"
          min={minPriceEnd}
          max={maxPriceEnd}
          onChange={handlePriceEndBar}
        />
        <Input
          type="text"
          name="priceEnd"
          defaultValue={clampPriceEnd(priceEnd)}
          value={clampPriceEnd(priceEnd)}
          onChange={handlePriceEndInput}
        />
      </Flex>
    </Flex>
  )
}
