import React from 'react'
import { AbsoluteLink, Image } from 'ui/common'
import OutImg from 'images/out.svg'

export default ({ href }) => (
  <AbsoluteLink href={href}>
    <Image src={OutImg} width="14px" height="14px" />
  </AbsoluteLink>
)
