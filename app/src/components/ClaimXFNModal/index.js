import React from 'react'
import { connect } from 'react-redux'
import ClaimXFNModalRender from './ClaimXFNModalRender'
import { hideModal, claimXFN } from 'actions'
import { dispatchAsync } from 'utils/reduxSaga'
import { walletSelector } from 'selectors/wallet'
import {
  xfnRewardInfoSelector,
  currentNetworkSelector,
  currentUserSelector,
} from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'
import xfnRewardContracts from 'utils/xfnRewardContracts'
import BN from 'utils/bignumber'

class ClaimXFNModal extends React.Component {
  state = {
    loading: true,
    snapShots: [
      { date: 1570215600 - 86400 * 3, bandAmount: new BN(0) },
      { date: 1570215600 - 86400 * 2, bandAmount: new BN(0) },
      { date: 1570215600 - 86400 * 1, bandAmount: new BN(0) },
      { date: 1570215600, bandAmount: new BN(0) },
      { date: 1570215600 + 86400 * 1, bandAmount: new BN(0) },
      { date: 1570215600 + 86400 * 2, bandAmount: new BN(0) },
      { date: 1570215600 + 86400 * 3, bandAmount: new BN(0) },
    ],
    bandAvg: new BN(0),
    pendingTx: false,
  }

  async componentDidMount() {
    const { userAddress, xfnRewardContract } = this.props

    if (!userAddress || userAddress.length < 42) return
    if (!xfnRewardContract || xfnRewardContract.length < 42) return

    const data = await window.web3.eth.call({
      to: xfnRewardContract,
      data: `0x703f0e22000000000000000000000000${userAddress.slice(2)}`,
    })
    const bandAmounts = data
      .slice(2)
      .match(/.{1,64}/g)
      .slice(2)

    const snapShots = []

    let i = 0
    for (const s of this.state.snapShots) {
      snapShots.push({ date: s.date, bandAmount: new BN(bandAmounts[i++], 16) })
    }

    const data2 = await window.web3.eth.call({
      to: xfnRewardContract,
      data: `0x2d373155000000000000000000000000${userAddress.slice(2)}`,
    })

    this.setState({
      snapShots,
      bandAvg: new BN(data2.slice(2), 16),
      loading: false,
    })
  }

  getXFNAmount = async () => {
    console.log('getXFNAmount')
  }

  claim = async () => {
    const { xfnRewardContract, claimXFNReward, hideXFNRewardModal } = this.props

    if (!xfnRewardContract) return
    this.setState({ pendingTx: true })
    await claimXFNReward(xfnRewardContract)
    this.setState({ pendingTx: false })
    await new Promise(resolve => setTimeout(resolve, 100))
    hideXFNRewardModal()
  }

  render() {
    return (
      <ClaimXFNModalRender
        {...this.props}
        {...this.state}
        claim={this.claim}
        getXFNAmount={this.getXFNAmount}
        claim={this.claim}
        hideModal={hideModal}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  const xfnRewardInfo = xfnRewardInfoSelector(state)
  const currentNetwork = currentNetworkSelector(state)
  const xfnRewardContract = xfnRewardContracts[currentNetwork]
  const userAddress = currentUserSelector(state)
  const isLogin = userAddress && userAddress !== 'NOT_SIGNIN'

  const haveBand = Number(bandBalanceSelector(state).toString()) > 0

  const { hasPendingReward, rewardAmount } = xfnRewardInfo || {
    hasPendingReward: false,
    rewardAmount: 0,
  }
  return {
    userAddress,
    hasPendingReward,
    rewardAmount,
    wallet: walletSelector(state),
    xfnRewardContract: xfnRewardContract || '',
    doneStep1: isLogin,
    doneStep2: haveBand,
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideXFNRewardModal: () => dispatch(hideModal()),
  claimXFNReward: xfnRewardContract =>
    dispatchAsync(dispatch, claimXFN(xfnRewardContract)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimXFNModal)
