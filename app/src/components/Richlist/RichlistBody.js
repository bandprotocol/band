import { connect } from 'react-redux'
import BN from 'bn.js'
import { withRouter } from 'react-router-dom'

import RichlistBodyRender from './RichlistBodyRender'

import { holdersSelector } from 'selectors/holder'
import { communityDetailSelector } from 'selectors/communities'

const mapStateToProps = (state, { tokenAddress, currentPage, pageSize }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  const totalSupply = community && community.get('totalSupply')
  const items = holdersSelector(state, {
    address: tokenAddress,
    page: currentPage,
    pageSize,
  }).map(item => ({
    ...item,
    rank: (currentPage - 1) * pageSize + item.rank,
    percentage:
      community &&
      (item.balance.mul(new BN(100)).toString() / totalSupply).toFixed(2),
  }))
  while (items.length < pageSize) {
    items.push(null)
  }
  return { items }
}

export default withRouter(connect(mapStateToProps)(RichlistBodyRender))
