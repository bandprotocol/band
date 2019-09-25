import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommunityPage from 'pages/Communities/CommunitiesRender'
import { communitySelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'
import {
  web3Selector,
  currentUserSelector,
  currentNetworkSelector,
} from 'selectors/current'
import { showModal } from 'actions'
import xfnRewardContracts from 'utils/xfnRewardContracts'

const mapDispatchToProps = (dispatch, props) => ({
  showClaimXFNModal: () => dispatch(showModal('CLAIM_XFN')),
})

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
    .valueSeq()
    .toJS()
  const user = currentUserSelector(state)
  const currentNetwork = currentNetworkSelector(state)
  const web3 = web3Selector(state)
  const xfnRewardContract = xfnRewardContracts[currentNetwork]
  const shouldDisplayClaimXFN =
    web3 &&
    user &&
    xfnRewardContract &&
    user.length === 42 &&
    xfnRewardContract.length === 42

  if (shouldDisplayClaimXFN) {
    // window.web3 = web3
    // if (
    //   !window.lastXFNCallTime ||
    //   Date.now() - window.lastXFNCallTime >= 5000
    // ) {
    //   window.lastXFNCallTime = Date.now()(async () => {
    //     const r = await window.web3.eth.call({
    //       to: xfnRewardContract,
    //       data: '0xf40f0f52' + user.slice(2).padStart(64, '0'),
    //     })
    //     console.log(r)
    //   })()
    // }
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
