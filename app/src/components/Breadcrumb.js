import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Link, Image } from 'ui/common'

import Chevron from 'images/chevron.svg'

const BreadcrumbLink = styled(Link)`
  ${p =>
    p.active
      ? `
      font-weight: 900;
      color: #5269ff;
    `
      : `
      color: #555555;
    `}
`

export default ({ links = [] }) => (
  <Flex mt="12px" mb="28px">
    <BreadcrumbLink to="/">
      <Text fontSize="14px">Governance Portal</Text>
    </BreadcrumbLink>
    {links.map(({ path, label }, i) => (
      <React.Fragment key={path}>
        <Image mx={3} src={Chevron} width="6px" />
        <BreadcrumbLink to={path} active={i === links.length - 1}>
          <Text fontSize="14px">{label}</Text>
        </BreadcrumbLink>
      </React.Fragment>
    ))}
  </Flex>
)
