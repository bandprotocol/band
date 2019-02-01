import { connect } from 'react-redux'

import BuySellModal from 'components/BuySellModal'

import { communityDetailSelector } from 'selectors/communities'
import { currentCommunityClientSelector } from 'selectors/current'

const mapStateToProps = (state, { type, communityName }) => {
  const community = communityDetailSelector(state, { name: communityName })
  if (!community) return {}
  return {
    name: communityName,
    logo: community.get('logo'),
    type: type,
    communityClient: currentCommunityClientSelector(state, {
      name: communityName,
    }),
  }
}

export default connect(mapStateToProps)(BuySellModal)
