import React from 'react'
import MathJax from 'react-mathjax'
import Curve from 'curves'

export default ({ type, params }) => {
  const tempCurve = new Curve[type](params)

  return (
    <MathJax.Provider>
      <MathJax.Node formula={tempCurve.equation} />
    </MathJax.Provider>
  )
}
