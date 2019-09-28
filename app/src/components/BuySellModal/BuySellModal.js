import React from 'react'
import { connect } from 'react-redux'
import BuySellModalRender from './BuySellModalRender'
import { buyToken, sellToken } from 'actions'
import { communityDetailSelector } from 'selectors/communities'
import { currentCommunityClientSelector } from 'selectors/current'
import {
  bandUnlockBalanceSelector,
  communityUnlockBalanceSelector,
} from 'selectors/balances'
import BN from 'utils/bignumber'
import { Utils } from 'band.js'
import { isPositiveNumber } from 'utils/helper'
import { bandPriceSelector } from 'selectors/bandPrice'

class BuySellModal extends React.Component {
  state = {
    buy: {
      amount: '',
      price: new BN(0), // CANNOT CALCULATE PRICE, number
      priceLimit: '',
      priceChange: '2.5',
      amountStatus: null, // INVALID_AMOUNT, INSUFFICIENT_TOKEN, OK
      priceStatus: 'OK', // INSUFFICIENT_BAND, OK
      priceLimitStatus: 'OK', //INVALID_PRICELIMIT, INSUFFICIENT_BUYPRICE, INSUFFICIENT_SELLPRICE, OK
    },
    sell: {
      amount: '',
      price: new BN(0), // CANNOT CALCULATE PRICE, number
      priceLimit: '',
      priceChange: '2.5',
      amountStatus: null, // INVALID_AMOUNT, INSUFFICIENT_TOKEN, OK
      priceStatus: 'OK',
      priceLimitStatus: 'OK', //INVALID_PRICELIMIT, INSUFFICIENT_BUYPRICE, INSUFFICIENT_SELLPRICE, OK
    },
    type: 'buy', // 'buy' | 'sell'
    showAdvance: false,
    loading: false,
  }

  componentDidMount() {
    this.setState({ type: this.props.type })
  }

  setType(type) {
    this.setState({
      type,
    })
  }

  setTypeState(type, obj) {
    this.setState({
      [type]: {
        ...this.state[type],
        ...obj,
      },
    })
  }

  toggleAdvance() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    })
  }

  onButtonClick() {
    const { type } = this.state
    const { amount, priceLimit, price } = this.state[type]

    const { onBuy, onSell, symbol, tokenBalance } = this.props
    if (type === 'buy') {
      onBuy(
        Utils.toBlockchainUnit(amount),
        priceLimit !== '' ? new BN(priceLimit) : price,
        symbol,
      )
    } else {
      let adjustedAmount = Utils.toBlockchainUnit(amount)

      if (
        Utils.toBlockchainUnit(amount).gt(tokenBalance) &&
        Utils.toBlockchainUnit(amount)
          .sub(tokenBalance)
          .lt(new BN(1e12))
      ) {
        adjustedAmount = tokenBalance
      }

      onSell(
        adjustedAmount,
        priceLimit !== '' ? new BN(priceLimit) : price,
        symbol,
      )
    }
  }

  async getPrice(type, amount) {
    return type === 'buy'
      ? await this.props.communityClient.getBuyPrice(amount)
      : await this.props.communityClient.getSellPrice(amount)
  }

  async updateAmount() {
    const { type } = this.state
    const { amount, priceChange, priceLimit } = this.state[type]
    const { bandBalance, tokenBalance } = this.props

    if (amount === '') {
      this.setTypeState(type, {
        price: new BN('0'),
        priceLimit: priceChange ? '0' : priceLimit,
        amountStatus: null,
        priceStatus: null,
      })
      return null
    }

    if (isPositiveNumber(amount)) {
      // use amount in blockchain unit BN (amount * 1e18)
      let adjustedAmount = Utils.toBlockchainUnit(amount)

      // In case of inputAmount > tokenBalance, if inputAmount - tokenBalance < 1e12, amount should be tokenBalance
      if (
        type === 'sell' &&
        Utils.toBlockchainUnit(amount).gt(tokenBalance) &&
        Utils.toBlockchainUnit(amount)
          .sub(tokenBalance)
          .lt(new BN(1e12))
      ) {
        // adjustedAmount and tokenbalance is BN unit (wei)
        adjustedAmount = tokenBalance
      }

      const cannotSell = adjustedAmount.gt(tokenBalance)
      this.setTypeState(type, {
        amountStatus:
          type === 'sell' && cannotSell ? 'INSUFFICIENT_TOKEN' : 'OK',
      })

      this.setState({ loading: true })
      const price = await this.getPrice(type, adjustedAmount)
      this.setState({ loading: false })
      let newPriceLimit = this.calculatePriceLimit(type, price, '2.5')
      if (
        newPriceLimit &&
        newPriceLimit.gt &&
        newPriceLimit.gt(bandBalance) &&
        type === 'buy'
      ) {
        newPriceLimit = new BN(bandBalance.toString())
      }
      this.setTypeState(type, {
        price,
        priceLimit: newPriceLimit,
        priceStatus:
          type === 'buy' && price.gt(bandBalance) ? 'INSUFFICIENT_BAND' : 'OK',
        priceLimitStatus: this.calculatePriceLimitStatus(
          type,
          newPriceLimit,
          price,
        ),
        priceChange:
          price > 0
            ? Number((newPriceLimit.toString() * 100) / price - 100).toFixed(2)
            : '',
      })
    } else {
      this.setState({
        [type]: {
          ...this.state[type],
          price: new BN('0'),
          amountStatus: 'INVALID_AMOUNT',
        },
      })
    }
  }

  calculatePriceLimitStatus(type, priceLimit, price) {
    const { bandBalance } = this.props
    if (priceLimit === '') return 'INVALID_PRICELIMIT'
    const isPN =
      typeof priceLimit === 'string'
        ? isPositiveNumber(Number(priceLimit))
        : isPositiveNumber(priceLimit)

    if (isPN) {
      const priceLimitBN = Utils.toBlockchainUnit(priceLimit).div(
        new BN((1e18).toString()),
      )
      if (type === 'buy') {
        if (priceLimitBN.gt(bandBalance)) {
          return 'INVALID_EXCEED'
        }
        const p = new BN(price.toString())
        return p.gt(priceLimitBN) ? 'INSUFFICIENT_BUYPRICE' : 'OK'
      } else {
        const p = new BN(price.toString())
        return priceLimitBN.gt(p) ? 'INSUFFICIENT_SELLPRICE' : 'OK'
      }
    }
    return 'INVALID_PRICELIMIT'
  }

  calculatePriceLimit(type, price, priceChange) {
    if (priceChange === '') return null
    if (type === 'buy') {
      return price.applyPercentage(100 + parseFloat(priceChange))
    } else if (type === 'sell') {
      return price.applyPercentage(100 - parseFloat(priceChange))
    }
    return null
  }

  updatePriceLimit(_priceLimit) {
    const { type } = this.state
    const { price } = this.state[type]

    if (_priceLimit === '' || isNaN(_priceLimit)) {
      this.setTypeState(type, {
        priceLimit: _priceLimit,
        priceChange: '',
        priceLimitStatus: 'INVALID_PRICELIMIT',
      })
      return
    }

    const priceLimit = (_priceLimit * 1e18).toString()

    if (isPositiveNumber(_priceLimit * 1e18)) {
      this.setTypeState(type, {
        priceLimit,
        priceLimitStatus: this.calculatePriceLimitStatus(
          type,
          priceLimit,
          price,
        ),
        priceChange:
          price > 0 ? Number((priceLimit * 100) / price - 100).toFixed(2) : '',
      })
    } else {
      this.setTypeState(type, {
        priceLimit,
        priceLimitStatus: 'INVALID_PRICELIMIT',
        priceChange: '',
      })
    }
  }

  updatePriceChange(priceChange) {
    const { type } = this.state
    const { price } = this.state[type]
    if (priceChange === '') {
      this.setTypeState(type, {
        priceChange: '',
      })
      return
    }

    if (
      isPositiveNumber(priceChange) &&
      !(type === 'sell' && parseFloat(priceChange) >= 100.0)
    ) {
      const newPriceLimit = this.calculatePriceLimit(type, price, priceChange)
      this.setTypeState(type, {
        priceChange,
        priceLimit: newPriceLimit,
        priceLimitStatus: this.calculatePriceLimitStatus(
          type,
          newPriceLimit,
          price,
        ),
      })
    } else {
      this.setTypeState(type, {
        priceChange,
      })
    }
  }

  async handleChange(what, e) {
    const { value } = e.target
    const { type } = this.state

    switch (what) {
      case 'amount':
        this.setState({
          [type]: {
            ...this.state[type],
            amount: value,
          },
        })
        if (this.checker) clearTimeout(this.checker)
        this.checker = setTimeout(() => {
          delete this.checker
          this.updateAmount()
        }, 200)
        break
      case 'priceLimit':
        this.updatePriceLimit(value)
        break
      default:
        break
    }
  }

  render() {
    const {
      name,
      logo,
      symbol,
      tokenNormalPrice,
      communityClient,
      bandPrice,
    } = this.props
    const { type, showAdvance, loading } = this.state
    const currentType = this.state[type]
    return (
      <BuySellModalRender
        name={name}
        logo={logo}
        symbol={symbol}
        type={type}
        amount={currentType.amount}
        tokenNormalPrice={tokenNormalPrice}
        bandPrice={bandPrice}
        price={currentType.price}
        priceChange={currentType.priceChange}
        priceLimit={currentType.priceLimit}
        amountStatus={currentType.amountStatus}
        priceStatus={currentType.priceStatus}
        priceLimitStatus={currentType.priceLimitStatus}
        loading={loading}
        handleChange={this.handleChange.bind(this)}
        setType={this.setType.bind(this)}
        showAdvance={showAdvance}
        toggleAdvance={this.toggleAdvance.bind(this)}
        onButtonClick={this.onButtonClick.bind(this)}
        communityClient={communityClient}
      />
    )
  }
}

const mapStateToProps = (state, { type, tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  return {
    name: community.get('name'),
    logo: community.get('logo'),
    symbol: community.get('symbol'),
    bandBalance: bandUnlockBalanceSelector(state),
    tokenBalance: communityUnlockBalanceSelector(state, {
      address: tokenAddress,
    }),
    bandPrice: bandPriceSelector(state),
    tokenNormalPrice: community.get('price'),
    type: type,
    communityClient: currentCommunityClientSelector(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  onBuy: (amount, priceLimit, tokenName) =>
    dispatch(buyToken(tokenAddress, amount, priceLimit, tokenName)),
  onSell: (amount, priceLimit, tokenName) =>
    dispatch(sellToken(tokenAddress, amount, priceLimit, tokenName)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySellModal)
