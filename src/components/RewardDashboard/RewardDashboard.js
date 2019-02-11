import React from 'react'
import { connect } from 'react-redux'

import { loadRewards } from 'actions'
import RewardDashboardRender from './RewardDashboardRender'
import { currentUserSelector } from 'selectors/current'
import { rewardCommunitySelector } from 'selectors/reward'
import { communitySymbolSelector } from 'selectors/communities'

class RewardDashboard extends React.Component {
  componentDidMount() {
    this.props.loadRewards()
  }
  render() {
    const { logedin, rewards, symbol } = this.props
    return (
      <RewardDashboardRender
        logedin={logedin}
        rewards={rewards}
        symbol={symbol}
      />
    )
  }
}

const mapStateToProps = (state, { communityName }) => ({
  logedin: !!currentUserSelector(state),
  rewards: rewardCommunitySelector(state, { name: communityName }),
  symbol: communitySymbolSelector(state, { name: communityName }),
})

const mapDispatchToProps = (dispatch, { communityName }) => ({
  loadRewards: () => dispatch(loadRewards(communityName)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardDashboard)
