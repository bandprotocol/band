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

class BuySellModal extends React.Component {
  state = {
    buy: {
      amount: '',
      price: new BN(0), // CANNOT CALCULATE PRICE, number
      priceLimit: '',
      priceChange: '5',
      amountStatus: null, // INVALID_AMOUNT, INSUFFICIENT_TOKEN, OK
      priceStatus: 'OK', // INSUFFICIENT_BAND, OK
      priceLimitStatus: 'OK', //INVALID_PRICELIMIT, INSUFFICIENT_BUYPRICE, INSUFFICIENT_SELLPRICE, OK
    },
    sell: {
      amount: '',
      price: new BN(0), // CANNOT CALCULATE PRICE, number
      priceLimit: '',
      priceChange: '5',
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
    const { onBuy, onSell } = this.props
    if (type === 'buy') {
      onBuy(
        BN.parse(parseFloat(amount)),
        priceLimit !== '' ? BN.parse(parseFloat(priceLimit)) : price,
      )
    } else {
      onSell(
        BN.parse(parseFloat(amount)),
        priceLimit !== '' ? BN.parse(parseFloat(priceLimit)) : price,
      )
    }
  }

  async getPrice(type, amount) {
    return type === 'buy'
      ? await this.props.communityClient.getBuyPrice(
          Utils.toBlockchainUnit(amount),
        )
      : await this.props.communityClient.getSellPrice(
          Utils.toBlockchainUnit(amount),
        )
  }

  async updateAmount() {
    const { type } = this.state
    const { amount, priceChange, priceLimit } = this.state[type]
    const { bandBalance } = this.props

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
      const amountStatusChecking = Utils.toBlockchainUnit(amount).gt(
        this.props.tokenBalance,
      )
      this.setTypeState(type, {
        amountStatus:
          type === 'sell' && amountStatusChecking ? 'INSUFFICIENT_TOKEN' : 'OK',
      })

      this.setState({ loading: true })
      const price = await this.getPrice(type, amount)
      this.setState({ loading: false })
      const newPriceLimit =
        this.calculatePriceLimit(type, price, priceChange) || priceLimit
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
    if (priceLimit === '') return 'INVALID_PRICELIMIT'
    if (isPositiveNumber(priceLimit)) {
      const priceLimitBN = Utils.toBlockchainUnit(priceLimit)
      if (type === 'buy') {
        return price.gt(priceLimitBN) ? 'INSUFFICIENT_BUYPRICE' : 'OK'
      } else {
        return priceLimitBN.gt(price) ? 'INSUFFICIENT_SELLPRICE' : 'OK'
      }
    }
    return 'INVALID_PRICELIMIT'
  }

  calculatePriceLimit(type, price, priceChange) {
    if (priceChange === '') return null
    if (type === 'buy') {
      return Utils.fromBlockchainUnit(
        price.applyPercentage(100 + parseFloat(priceChange)),
      ).toFixed(2)
    } else if (type === 'sell') {
      return Utils.fromBlockchainUnit(
        price.applyPercentage(100 - parseFloat(priceChange)),
      ).toFixed(2)
    }
    return null
  }

  updatePriceLimit(priceLimit) {
    const { type } = this.state
    const { price } = this.state[type]
    if (priceLimit === '') {
      this.setTypeState(type, {
        priceLimit: '',
        priceLimitStatus: 'INVALID_PRICELIMIT',
      })
      return
    }

    if (isPositiveNumber(priceLimit)) {
      this.setTypeState(type, {
        priceLimit,
        priceLimitStatus: this.calculatePriceLimitStatus(
          type,
          priceLimit,
          price,
        ),
        priceChange: '',
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
      case 'priceChange':
        this.updatePriceChange(value)
        break
      default:
        break
    }
  }

  render() {
    const { name, logo, symbol, tokenNormalPrice, communityClient } = this.props
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
    tokenNormalPrice: community.get('price'),
    type: type,
    communityClient: currentCommunityClientSelector(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  onBuy: (amount, priceLimit) =>
    dispatch(buyToken(tokenAddress, amount, priceLimit)),
  onSell: (amount, priceLimit) =>
    dispatch(sellToken(tokenAddress, amount, priceLimit)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BuySellModal)
