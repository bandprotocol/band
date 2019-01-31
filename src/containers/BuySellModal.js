import { connect } from 'react-redux'

import BuySellModal from 'components/BuySellModal'
import { communityDetailSelector } from 'selectors/communities'

const mapStateToProps = (state, { type, communityName }) => {
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    name: communityName,
    logo: community.get('logo'),
    type: type,
  }
}

export default connect(mapStateToProps)(BuySellModal)
