import React from 'react'
import BuySellModalRender from 'components/BuySellModal/BuySellModalRender'
import BN from 'utils/bignumber'

export default class BuySellModal extends React.Component {
  state = {
    amount: new BN('0'),
    price: new BN('0'),
    priceLimit: null,
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

  async updatePrice(amount) {
    // TODO: if sellAmount is excced total supply
    // balance is not enough
    // limit input amount
    const price =
      this.getType() === 'BUY'
        ? await this.props.communityClient.getBuyPrice(amount)
        : await this.props.communityClient.getSellPrice(amount)
    this.setState({
      ...this.state,
      amount: amount,
      price: price,
    })
  }

  async handleChange(what, e) {
    if (what === 'amount') {
      const amount =
        e.target.value === '' ? new BN('0') : BN.parse(e.target.value)
      this.updatePrice(amount)
    }
  }

  render() {
    const { name, logo } = this.props
    return (
      <BuySellModalRender
        name={name}
        logo={logo}
        type={this.getType()}
        price={this.state.price}
        amount={this.state.amount}
        handleChange={this.handleChange.bind(this)}
        setType={this.setType.bind(this)}
        showAdvance={this.state.showAdvance}
        toggleAdvance={this.toggleAdvance.bind(this)}
      />
    )
  }
}
