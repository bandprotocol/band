import React from 'react'
import { Flex, Text } from 'rebass'
import Slider from 'components/Slider'
import colors from 'ui/colors'
import styled from 'styled-components'

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
    minSlope,
    maxSlope,
    minPriceStart,
    maxPriceStart,
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

  const handleSlopBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handleSlopInput = e => {
    const { name, value } = e.target
    if (Number(value) === parseFloat(value)) {
      const newSlop = parseFloat(value)
      onChange(name, clampedSlop(newSlop))
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

  const clampedSlop = s => {
    if (s > maxSlope) {
      return maxSlope
    }
    if (s < minSlope) {
      return minSlope
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
          <Label>Rate of increase</Label>
        </Flex>
        <Slider
          value={(clampedSlop(slope) * 100) / (maxSlope - minSlope)}
          name="slope"
          min={minSlope}
          max={maxSlope}
          onChange={handleSlopBar}
        />
        <Input
          type="text"
          name="slope"
          defaultValue={slope}
          value={clampedSlop(slope)}
          onChange={handleSlopInput}
        />
      </Flex>
    </Flex>
  )
}
