import styled from 'styled-components'
import { Flex } from 'rebass'

export default styled(Flex)`
  ${p => p.boxShadow && `box-shadow: ${p.boxShadow};`}
  ${p => p.bgImg && `background-image: ${p.bgImg};`}
  transition: all 200ms;
  &:hover {
    ${p => p.boxShadowHover && `box-shadow: ${p.boxShadowHover};`}
    ${p => p.bgImgHover && `background-image: ${p.bgImgHover};`}
  }
`
