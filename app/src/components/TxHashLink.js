import React from 'react'
import { AbsoluteLink, Image } from 'ui/common'
import OutIcon from 'images/out.svg'

export default ({ href, pl = '0px' }) => (
  <AbsoluteLink href={href} style={{ marginLeft: pl }}>
    <Image src={OutIcon} style={{ maxWidth: '14px' }} />
  </AbsoluteLink>
)
