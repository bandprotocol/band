import { connect } from 'react-redux'

import PriceGraph from 'components/PriceGraph'

import { orderHistorySelector } from 'selectors/order'

const transformData = rawData => {
  return rawData
    .map(data => [
      data.get('time').valueOf(),
      parseFloat(data.get('price').calculatePrice(data.get('amount'))),
    ])
    .sortBy(data => data[0])
    .toJS()
}

const mapStateToProps = (state, { communityName }) => ({
  data: transformData(
    orderHistorySelector(state, { name: communityName, type: true }),
  ),
})

export default connect(mapStateToProps)(PriceGraph)
