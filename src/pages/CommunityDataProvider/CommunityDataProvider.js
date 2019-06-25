import React from 'react'
import { connect } from 'react-redux'
import { Flex, Text } from 'ui/common'
import { communityDetailSelector } from 'selectors/communities'
import { currentUserSelector } from 'selectors/current'
import PageStructure from 'components/DataSetPageStructure'
import ProviderList from './ProviderList'
import ConfigurationList from 'components/ConfigurationList'

class CommunityDataProvider extends React.Component {
  render() {
    const { user, tokenAddress, name } = this.props
    return (
      <PageStructure
        name={name}
        communityAddress={tokenAddress}
        breadcrumb={{ path: 'provider', label: 'Data Providers' }}
        renderHeader={() => (
          <Flex flexDirection="column" style={{ width: '100%' }}>
            <Flex flexDirection="column" m="15px 52px">
              <Text
                fontSize="27px"
                color="white"
                fontWeight="900"
                width="350px"
                style={{ lineHeight: '38px' }}
              >
                Great Data Comes From Community Collaborations
              </Text>
              <Text
                fontSize="18px"
                color="white"
                fontWeight="500"
                width="650px"
                style={{ lineHeight: '33px' }}
              >
                Token holders collectively curate trustworthy data providers. By
                staking their tokens, they earn a portion of fee from the
                providers.
              </Text>
            </Flex>
          </Flex>
        )}
        {...this.props}
      >
        <Flex mt="30px" flexDirection="column">
          <ProviderList user={user} tokenAddress={tokenAddress} pageSize={10} />
          {/* TODO: Change prefix to each dataset */}
          <ConfigurationList prefix="bonding" communityAddress={tokenAddress} />
        </Flex>
      </PageStructure>
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  return {
    name: community.get('name'),
    user: currentUserSelector(state),
  }
}

export default connect(mapStateToProps)(CommunityDataProvider)
