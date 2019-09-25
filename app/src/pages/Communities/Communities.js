import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'
import {
  web3Selector,
  currentUserSelector,
  currentNetworkSelector,
  xfnRewardInfoSelector,
} from 'selectors/current'
import { showModal, setXFNRewardInfo } from 'actions'
import xfnRewardContracts from 'utils/xfnRewardContracts'

const getPendingReward = async (user, xfnRewardContract) => {
  if (!window.dispatch) return
  const result = await window.web3.eth.call({
    to: xfnRewardContract,
    data: '0xf40f0f52' + user.slice(2).padStart(64, '0'),
  })
  if (!result || result.length !== 130) return
  const hasPendingReward = Number(result.slice(2, 66)) === 1
  const rewardAmount = Number('0x' + result.slice(66)) / 1e18
  window.dispatch(setXFNRewardInfo({ hasPendingReward, rewardAmount }))
}

const mapDispatchToProps = (dispatch, props) => {
  window.dispatch = dispatch
  return {
    showClaimXFNModal: () => dispatch(showModal('CLAIM_XFN')),
  }
}

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
    .valueSeq()
    .toJS()
  const user = currentUserSelector(state)
  const currentNetwork = currentNetworkSelector(state)
  const web3 = web3Selector(state)
  const xfnRewardContract = xfnRewardContracts[currentNetwork]
  let shouldDisplayClaimXFN =
    web3 &&
    user &&
    xfnRewardContract &&
    user.length === 42 &&
    xfnRewardContract.length === 42

  if (shouldDisplayClaimXFN) {
    window.web3 = web3
    if (
      !window.lastXFNCallTime ||
      Date.now() - window.lastXFNCallTime >= 5000
    ) {
      window.lastXFNCallTime = Date.now()
      getPendingReward(user, xfnRewardContract)
    }
  }

  const xfnRewardInfo = xfnRewardInfoSelector(state)
  if (xfnRewardInfo) {
    const { hasPendingReward, rewardAmount } = xfnRewardInfo
    shouldDisplayClaimXFN =
      shouldDisplayClaimXFN && hasPendingReward && rewardAmount > 0.0
  } else {
    shouldDisplayClaimXFN = false
  }

  return {
    user,
    currentNetwork,
    shouldDisplayClaimXFN,
    bandPrice: bandPriceSelector(state),
    tcdCommunities: communities.filter(community => community.tcds),
    tcrCommunities: communities.filter(community => community.tcr),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CommunityPage),
)
