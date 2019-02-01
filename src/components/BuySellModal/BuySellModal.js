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

  setType(type) {
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
    if (type === 'BUY') {
      onBuy(amount, priceLimit || price)
    } else {
      onSell(amount, priceLimit || price)
    }
  }

  async updatePrice(amount) {
    // TODO: if sellAmount is excced total supply
    // balance is not enough
    // limit input amount
    const price =
      this.state.type === 'BUY'
        ? await this.props.communityClient.getBuyPrice(amount)
        : await this.props.communityClient.getSellPrice(amount)
    this.setState({
      amount: amount,
      price: price,
    })
  }

  async handleChange(what, e) {
    if (what === 'amount') {
      const amount =
        e.target.value === '' ? new BN('0') : BN.parse(e.target.value)
      this.updatePrice(amount)
    } else if (what === 'priceLimit') {
      this.setState({ priceLimit: BN.parse(e.target.value) })
    }
  }

  render() {
    const { name, logo } = this.props
    return (
      <BuySellModalRender
        name={name}
        logo={logo}
        type={this.state.type}
        price={this.state.price}
        amount={this.state.amount}
        handleChange={this.handleChange.bind(this)}
        setType={this.setType.bind(this)}
        showAdvance={this.state.showAdvance}
        toggleAdvance={this.toggleAdvance.bind(this)}
        onButtonClick={this.onButtonClick.bind(this)}
      />
    )
  }
}
