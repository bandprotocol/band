import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Card, Box, Text, Image } from 'ui/common'

const Container = styled(Card).attrs(() => ({
  borderRadius: 10,
}))`
  width: 225px;
  height: 100px;
  background: #31314c;
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${colors.shadow.dark};
  transition: transform 250ms, box-shadow 250ms;
  filter: grayscale(100%) sepia(1) hue-rotate(200deg) brightness(0.5);
  transform: perspective(0) rotateX(0);
  transform-origin: bottom;

  &:hover {
    box-shadow: ${colors.shadow.darkLarge};
    filter: grayscale(0%);
    transform: perspective(100em) rotateX(9deg) scale(1.04) translateY(-3%);
  }

  ${p =>
    p.active &&
    `
    filter: grayscale(0%);
  `}
`

export default ({ title, subtitle, src, ...props }) => (
  <Container {...props}>
    <Image src={src} />
    <Box style={{ position: 'absolute', top: 0, left: 0 }}>
      <Text ml={3} mt="10px" color="white" fontWeight="600" fontSize={16}>
        {title}
      </Text>
      <Text
        ml={3}
        color="#66F7B0"
        fontWeight="500"
        fontSize={12}
        style={{ position: 'absolute', whiteSpace: 'nowrap' }}
      >
        {subtitle}
      </Text>
    </Box>
  </Container>
)
