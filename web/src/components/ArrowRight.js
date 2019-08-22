import React from 'react'

export default ({ color = '#000', reverse }) => (
  <span style={{ transform: reverse ? 'rotate(180deg)' : '' }}>
    <svg
      height="12"
      viewBox="0 0 19 12"
      width="19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11.69.23a.816.816 0 0 0 -.007 1.15l3.801 3.806h-14.467a.81.81 0 0 0 -.807.812c0 .45.363.813.807.813h14.461l-3.801 3.806a.822.822 0 0 0 .006 1.15.81.81 0 0 0 1.144-.007l5.152-5.187a.912.912 0 0 0 .169-.256.814.814 0 0 0 -.169-.881l-5.152-5.187a.797.797 0 0 0 -1.138-.02z"
        fill={color}
      />
    </svg>
  </span>
)