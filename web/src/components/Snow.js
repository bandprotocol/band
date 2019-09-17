import React, { useState } from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'

const MoveCircle = styled(Flex)`
  width: ${p => p.r || '100px'};
  height: ${p => p.r || '100px'};
  background: white;
  position: absolute;
  border-radius: 50%;
  animation: ${p => (p.begin === 'left' ? 'move1' : 'move2')} 1s;
  animation-iteration-count: infinite;
  box-shadow: 0 3px 20px 0 white;
  @keyframes move1 {
    0% {
      transform: translate(0px, 0px);
    }
    50% {
      transform: translate(${p => p.w || '100%'}, 0px);
    }
    100% {
      transform: translate(0%, 0px);
    }
  }
  @keyframes move2 {
    0% {
      transform: translate(${p => p.w || '100%'}, 0px);
    }
    50% {
      transform: translate(0px, 0px);
    }
    100% {
      transform: translate(${p => p.w || '100%'}, 0px);
    }
  }
`

export default () => {
  const [snows, setSnows] = useState([0, 0, 0, 0])
  return (
    <Flex style={{ position: 'absolute' }}>
      {snows.map(w => {
        return (
          <Flex
            bg="white"
            style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              position: 'absolute',
              top: '30px',
              left: Math.floor(Math.random() * window.innerWidth),
            }}
          ></Flex>
        )
      })}
    </Flex>
  )
}
