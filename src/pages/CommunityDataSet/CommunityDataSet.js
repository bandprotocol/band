import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text } from 'ui/common'
import { communityDetailSelector } from 'selectors/communities'
import CommunityDataSetPrice from './CommunityDataSetPrice'
import CommunityDataSetLottery from './CommunityDataSetLottery'
import CommunityDataSetSport from './CommunityDataSetSport'
import CommunityDataSetIdentity from './CommunityDataSetIdentity'

class CommunityDataSet extends React.Component {
  render() {
    switch (this.props.name) {
      case 'Price Dataset':
        return <CommunityDataSetPrice {...this.props} />
      case 'LotteryFeedCommunity':
        return <CommunityDataSetLottery {...this.props} />
      case 'SportFeedCommunity':
        return <CommunityDataSetSport {...this.props} />
      case 'BandIdentity':
        return <CommunityDataSetIdentity {...this.props} />
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

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  return {
    name: community.get('name'),
    address: community.get('address'),
  }
}

export default connect(mapStateToProps)(CommunityDataSet)
