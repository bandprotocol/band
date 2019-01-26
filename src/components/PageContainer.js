import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'

const PageContainer = styled(Box)`
  margin: 0 auto;
  flex: 1;
  width: 100%;

  ${p =>
    !p.fullWidth &&
    `
    padding: 0 18px;
    max-width: 1164px;
  `};
`

export default PageContainer
