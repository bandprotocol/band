import React from 'react'
import CreateCommunityDistributionRender from './CreateCommunityDistributionRender'

export default class CreateCommunityDistribution extends React.Component {
  state = {
    tab: 'priceCurve', // bondingCurve, collateralCurve
  }

  switchTab(tab) {
    this.setState({
      tab,
    })
  }

  render() {
    return (
      <CreateCommunityDistributionRender
        tab={this.state.tab}
        switchTab={this.switchTab.bind(this)}
        {...this.props}
      />
    )
  }
}
