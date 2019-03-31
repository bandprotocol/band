import React from 'react'
import { Flex, Text, Box } from 'rebass'
import Slider from 'components/Slider'
import colors from 'ui/colors'
import styled from 'styled-components'
// import SliderLog from 'components/SliderLogScale'

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
    priceStart,
    slope,
    reserveRatio,
    minSlope,
    maxSlope,
    minPriceStart,
    maxPriceStart,
    minReserveRatio,
    maxReserveRatio,
  },
  onChange,
}) => {
  const handlePriceStartBar = e => {
    const { name, value } = e.target
    const newPrice =
      (parseFloat(value) * (maxPriceStart - minPriceStart)) / 100 +
      minPriceStart
    onChange(name, clampedPrice(newPrice))
  }

  const handlePriceStartInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newPrice =
        (parseFloat(value) * (maxPriceStart - minPriceStart)) / 100 +
        minPriceStart
      onChange(name, clampedPrice(newPrice))
    }
  }

  const handleSlopeBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const handleSlopeInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newSlope = parseFloat(value)
      onChange(name, clampedSlope(newSlope))
    }
  }

  const handleReserveBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const handleReserveInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newRatio = parseFloat(value)
      onChange(name, clampedReserveRatio(newRatio))
    }
  }

  const clampedPrice = price => {
    if (price > maxPriceStart) {
      return maxPriceStart
    }
    if (price < minPriceStart) {
      return minPriceStart
    }
    return price
  }

  const clampedSlope = s => {
    if (s > maxSlope) {
      return maxSlope
    }
    if (s < minSlope) {
      return minSlope
    }
    return s
  }

  const clampedReserveRatio = s => {
    if (s > maxReserveRatio) {
      return maxReserveRatio
    }
    if (s < minReserveRatio) {
      return minReserveRatio
    }
    return s
  }

  return (
    <Flex flexDirection="column" alignItems="flex-start" p={3}>
      {/* Initial Price */}
      <Flex
        my={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="100%" justifyContent="flex-start">
          <Label>Initial Price</Label>
        </Flex>
        <Slider
          value={clampedPrice(priceStart)}
          name="priceStart"
          min={minPriceStart}
          max={maxPriceStart}
          onChange={handlePriceStartBar}
        />
        <Input
          type="text"
          name="priceStart"
          defaultValue={priceStart}
          value={clampedPrice(priceStart)}
          onChange={handlePriceStartInput}
        />
      </Flex>
      {/* Rate of increase */}
      <Flex
        my={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="100%" justifyContent="flex-start">
          <Label>Rate of increase(10^(-24))</Label>
        </Flex>
        <Slider
          value={(clampedSlope(slope) * 100) / (maxSlope - minSlope)}
          name="slope"
          min={minSlope}
          max={maxSlope}
          onChange={handleSlopeBar}
        />
        <Input
          type="text"
          name="slope"
          defaultValue={slope}
          value={clampedSlope(slope)}
          onChange={handleSlopeInput}
        />
      </Flex>
      {/* Reserve Ratio */}
      <Flex
        my={1}
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="100%" justifyContent="flex-start">
          <Label>Reserve Ratio</Label>
        </Flex>
        <Slider
          value={
            ((reserveRatio - minReserveRatio) * 100) /
            (maxReserveRatio - minReserveRatio)
          }
          name="reserveRatio"
          min={minReserveRatio}
          max={maxReserveRatio}
          onChange={handleReserveBar}
        />
        <Input
          type="text"
          name="reserveRatio"
          defaultValue={reserveRatio}
          value={clampedReserveRatio(reserveRatio)}
          onChange={handleReserveInput}
        />
      </Flex>
    </Flex>
  )
}
