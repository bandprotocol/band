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

const mapStateToProps = (state, { tokenAddress }) => ({
  logedin: !!currentUserSelector(state),
  rewards: rewardCommunitySelector(state, { address: tokenAddress }),
  symbol: communitySymbolSelector(state, { address: tokenAddress }),
})

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadRewards: () => dispatch(loadRewards(tokenAddress)),
  claimReward: rewardID => dispatch(claimReward(tokenAddress, rewardID)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardDashboard)
