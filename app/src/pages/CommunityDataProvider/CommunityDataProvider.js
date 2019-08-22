import React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'ui/common'
import { communityDetailSelector } from 'selectors/communities'
import { tcdsSelector } from 'selectors/tcd'
import { getTCDInfomation } from 'utils/tcds'
import { currentUserSelector } from 'selectors/current'
import PageStructure from 'components/DataSetPageStructure'
import ProviderList from './ProviderList'
import ConfigurationList from 'components/ConfigurationList'
import DataHeader from 'components/DataHeader'
import GovernanceHeader from 'images/govenance-header.svg'

class CommunityDataProvider extends React.Component {
  render() {
    const { user, tokenAddress, name, prefix, tcdAddress } = this.props
    return (
      <PageStructure
        name={name}
        communityAddress={tokenAddress}
        breadcrumb={{ path: 'governance', label: 'Governance' }}
        renderHeader={() => (
          <DataHeader
            lines={[
              'Great Data Comes',
              'From Community Collaborations',
              'Token holders collectively curate trustworthy data providers.',
              'By staking their tokens, they earn a portion of fee from the providers.',
            ]}
          />
        )}
        headerImage={GovernanceHeader}
        noSubheader={true}
        {...this.props}
      >
        <Flex mt="30px" flexDirection="column">
          <ProviderList
            user={user}
            tokenAddress={tokenAddress}
            tcdAddress={tcdAddress}
            pageSize={10}
          />
          <ConfigurationList prefix={prefix} communityAddress={tokenAddress} />
        </Flex>
      </PageStructure>
    )
  }
}

const mapStateToProps = (state, { tokenAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  const tcd = tcdsSelector(state, {
    address: tokenAddress,
    tcdAddress,
  })

  return {
    name: community.get('name'),
    user: currentUserSelector(state),
    prefix: tcd && tcd.get('prefix'),
    tcdName:
      tcd && getTCDInfomation(tcd.toJS().prefix, community.get('name')).label,
  }
}

export default connect(mapStateToProps)(CommunityDataProvider)
