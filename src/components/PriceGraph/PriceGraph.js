import React from 'react'
import { connect } from 'react-redux'
import PriceGraphRender from './PriceGraphRender'
import { communityDetailSelector } from 'selectors/communities'
import { loadPriceHistory } from 'actions'
import { priceHistorySelector } from 'selectors/price'
import { getGraphColor } from 'ui/communities'

class PriceGraph extends React.Component {
  componentDidMount() {
    this.props.loadPrice()
  }
  render() {
    const { data, height, width, graphColor } = this.props
    return (
      <PriceGraphRender
        data={data}
        height={height}
        width={width}
        graphColor={graphColor}
      />
    )
  }
}

const transformData = rawData => {
  return rawData
    .map(data => [data.get(0).valueOf(), data.get(1)])
    .reverse()
    .toJS()
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  return {
    data: transformData(priceHistorySelector(state, { address: tokenAddress })),
    graphColor: community && getGraphColor(community.toJS().symbol),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadPrice: () => dispatch(loadPriceHistory(tokenAddress)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriceGraph)
