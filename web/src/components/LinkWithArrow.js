import React from 'react'
import { Flex, Text, Image, Box } from 'ui/common'
import ArrowRight from 'components/ArrowRight'
import { Link } from 'react-router-dom'

export default ({
  text,
  textColor = '#323232',
  ml = '0px',
  padding = '16px',
  href,
  to = '',
}) => {
  const Child = () => (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      ml={ml}
      style={{ height: '35px' }}
    >
      <Text
        fontWeight="bold"
        color={textColor}
        style={{ fontFamily: 'bio-sans', whiteSpace: 'nowrap' }}
      >
        {text}
      </Text>
      <Box ml={padding}>
        <ArrowRight color={textColor} />
      </Box>
    </Flex>
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
