import React from 'react'
import { AbsoluteLink, Image } from 'ui/common'
import styled from 'styled-components'
import OutIcon from 'images/out.svg'
import OutHoverIcon from 'images/out-hover.svg'

const OutImg = styled(Image).attrs({
  width: '14px',
  height: '14px',
})`
  background: url(${OutIcon}) no-repeat;
  max-width: 14px;

  &:hover {
    background: url(${OutHoverIcon}) no-repeat;
  }
`

export default ({ href }) => (
  <AbsoluteLink href={href}>
    <Image src={OutIcon} style={{ maxWidth: '14px' }} />
    {/* <OutImg /> */}
  </AbsoluteLink>
)
