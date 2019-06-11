import React from 'react'
import { connect } from 'react-redux'

import PriceGraphRender from './PriceGraphRender'

import { loadPriceHistory } from 'actions'
import { priceHistorySelector } from 'selectors/price'

class PriceGraph extends React.Component {
  componentDidMount() {
    this.props.loadPrice()
  }
  render() {
    const { data, height, width } = this.props
    return <PriceGraphRender data={data} height={height} width={width} />
  }
}

const transformData = rawData => {
  return rawData
    .map(data => [data.get(0).valueOf(), data.get(1)])
    .reverse()
    .toJS()
}

const mapStateToProps = (state, { tokenAddress }) => ({
  data: transformData(
    priceHistorySelector(state, { address: tokenAddress }),
  ),
  // data,
})

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadPrice: () => dispatch(loadPriceHistory(tokenAddress)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriceGraph)
