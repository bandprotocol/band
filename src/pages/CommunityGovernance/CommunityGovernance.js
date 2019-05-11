import React from 'react'

import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'

import Breadcrumb from 'components/Breadcrumb'
import PageContainer from 'components/PageContainer'

import ParameterPanel from 'components/ParameterPanel'

const CommunityGovernance = ({ communityAddress, name, address }) => (
  <PageContainer withSidebar>
    <Breadcrumb
      links={[
        { path: `/community/${communityAddress}`, label: name },
        {
          path: `/community/${communityAddress}/governance`,
          label: 'Parameters',
        },
      ]}
    />
    <ParameterPanel communityAddress={communityAddress} />
  </PageContainer>
)

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  return {
    name: community.get('name'),
    address: community.get('address'),
  }
}

export default connect(mapStateToProps)(CommunityGovernance)
