import React, { useState, useEffect } from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'
import { isMobile } from 'ui/media'
import { clear } from 'sisteransi'

const MoveCircle = styled(Flex)`
  width: ${p => p.r || '100px'};
  height: ${p => p.r || '100px'};
  background: white;
  position: absolute;
  border-radius: 50%;
  top: ${p => p.top || '0px'};
  left: ${p => p.left || '0px'};
  animation: move1 3s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
  box-shadow: 0 -5px 20px white, 0 -3px 10px 0 white, 0 -2px 5px 0 white,
    0 0px 5px 0 white, 0 0px 20px 0 white, 0 0px 10px 0 white;

  @keyframes move1 {
    0% {
      transform: translate(0px, 0px);
      opacity: 1;
    }
    100% {
      transform: translate(0px, 500px);
      opacity: 0;
    }
  }
`

export default () => {
  const _isMobile = isMobile()

  const createSnows = () => {
    return {
      begin: Date.now(),
      r:
        Math.floor(Math.random() * (_isMobile ? 5 : 7)) +
        (_isMobile ? 1 : 3) +
        'px',
      top: Math.floor(Math.random() * -100) - 1 + 'px',
      left: Math.floor(Math.random() * window.innerWidth) + 'px',
    }
  }
  const [snows, setSnows] = useState([createSnows()])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (snows.length >= 75) return
      if (Math.random() > 0.5) {
        setSnows([...snows, createSnows()])
      }
    }, 100)

    return () => clearInterval(intervalId)
  })

  return (
    <Flex style={{ position: 'absolute' }}>
      {snows.map(({ r, top, left }) => {
        return <MoveCircle r={r} top={top} left={left} />
      })}
    </Flex>
  )
}
