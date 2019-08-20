import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button } from 'ui/common'
import ArrowRight from 'components/ArrowRight'

const FilledButton = styled(Button)`
  font-family: bio-sans;
  color: ${p => p.color || 'white'};
  padding: 13px 34px;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  height: 46px;
  border-radius: 2px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.15);
  background-image: ${p => p.bg};
  cursor: pointer;
  font-family: bio-sans;

  transition: all 0.2s;

  &:hover {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }
`

export default ({
  message = 'Fill the message',
  arrow,
  width,
  bg = 'linear-gradient(to bottom, #2a3a7f, #131b48)',
  fontSize,
}) => (
  <FilledButton width={width} bg={bg}>
    <Flex justifyContent="space-between" alignItems="center" width="100%">
      <Text fontSize={fontSize || '16px'}>{message}</Text>
      {arrow && <ArrowRight color="white" />}
    </Flex>
  </FilledButton>
)
