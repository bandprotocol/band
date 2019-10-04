import React from 'react'
import { connect } from 'react-redux'
import AirdropXFNModalRender from './AirdropXFNModalRender'
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

class AirdropXFNModal extends React.Component {
  getXFNAmount = async () => {
    console.log('getXFNAmount')
  }

  claim = async () => {
    console.log('claim')
  }

  render() {
    return (
      <AirdropXFNModalRender
        {...this.props}
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
  const isLogin = currentUserSelector(state)
    ? currentUserSelector(state) !== 'NOT_SIGNIN'
    : false
  const haveBand = Number(bandBalanceSelector(state).toString()) > 0

  const { hasPendingReward, rewardAmount } = xfnRewardInfo || {
    hasPendingReward: false,
    rewardAmount: 0,
  }
  return {
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
)(AirdropXFNModal)
