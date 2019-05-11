import React from 'react'
import styled from 'styled-components'

const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  width: ${p => p.size};
  height: ${p => p.size};

  & .path {
    stroke: #718bff;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`

export default ({ radius }) => (
  <StyledSpinner viewBox="0 0 50 50" size={radius}>
    <circle
      className="path"
      cx="25"
      cy="25"
      r="16px"
      fill="none"
      strokeWidth="4"
    />
  </StyledSpinner>
)
