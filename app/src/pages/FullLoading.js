import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const FullPage = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  height: 100vh;
  width: 100vw;
  background: #f0f2f9;
`

export default ({ style }) => (
  <FullPage style={style}>
    <CircleLoadingSpinner radius="80px" />
  </FullPage>
)
