import React from 'react'
import ParameterInputRender from './ParameterInputRender'

export default class ParameterInput extends React.Component {
  state = {
    value: this.props.value,
    unit: this.props.unit,
  }

  changeUnit(unit) {
    this.setState({ unit })
    if (this.state.value === '') {
      this.props.handleParameterChange(0, this.props.type, unit)
    } else {
      this.props.handleParameterChange(this.state.value, this.props.type, unit)
    }
  }

  handleChange(e) {
    if (parseFloat(e.target.value) > 0 && e.target.value !== '') {
      this.setState({ value: e.target.value }, () => {
        this.props.handleParameterChange(
          this.state.value,
          this.props.type,
          this.state.unit,
        )
      })
    }
  }

  // updateParam() {
  //   if (e.target.value === '') {
  //     this.props.handleParameterChange(0, this.props.type, this.state.unit)
  //   } else {
  //     if (e.target.value > parseFloat(e.target.value)) {
  //       this.props.handleParameterChange(
  //         e.target.value,
  //         this.props.type,
  //         this.state.unit,
  //       )
  //     }
  //   }
  // }

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
