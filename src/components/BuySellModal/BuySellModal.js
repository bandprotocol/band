import React from 'react'
import BuySellModalRender from 'components/BuySellModal/BuySellModalRender'

export default class BuySellModal extends React.Component {
  state = {
    amount: 0,
    priceLimit: 0,
    type: null,
    showAdvance: false,
  }

  getType() {
    if (this.state.type) {
      return this.state.type
    } else {
      return this.props.type
    }
  }

  setType(type) {
    this.setState({
      ...this.state,
      type: type,
    })
  }

  toggleAdvance() {
    this.setState({
      ...this.state,
      showAdvance: !this.state.showAdvance,
    })
  }

  handleChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    })
  }

  render() {
    const { name, logo } = this.props
    return (
      <BuySellModalRender
        name={name}
        logo={logo}
        type={this.getType()}
        handleChange={this.handleChange.bind(this)}
        setType={this.setType.bind(this)}
        showAdvance={this.state.showAdvance}
        toggleAdvance={this.toggleAdvance.bind(this)}
      />
    )
  }
}
