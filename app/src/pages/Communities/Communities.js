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

const mapDispatchToProps = (dispatch, props) => {
  return {
    getPendingReward: async (user, xfnRewardContract) => {
      const result = await window.web3.eth.call({
        to: xfnRewardContract,
        data: '0xf40f0f52' + user.slice(2).padStart(64, '0'),
      })
      if (!result || result.length !== 130) return
      const hasPendingReward = Number(result.slice(2, 66)) === 1
      const rewardAmount = Number('0x' + result.slice(66)) / 1e18
      dispatch(setXFNRewardInfo({ hasPendingReward, rewardAmount }))
    },
    showClaimXFNModal: () => {
      dispatch(showModal('CLAIM_XFN'))
      window.gtag('event', 'click-airdrop', { event_category: 'User' })
    },
  }
}

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
    .valueSeq()
    .toJS()

  const user = currentUserSelector(state)
  const currentNetwork = currentNetworkSelector(state)
  const web3 = web3Selector(state)
  const xfnRewardInfo = xfnRewardInfoSelector(state)
  const xfnRewardContract = xfnRewardContracts[currentNetwork]
  const { hasPendingReward, rewardAmount } = xfnRewardInfo || {
    hasPendingReward: false,
    rewardAmount: 0,
  }
  let shouldDisplayClaimXFN =
    web3 &&
    user &&
    xfnRewardContract &&
    user.length === 42 &&
    xfnRewardContract.length === 42

  window.web3 = web3

  return {
    hasPendingReward,
    rewardAmount,
    user,
    xfnRewardInfo,
    xfnRewardContract,
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
