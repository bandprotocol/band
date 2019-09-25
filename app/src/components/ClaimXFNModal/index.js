import React from 'react'
import { connect } from 'react-redux'
import ClaimXFNModalRender from './ClaimXFNModalRender'
import { hideModal, claimXFN } from 'actions'
import { dispatchAsync } from 'utils/reduxSaga'
import { walletSelector } from 'selectors/wallet'
import {
  xfnRewardInfoSelector,
  currentNetworkSelector,
} from 'selectors/current'
import xfnRewardContracts from 'utils/xfnRewardContracts'

class ClaimXFNModal extends React.Component {
  getXFNAmount = async () => {
    console.log('getXFNAmount')
  }

  claim = async () => {
    console.log('claim')
  }

  render() {
    return (
      <ClaimXFNModalRender
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
  const { hasPendingReward, rewardAmount } = xfnRewardInfo || {
    hasPendingReward: false,
    rewardAmount: 0,
  }
  return {
    hasPendingReward,
    rewardAmount,
    wallet: walletSelector(state),
    xfnRewardContract: xfnRewardContract || '',
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
