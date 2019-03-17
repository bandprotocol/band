import React from 'react'
import { connect } from 'react-redux'
import PageContainer from 'components/PageContainer'
import ProposalList from 'components/ProposalList'
import { Flex } from 'ui/common'

import { loadProposals, loadParameters } from 'actions'

class CommunityProposal extends React.Component {
  componentDidMount() {
    this.props.loadProposals()
  }
  render() {
    const { communityAddress } = this.props
    return (
      <PageContainer withSidebar>
        <Flex pb="50px" style={{ borderBottom: '1px solid #cbcfe3' }}>
          <ProposalList
            title={'Open Proposal'}
            description={
              'Recently proposed change in governance parameter. Please vote before each proposal expires.'
            }
            isActive={true}
            communityAddress={communityAddress}
          />
        </Flex>
        <Flex mt="25px">
          <ProposalList
            title={'Past Proposal'}
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

export default connect(
  null,
  mapDispatchToProps,
)(CommunityProposal)
