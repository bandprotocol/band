import React from 'react'
import { Flex, Button } from 'ui/common'
import styled from 'styled-components'
import ProviderListRender from './ProviderListRender'
import { communityDetailSelector } from 'selectors/communities'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { numDataProviders } from 'selectors/tcd'
import { loadTcds, showModal } from 'actions'
import { dispatchAsync } from 'utils/reduxSaga'

const CustomButton = styled(Button).attrs({
  fontSize: '16px',
  fontWeight: 500,
  variant: 'blue',
  px: '17px',
})`
  padding: 9px 17px;
`

class ProviderList extends React.Component {
  state = {
    currentPage: 1,
    fetching: true,
  }

  async componentDidMount() {
    await this.props.loadTcds()
    this.setState({
      fetching: false,
    })
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { currentPage, fetching } = this.state
    const {
      user,
      symbol,
      communityAddress,
      pageSize,
      numDataProviders,
      showBeProvider,
    } = this.props
    // console.warn(this.props)
    return (
      <Flex
        style={{ borderRadius: '10px' }}
        flexDirection="column"
        bg="white"
        width={1}
      >
        <Flex width={1} flexDirection="row" py="20px" px="30px">
          <Flex width={1} justifyContent="flex-end">
            <Flex
              style={{
                cursor: 'pointer',
                height: '40px',
              }}
            >
              <CustomButton onClick={() => showBeProvider()}>
                Become a provider
              </CustomButton>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <ProviderListRender
            user={user}
            symbol={symbol}
            fetching={fetching}
            numDataProviders={numDataProviders}
            communityAddress={communityAddress}
            currentPage={currentPage}
            onChangePage={this.onChangePage.bind(this)}
            pageSize={pageSize}
          />
        </Flex>
      </Flex>
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })
  return {
    symbol: community && community.get('symbol'),
    numDataProviders: numDataProviders(state, {
      address: communityAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { user, communityAddress }) => ({
  user,
  loadTcds: () => dispatchAsync(dispatch, loadTcds(user, communityAddress)),
  showBeProvider: () => dispatch(showModal('BEPROVIDER')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProviderList),
)
