import { connect } from 'react-redux'

import PriceGraph from 'components/PriceGraph'

import { priceHistorySelector } from 'selectors/price'

import { loadPriceHistory } from 'actions'

const transformData = rawData => {
  return rawData
    .map(data => [data.get(0).valueOf(), data.get(1)])
    .reverse()
    .toJS()
}

const mapStateToProps = (state, { communityName }) => ({
  data: transformData(priceHistorySelector(state, { name: communityName })),
})

const mapDispatchToProps = (dispatch, { communityName }) => ({
  loadPrice: () => dispatch(loadPriceHistory(communityName)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriceGraph)
