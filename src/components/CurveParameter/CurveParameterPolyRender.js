import React from 'react'
import styled from 'styled-components'
import Slider from 'components/Slider'
import { Flex, Text, Box } from 'rebass'

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
  values: { totalSupply, priceStart, priceEnd, reserveRatio },
  onChange,
}) => {
  const handletotalSupplyBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value) * 100)
  }
  const handletotalSupplyInput = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const clampTotalSupply = t => {
    if (t < 1) {
      return 1
    } else if (t > 10000) {
      return 10000
    }
    return t
  }

  const handlePriceEndBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value) * 100)
  }
  const handlePriceEndInput = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const clampPriceEnd = p => {
    if (p < 1) {
      return 1
    } else if (p > 10000) {
      return 10000
    }
    return p
  }

  const handleReserveRatioBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handleReserveRatioInput = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const clampReserveRatio = r => {
    if (r < 10) {
      return 10
    } else if (r > 100) {
      return 100
    }
    return r
  }
  return (
    <Flex flexDirection="column" alignItems="flex-start" p={3}>
      <Box width="100%">
        <Text fontSize={1} my={1}>
          Token Total Supply
        </Text>
        <Slider
          value={totalSupply / 100}
          name="totalSupply"
          min={1}
          max={100}
          onChange={handletotalSupplyBar}
        />
        <Input
          type="text"
          name="totalSupply"
          defaultValue={totalSupply}
          value={clampTotalSupply(totalSupply)}
          onChange={handletotalSupplyInput}
          style={{ width: '80%', lineHeight: '20px' }}
        />
      </Box>
      <Box my={1} width="100%">
        <Text fontSize={1} my={1}>
          Last Price
        </Text>
        <Slider
          value={priceEnd / 100}
          name="priceEnd"
          min={1}
          max={100}
          onChange={handlePriceEndBar}
        />
        <Input
          type="text"
          name="priceEnd"
          defaultValue={clampPriceEnd(priceEnd)}
          value={clampPriceEnd(priceEnd)}
          onChange={handlePriceEndInput}
          style={{ width: '80%', lineHeight: '20px' }}
        />
      </Box>
      <Box my={1} width="100%">
        <Text fontSize={1} my={1}>
          Reserve Ratio (10% - 100%)
        </Text>
        <Slider
          value={clampReserveRatio(reserveRatio)}
          name="reserveRatio"
          min={10}
          max={100}
          onChange={handleReserveRatioBar}
        />
        <Input
          type="text"
          name="reserveRatio"
          defaultValue={clampReserveRatio(reserveRatio)}
          value={clampReserveRatio(reserveRatio)}
          onChange={handleReserveRatioInput}
          style={{ width: '80%', lineHeight: '20px' }}
        />
      </Box>
    </Flex>
  )
}
