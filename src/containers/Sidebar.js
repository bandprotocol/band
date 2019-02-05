import { connect } from 'react-redux'
import SideBar from 'components/Sidebar'

import { communityDetailSelector } from 'selectors/communities'
import { bandSelector } from 'selectors/basic'
import { bandPriceSelector } from 'selectors/bandPrice'

const mapStateToProps = (state, { communityName }) => {
  const band = bandSelector(state)
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    name: communityName,
    src: community.get('logo'),
    balance: community.get('balance'),
    symbol: community.get('symbol'),
    communityPrice: community.get('price'),
    bandPrice: bandPriceSelector(state),
  }
}

export default connect(mapStateToProps)(SideBar)
