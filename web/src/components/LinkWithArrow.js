import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, Box } from 'ui/common'
import ArrowRight from 'components/ArrowRight'
import { Link } from 'react-router-dom'

const Container = styled(Flex).attrs({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})`
  font-size: 18px;
  line-height: 2em;

  .arrow {
    transition: all 350ms;
  }

  &:hover .arrow {
    transform: translateX(50%);
  }
`

export default ({
  text,
  textColor = '#323232',
  ml = '0px',
  padding = '16px',
  href,
  to = '',
  style,
}) => {
  const Child = () => (
    <Container ml={ml} style={style}>
      <Text
        fontWeight="bold"
        fontSize={['14px', '18px']}
        color={textColor}
        style={{ fontFamily: 'bio-sans', whiteSpace: 'nowrap', ...style }}
      >
        {text}
      </Text>
      <Box className="arrow" ml={padding}>
        <ArrowRight color={textColor} />
      </Box>
    </Container>
  )
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Child />
    </a>
  ) : (
    <Link to={to}>
      <Child />
    </Link>
  )
}
