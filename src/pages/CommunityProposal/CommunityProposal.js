import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import Breadcrumb from 'components/Breadcrumb'
import PageContainer from 'components/PageContainer'
import ProposalList from 'components/ProposalList'
import { Flex } from 'ui/common'

import { loadProposals, loadParameters } from 'actions'

class CommunityProposal extends React.Component {
  componentDidMount() {
    this.props.loadProposals()
    this.checker = setInterval(() => {
      this.props.loadProposals()
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.checker)
  }

  render() {
    const { communityAddress, name } = this.props
    return (
      <PageContainer withSidebar>
        <Breadcrumb
          links={[
            { path: `/community/${communityAddress}`, label: name },
            {
              path: `/community/${communityAddress}/proposal`,
              label: 'Proposal',
            },
          ]}
        />
        <Flex pb="50px" style={{ borderBottom: '1px solid #cbcfe3' }}>
          <ProposalList
            title={'OPEN PROPOSALS'}
            description={
              'Recently proposed change in governance parameter. Please vote before each proposal expires.'
            }
            isActive={true}
            communityAddress={communityAddress}
          />
        </Flex>
        <Flex mt="25px">
          <ProposalList
            title={'PAST PROPOSALS'}
            isActive={false}
            communityAddress={communityAddress}
          />
        </Flex>
      </PageContainer>
    )
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadProposals: () => {
    dispatch(loadParameters(communityAddress))
    dispatch(loadProposals(communityAddress))
  },
})

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  return {
    name: community.get('name'),
    address: community.get('address'),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityProposal)
