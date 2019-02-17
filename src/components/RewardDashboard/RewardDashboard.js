import React from 'react'
import { connect } from 'react-redux'

import { loadRewards, claimReward } from 'actions'
import RewardDashboardRender from './RewardDashboardRender'
import { currentUserSelector } from 'selectors/current'
import { rewardCommunitySelector } from 'selectors/reward'
import { communitySymbolSelector } from 'selectors/communities'

class RewardDashboard extends React.Component {
  componentDidMount() {
    this.props.loadRewards()
  }
  render() {
    const { logedin, rewards, symbol, claimReward } = this.props
    return (
      <RewardDashboardRender
        logedin={logedin}
        rewards={rewards}
        symbol={symbol}
        claimReward={claimReward}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => ({
  logedin: !!currentUserSelector(state),
  rewards: rewardCommunitySelector(state, { address: communityAddress }),
  symbol: communitySymbolSelector(state, { address: communityAddress }),
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadRewards: () => dispatch(loadRewards(communityAddress)),
  claimReward: rewardID => dispatch(claimReward(communityAddress, rewardID)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardDashboard)
