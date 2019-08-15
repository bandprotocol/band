import React from 'react'
import ContentLoader from 'react-content-loader'

export default ({ width, height, rects = [] }) => (
  <ContentLoader
    height={height}
    width={width}
    speed={1}
    primaryColor="#e5e6f2"
    secondaryColor="#d1d0ff"
  >
    {rects.map(([x, y, w, h, r = 5], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} rx={r} ry={r} />
    ))}
  </ContentLoader>
)
