import React from 'react'
import styled from 'styled-components'

// TODO: Now I cannot config style on react-select
// import Select from 'react-select'

import { Text, Flex, Box } from 'ui/common'

const InputFlex = styled(Flex).attrs({ alignItems: 'center' })`
  width: ${p => p.width || '120px'};
  height: ${p => p.height || '25px'};
  border-radius: 4px;
  border: solid 1px ${p => p.borderColor || '#8868ff'};
  background-color: #ffffff;
`

const ModernInput = styled.input`
  border: 0px;
  width: 100%;
`

const UnitSelector = styled.select`
  height: 10px;
  fontsize: 14px;
  border: 0px;
  background-color: #fff;
  outline: 0;
`

const timeOptions = [
  { value: 'days', label: 'days' },
  { value: 'hours', label: 'hours' },
  { value: 'minutes', label: 'minutes' },
]

export default ({
  value,
  unit,
  type,
  onChangeUnit,
  handleParameterChange,
  width,
  height,
  borderColor,
}) => (
  <InputFlex px={1} width={width} height={height} borderColor={borderColor}>
    <Box flex={1}>
      <ModernInput
        type="number"
        placeholder={value}
        onChange={handleParameterChange}
      />
    </Box>
    {type === 'TIME' ? (
      <UnitSelector
        onChange={e => onChangeUnit(e.target.value)}
        defaultValue="minutes"
      >
        {timeOptions.map(u => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </UnitSelector>
    ) : (
      <Text fontSize={0} ml="auto">
        {unit}
      </Text>
    )}
  </InputFlex>
)
