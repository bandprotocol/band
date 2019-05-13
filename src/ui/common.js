import React from 'react'
import styled from 'styled-components/macro'
import colors from './colors'
import {
  Text as BaseText,
  Image as BaseImage,
  Flex as BaseFlex,
  Box as BaseBox,
  Button as BaseButton,
  Card as BaseCard,
} from 'rebass'
import { Link as RouterLink } from 'react-router-dom'

export const Text = styled(BaseText)``
export const Flex = styled(BaseFlex)``
export const Box = styled(BaseBox)``
export const Button = styled(BaseButton)`
  font-family: Avenir-Medium;
  border-radius: 2px;
`
export const Card = styled(BaseCard)``

export const Bold = styled(Text).attrs({
  fontWeight: 700,
})`
  display: inline-block;
`

export const SemiBold = styled(Text).attrs({
  fontWeight: 500,
})`
  &:hover {
    color: #bfcdff;
  }
  display: inline-block;
`

export const Highlight = styled.span`
  color: ${colors.purple.normal};
  ${p => p.large && 'font-size: 1.15em;'}
  ${p => p.bold && 'font-weight: bold;'}
  ${p => p.underline && 'text-decoration: underline;'}
`

export const H1 = styled(Text).attrs({
  fontSize: [20, 30],
})`
  line-height: 1.6em;
  font-weight: ${p => (p.slim ? 700 : 900)};
  letter-spacing: 0.03em;
  color: ${p => (p.dark ? colors.blue.dark : 'unset')};
  text-transform: ${p => (p.uppercase ? 'uppercase' : 'none')};
`

export const H2 = styled(H1).attrs({
  fontSize: 24,
})`
  letter-spacing: 0.02em;
  font-weight: 700;
`

export const H3 = styled(H2).attrs({
  fontSize: 18,
})`
  letter-spacing: 0.01em;
`

export const H4 = styled(H3).attrs({
  fontSize: 15,
})`
  letter-spacing: 0;
`

export const Image = styled(BaseImage)`
  display: ${p => (p.block ? 'block' : 'inline-block')};
`

export const Link = styled(RouterLink)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: ${p => (p.dark ? colors.blue.dark : p.color ? p.color : 'white')};
  transition: color 250ms;

  &:hover {
    color: ${p =>
      p.dark ? colors.blue.normal : p.hoverColor ? p.hoverColor : '#bfcdff'};
  }
`

export const AbsoluteLink = styled.a.attrs({
  href: props => props.to || props.href,
  target: props => props.target || '_blank',
  rel: 'noopener',
})`
  text-decoration: none;
  color: ${p => (p.dark ? colors.blue.dark : p.color ? p.color : 'white')};
  transition: color 250ms;

  &:hover {
    color: ${p => (p.dark && colors.blue.normal) || p.hoverColor || '#bfcdff'};
  }
`

export const BackgroundCard = styled(Card)`
  background-image: url(${p => p.bgImage});
  background-size: ${p => p.bgSize || 'contain'};
  background-position: center;
  background-repeat: no-repeat;
`
