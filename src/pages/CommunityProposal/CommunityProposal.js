import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import ProposalList from 'components/ProposalList'
import PageStructure from 'components/DataSetPageStructure'
import { Flex, Text, H2 } from 'ui/common'
import ProposalHeader from 'images/proposal-header.svg'
import DataHeader from 'components/DataHeader'

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
    const { tokenAddress, name } = this.props
    return (
      <PageStructure
        name={name}
        communityAddress={tokenAddress}
        breadcrumb={{ path: 'proposal', label: 'Proposal' }}
        renderHeader={() => (
          <DataHeader
            lines={[
              'Parameter Change Proposals:',
              'Somebody Wants Smart Contract to Behave Differently',
              'Community agrees on how smart contracts work though parameters.',
              'Any token holder can vote to agree or disagree with a change.',
            ]}
          />
        )}
        noSubheader
        headerImage={ProposalHeader}
        {...this.props}
      >
        <Flex pb="50px" style={{ borderBottom: '1px solid #cbcfe3' }}>
          <ProposalList
            title={'Open Proposals'}
            description={
              'Recently proposed change in governance parameter. Please vote before each proposal expires.'
            }
            isActive={true}
            tokenAddress={tokenAddress}
          />
        </Flex>
        <Flex mt="25px">
          <ProposalList
            title={'Past Proposals'}
            isActive={false}
            tokenAddress={tokenAddress}
          />
        </Flex>
      </PageStructure>
    )
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadProposals: () => {
    dispatch(loadParameters(tokenAddress))
    dispatch(loadProposals(tokenAddress))
  },
})

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  if (!community) return {}

  return {
    name: community.get('name'),
    address: community.get('address'),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityProposal)
