import { connect } from 'react-redux'
import SideBar from 'components/Sidebar'

import { communityDetailSelector } from 'selectors/communities'

const mapStateToProps = (state, { communityName }) => {
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    name: communityName,
    src: community.get('logo'),
    balance: community.get('balance'),
    symbol: 'RRR', // TODO: redux-saga
  }
}

export default connect(mapStateToProps)(SideBar)
