import React from 'react'
import BuySellModalRender from 'components/BuySellModal/BuySellModalRender'
import BN from 'utils/bignumber'

export default class BuySellModal extends React.Component {
  state = {
    amount: new BN('0'),
    price: new BN('0'),
    priceLimit: null,
    type: 'BUY',
    showAdvance: false,
  }

  componentDidMount() {
    this.setState({ type: this.props.type })
  }

  async setType(type) {
    this.updatePrice(type, this.state.amount)
    this.setState({
      type,
    })
  }

  toggleAdvance() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    })
  }

  onButtonClick() {
    const { type, amount, priceLimit, price } = this.state
    const { onBuy, onSell } = this.props
    if (!amount.isZero()) {
      if (type === 'BUY') {
        onBuy(amount, priceLimit || price)
      } else {
        onSell(amount, priceLimit || price)
      }
    }
  }

  async updatePrice(type, amount) {
    // TODO: if sellAmount is excced total supply
    // balance is not enough
    // limit input amount
    const price =
      type === 'BUY'
        ? await this.props.communityClient.getBuyPrice(amount)
        : await this.props.communityClient.getSellPrice(amount)
    this.setState({
      amount: amount,
      price: price,
    })
  }

  async handleChange(what, e) {
    const { value } = e.target
    const { type, price } = this.state
    if (what === 'amount') {
      const amount = value === '' ? new BN('0') : BN.parse(value)
      this.updatePrice(type, amount)
    } else if (what === 'priceLimit') {
      if (type === 'BUY' && value >= price) {
        this.setState({ priceLimit: value !== '' ? BN.parse(value) : null })
      } else if (type === 'SELL' && value <= price) {
        this.setState({ priceLimit: value !== '' ? BN.parse(value) : null })
      }
    }
  }

  render() {
    const { name, logo, symbol } = this.props
    const { type, price, amount, showAdvance } = this.state
    return (
      <BuySellModalRender
        name={name}
        logo={logo}
        symbol={symbol}
        type={type}
        price={price}
        amount={amount}
        handleChange={this.handleChange.bind(this)}
        setType={this.setType.bind(this)}
        showAdvance={showAdvance}
        toggleAdvance={this.toggleAdvance.bind(this)}
        onButtonClick={this.onButtonClick.bind(this)}
      />
    )
  }
}
