import React from 'react'

import ParameterInputRender from './ParameterInputRender'

import { convertToChain } from 'utils/helper'

export default class ParameterInput extends React.Component {
  state = {
    value: this.props.value,
    unit: this.props.unit,
  }

  changeUnit(unit) {
    this.setState({ unit })
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
    if (e.target.value === '') {
      this.props.handleParameterChange(null)
    } else {
      this.props.handleParameterChange(
        convertToChain(e.target.value, this.props.type, this.state.unit),
      )
    }
  }

  render() {
    return (
      <ParameterInputRender
        value={this.state.value || this.props.value}
        unit={this.state.unit}
        type={this.props.type}
        width={this.props.width}
        height={this.props.height}
        borderColor={this.props.borderColor}
        onChangeUnit={this.changeUnit.bind(this)}
        handleParameterChange={this.handleChange.bind(this)}
      />
    )
  }
}
