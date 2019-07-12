import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import ProposalList from 'components/ProposalList'
import PageStructure from 'components/DataSetPageStructure'
import { Flex, Text, H2 } from 'ui/common'
import ProposalHeader from 'images/proposal-header.svg'

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
          <Flex
            flexDirection="column"
            pl="52px"
            width="100%"
            style={{ height: '100%' }}
            justifyContent="center"
          >
            <H2 width="50%" style={{ lineHeight: '38px' }}>
              Proposal
            </H2>
            {/* TODO: */}
            <Text
              mt="13px"
              fontSize="18px"
              color="white"
              fontWeight="500"
              width="60%"
              style={{ lineHeight: '28px' }}
            >
              Spicy jalapeno bacon ipsum dolor amet meatball t-bone brisket,
              shank ground round tail strip steak tongue filet mignon hamburger.
              Cow drumstick ham pork turkey. wine pork loin shank kielbasa.
            </Text>
          </Flex>
        )}
        noSubheader
        headerImage={ProposalHeader}
        {...this.props}
      >
        <Flex pb="50px" style={{ borderBottom: '1px solid #cbcfe3' }}>
          <ProposalList
            title={'OPEN PROPOSALS'}
            description={
              'Recently proposed change in governance parameter. Please vote before each proposal expires.'
            }
            isActive={true}
            tokenAddress={tokenAddress}
          />
        </Flex>
        <Flex mt="25px">
          <ProposalList
            title={'PAST PROPOSALS'}
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
