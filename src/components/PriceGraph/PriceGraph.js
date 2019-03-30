import React from 'react'
import { connect } from 'react-redux'

import PriceGraphRender from './PriceGraphRender'

import { loadPriceHistory } from 'actions'
import { priceHistorySelector } from 'selectors/price'

import data from './mock'

class PriceGraph extends React.Component {
  componentDidMount() {
    this.props.loadPrice()
  }
  render() {
    return <PriceGraphRender data={this.props.data} />
  }
}

const transformData = rawData => {
  return rawData
    .map(data => [data.get(0).valueOf(), data.get(1)])
    .reverse()
    .toJS()
}

const mapStateToProps = (state, { communityAddress }) => ({
  // data: transformData(
  //   priceHistorySelector(state, { address: communityAddress }),
  // ),
  data,
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadPrice: () => dispatch(loadPriceHistory(communityAddress)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriceGraph)
