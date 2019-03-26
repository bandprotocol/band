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
  values: { totalSupply, slope, priceEnd, reserveRatio, b },
  onChange,
}) => {
  const handleFormChange = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

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

  const handleSlopeBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handleSlopeInput = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const clampSlope = s => {
    if (s < 0.01) {
      return 0.01
    } else if (s > 10) {
      return 10
    }
    return s
  }

  const handlePriceEndBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value) * 10)
  }
  const handlePriceEndInput = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const clampPriceEnd = p => {
    if (p < 1) {
      return 1
    } else if (p > 1000) {
      return 1000
    }
    return p
  }

  const handleBBar = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }
  const handleBInput = e => {
    const { name, value } = e.target
    onChange(name, parseFloat(value))
  }

  const clampB = _b => {
    if (_b < 0.01) {
      return 0.01
    } else if (_b > 10) {
      return 10
    }
    return _b
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
          defaultValue={clampTotalSupply(totalSupply)}
          value={clampTotalSupply(totalSupply)}
          onChange={handletotalSupplyInput}
          style={{ width: '80%', lineHeight: '20px' }}
        />
      </Box>
      <Box my={2} width="100%">
        <Text fontSize={1} my={2}>
          a
        </Text>
        <Slider
          value={(clampSlope(slope) * 100) / (10 - 0.01)}
          name="slope"
          min={0.01}
          max={10}
          onChange={handleSlopeBar}
        />
        <Input
          type="text"
          name="slope"
          defaultValue={clampSlope(slope)}
          value={clampSlope(slope)}
          onChange={handleSlopeInput}
          style={{ width: '80%', lineHeight: '20px' }}
        />
      </Box>
      <Box my={2} width="100%">
        <Text fontSize={1} my={2}>
          b
        </Text>
        <Slider
          value={(clampB(b) * 100) / (10 - 0.01)}
          name="b"
          min={0.01}
          max={10}
          onChange={handleBBar}
        />
        <Input
          type="text"
          name="b"
          value={clampB(b)}
          defaultValue={clampB(b)}
          onChange={handleBInput}
          style={{ width: '80%', lineHeight: '20px' }}
        />
      </Box>
      <Box my={2} width="100%">
        <Text fontSize={1} my={2}>
          Last Price
        </Text>
        <Slider
          value={priceEnd / 10}
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
    </Flex>
  )
}
