import React from 'react'

import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'

import Breadcrumb from 'components/Breadcrumb'
import PageContainer from 'components/PageContainer'

import ParameterPanel from 'components/ParameterPanel'

const CommunityGovernance = ({ tokenAddress, name }) => (
  <PageContainer withSidebar>
    <Breadcrumb
      links={[
        { path: `/community/${tokenAddress}`, label: name },
        {
          path: `/community/${tokenAddress}/parameters`,
          label: 'Parameters',
        },
      ]}
    />
    <ParameterPanel tokenAddress={tokenAddress} />
  </PageContainer>
)

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  return {
    name: community.get('name'),
    address: community.get('address'),
  }
}

export default connect(mapStateToProps)(CommunityGovernance)
