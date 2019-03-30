import React from 'react'
import ParameterInputRender from './ParameterInputRender'

import { convertToChain } from 'utils/helper'

export default class ParameterInput extends React.Component {
  state = {
    value: this.props.value,
    unit: this.props.unit,
  }

  changeUnit(unit) {
    this.setState({ unit }, () => {
      this.setNewParameter(this.state.value)
    })
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
    this.setNewParameter(e.target.value)
  }

  setNewParameter(value) {
    if (value === '') {
      this.props.handleParameterChange(null)
    } else {
      this.props.handleParameterChange(
        convertToChain(value, this.props.type, this.state.unit),
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
