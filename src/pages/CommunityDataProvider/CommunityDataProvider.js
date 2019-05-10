import React from 'react'
import { connect } from 'react-redux'
import colors from 'ui/colors'
import PageContainer from 'components/PageContainer'
import ProviderList from './ProviderList'
import ToolTip from 'components/ToolTip'
import { currentUserSelector } from 'selectors/current'
import { Flex, Text } from 'ui/common'

class CommunityDataProvider extends React.Component {
  render() {
    const { user, communityAddress } = this.props
    return (
      <PageContainer withSidebar>
        <Flex flexDirection="row">
          <Flex justifyContent="center" alignItems="center">
            <Flex mr="10px" mb="3px">
              <Text fontFamily="Avenir-Heavy" color="#4a4a4a" fontSize="24px">
                Data providers
              </Text>
            </Flex>
            <ToolTip
              bg={colors.text.grey}
              width="410px"
              textBg="#b2b6be"
              textColor={colors.text.normal}
              bottom={20}
              left={20}
              tip={{ left: 21 }}
            >
              Token holders collectively curate trustworthy data providers. By
              staking their tokens, they earn a portion of fee from the
              providers. The more people stake, the more secure the data
              endpoint becomes.
            </ToolTip>
          </Flex>
        </Flex>
        <Flex mt="30px">
          <ProviderList
            user={user}
            communityAddress={communityAddress}
            pageSize={10}
          />
        </Flex>
      </PageContainer>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: currentUserSelector(state),
  }
}

export default connect(mapStateToProps)(CommunityDataProvider)
