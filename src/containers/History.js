import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

// import { historySelector } from 'selectors/communities'

import History from 'components/History'

const mapStateToProps = (state, { communityName }) => ({
  items: [
    {
      time: '21-02 2019 07:00:12',
      price: 0.008987657,
      amount: 1395.05674,
      type: 'buy',
    },
    {
      time: '21-02 2019 07:00:12',
      price: 0.008987657,
      amount: 1395.05674,
      type: 'sell',
    },
    {
      time: '21-02 2019 07:00:12',
      price: 0.008987657,
      amount: 1395.05674,
      type: 'buy',
    },
    {
      time: '21-02 2019 07:00:12',
      price: 0.008987657,
      amount: 1395.05674,
      type: 'sell',
    },
    {
      time: '21-02 2019 07:00:12',
      price: 0.008987657,
      amount: 1395.05674,
      type: 'buy',
    },
  ],
})
export default withRouter(connect(mapStateToProps)(History))
