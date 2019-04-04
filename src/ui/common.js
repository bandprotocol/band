import styled from 'styled-components'
import colors from './colors'
import { Text, Image as BaseImage, Flex, Box, Button, Card } from 'rebass'
import { Link as RouterLink, NavLink } from 'react-router-dom'

export const Bold = styled(Text)`
  display: inline-block;
  font-weight: 600;
`

export const SemiBold = styled(Text)`
  display: inline-block;
  font-weight: 500;
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
  font-weight: ${p => (p.slim ? 600 : 900)};
  letter-spacing: 0.03em;
  color: ${p =>
    p.color || (p.dark ? colors.purple.dark : colors.purple.normal)};
  text-transform: ${p => (p.uppercase ? 'uppercase' : 'none')};
`

export const H2 = styled(H1).attrs({
  fontSize: 24,
})`
  letter-spacing: 0.02em;
  font-weight: 600;
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
  text-decoration: ${p => (p.underline ? 'underline' : 'none')} !important;
  color: ${p => (p.dark ? colors.purple.dark : colors.purple.normal)};
  transition: color 250ms;
  padding-left: ${p => p.px};
  padding-right: ${p => p.px};

  &:hover {
    color: ${p => (p.dark ? colors.purple.normal : colors.purple.dark)};
  }
`

export const AbsoluteLink = styled.a.attrs(props => ({
  href: props.to || props.href,
  target: '_blank',
  rel: 'noopener',
}))`
  text-decoration: underline;
  color: ${p => (p.dark ? colors.purple.dark : colors.purple.normal)};
  transition: color 250ms;

  &:hover {
    color: ${p => (p.dark ? colors.purple.normal : colors.purple.dark)};
  }
`

export const BackgroundCard = styled(Card)`
  background-image: url(${p => p.bgImage});
  background-size: ${p => p.bgSize || 'contain'};
  background-position: center;
  background-repeat: no-repeat;
`

export const HighlightNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  &.is-active {
    font-weight: 700;
    color: ${colors.purple.normal};
    & > * {
      background: white;
      color: #4e3ca9;
    }

    & .img-active {
      display: block;
    }

    & .img-inactive {
      display: none;
    }
  }

  & .img-active {
    display: none;
  }

  & .img-inactive {
    display: block;
  }

  &:hover {
    :not(.is-active) {
      & > * {
        background: #3f3f4c;
        color: #ffffff;
      }
    }
  }
`

export { Text, Flex, Box, Button, Card }
