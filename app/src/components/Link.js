import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { Link as AbsoluteLink } from 'rebass'

const StyledRouterLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
  position: relative;

  ${p =>
    p.hover &&
    `
    &:after {
      position: absolute;
      content: "";
      width: 20px;
      border-top: solid 1px ${p.hover};
      bottom: -0.25em;
      left: 0;
      width: 100%;
      transition: transform 200ms;
      transform: scaleX(0);
    }

    &:hover:after {
      transform scaleX(1)
    }
  `}
`

const StyledAbsoluteLink = styled(AbsoluteLink)`
  text-decoration: none;
  color: inherit;
  position: relative;

  ${p =>
    p.hover &&
    `
    &:after {
      position: absolute;
      content: "";
      width: 20px;
      border-top: solid 1px ${p.hover};
      bottom: -0.25em;
      left: 0;
      width: 100%;
      transition: transform 200ms;
      transform: scaleX(0);
    }

    &:hover:after {
      transform scaleX(1)
    }
  `}
`

export default ({ to, href, children, hover, ...props }) => {
  const Component = to ? StyledRouterLink : StyledAbsoluteLink
  return (
    <Component to={to} href={href} hover={hover} {...props}>
      {children}
    </Component>
  )
}
