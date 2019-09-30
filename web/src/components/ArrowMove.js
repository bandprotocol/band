import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 32px;
  transform: scaleX(2);

  .arrowSliding {
    position: absolute;
    animation: slide 1600ms linear infinite;
  }

  .delay1 {
    animation-delay: -1200ms;
  }
  .delay2 {
    animation-delay: -800ms;
  }
  .delay3 {
    animation-delay: -400ms;
  }

  @keyframes slide {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    20% {
      opacity: 0.5;
      transform: translateY(-18px);
    }
    50% {
      opacity: 1;
      transform: translateY(0px);
    }
    80% {
      opacity: 0.5;
      transform: translateY(18px);
    }
    100% {
      opacity: 0;
      transform: translateY(30px);
    }
  }
`

export default () => {
  return (
    <Wrapper>
      <div class="arrowSliding">
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <div class="arrowSliding delay1">
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <div class="arrowSliding delay2">
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <div class="arrowSliding delay3">
        <FontAwesomeIcon icon={faChevronDown} />
        <div class="arrow"></div>
      </div>
    </Wrapper>
  )
}
