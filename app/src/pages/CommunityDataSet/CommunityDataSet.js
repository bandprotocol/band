import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text } from 'ui/common'
import { communityDetailSelector } from 'selectors/communities'
import { currentNetworkSelector } from 'selectors/current'
import { getTCDInfomation } from 'utils/tcds'
import { tcdsSelector } from 'selectors/tcd'
import CommunityDataSetPrice from './CommunityDataSetPrice'
import CommunityDataSetLottery from './CommunityDataSetLottery'
import CommunityDataSetSport from './CommunityDataSetSport'
import CommunityDataSetIdentity from './CommunityDataSetIdentity'
import CommunityDataSetWebRequest from './CommunityDataSetWebRequest'

class CommunityDataSet extends React.Component {
  render() {
    switch (this.props.name) {
      case 'Financial Data Feeds':
        return <CommunityDataSetPrice {...this.props} />
      case 'Lottery Data Feeds':
        return <CommunityDataSetLottery {...this.props} />
      case 'Sport Data Feeds':
        return <CommunityDataSetSport {...this.props} />
      case 'BandIdentity':
        return <CommunityDataSetIdentity {...this.props} />
      case 'Web Request Oracle':
        return <CommunityDataSetWebRequest {...this.props} />
      default:
        return (
          <Flex width="100%" justifyContent="center" alignItems="center" mt={3}>
            <Text fontSize="32px" fontWeight="800" color="black">
              This page is not available right now.
            </Text>
          </Flex>
        )
    }
  }
}

const mapStateToProps = (state, { communityAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  const tcds = tcdsSelector(state, { address: communityAddress, tcdAddress })

  if (!community) return {}

  return {
    name: community.get('name'),
    network: currentNetworkSelector(state),
    tcdName:
      tcds && getTCDInfomation(tcds.toJS().prefix, community.get('name')).label,
    tcdPrefix: community.getIn(['tcds', tcdAddress, 'prefix']).slice(0, -1),
  }
}

export default connect(mapStateToProps)(CommunityDataSet)
