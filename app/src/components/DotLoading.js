import React from 'react'
import styled, { keyframes } from 'styled-components'

const FirstAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`

const SecondAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(10px, 0);
  }
`

const LastAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`

const Dot = styled.div`
  position: absolute;
  width: ${p => p.size || '11px'};
  height: ${p => p.size || '11px'};
  border-radius: 50%;
  background: ${p => p.color};
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
`

const StyledSpinner = styled.div`
  position: relative;
  margin-bottom: 5px;
  & .child1 {
    left: 12px;
    animation: ${FirstAnimation} 0.6s infinite;
  }

  & .child2 {
    left: 12px;
    animation: ${SecondAnimation} 0.6s infinite;
  }

  & .child3 {
    left: 22px;
    animation: ${SecondAnimation} 0.6s infinite;
  }

  & .child4 {
    left: 32px;
    animation: ${LastAnimation} 0.6s infinite;
  }
`

export default ({ color, size, m }) => (
  <StyledSpinner m={m}>
    <Dot className="child1" color={color} size={size} />
    <Dot className="child2" color={color} size={size} />
    <Dot className="child3" color={color} size={size} />
    <Dot className="child4" color={color} size={size} />
  </StyledSpinner>
)
