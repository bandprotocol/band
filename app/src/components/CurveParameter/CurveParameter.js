import React from 'react'
import CurveParameterLinearRender from './CurveParameterLinearRender'
import CurveParameterPolyRender from './CurveParameterPolyRender'
import CurveParameterSigmoidRender from './CurveParameterSigmoidRender'

export default class Parameter extends React.Component {
  render() {
    const { type, values, onChange } = this.props
    if (type === 'linear') {
      return <CurveParameterLinearRender values={values} onChange={onChange} />
    } else if (type === 'poly') {
      return <CurveParameterPolyRender values={values} onChange={onChange} />
    } else if (type === 'sigmoid') {
      return <CurveParameterSigmoidRender values={values} onChange={onChange} />
    }
  }
}
