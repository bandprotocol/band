import React from 'react'
import { Flex, Button, Text } from 'ui/common'
import styled from 'styled-components'
import ProviderListRender from './ProviderListRender'
import { communityDetailSelector } from 'selectors/communities'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { numDataProviders } from 'selectors/tcd'
import { loadTcds, showModal } from 'actions'
import { dispatchAsync } from 'utils/reduxSaga'

const CustomButton = styled(Button).attrs({
  variant: 'blue',
})`
  font-size: 16px;
  font-weight: 900;
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
    this.checker = setInterval(() => {
      this.props.loadTcds()
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.checker)
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
      tokenAddress,
      pageSize,
      numDataProviders,
      showBeProvider,
    } = this.props
    return (
      <Flex
        style={{
          borderRadius: '10px',
          boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
        }}
        flexDirection="column"
        bg="white"
        width={1}
      >
        <Flex
          width={1}
          flexDirection="row"
          py="10px"
          px="20px"
          alignItems="center"
        >
          <Text
            fontSize="18px"
            fontWeight="900"
            color="#393939"
            width="190px"
            ml="10px"
          >
            Data Providers
          </Text>
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
            tokenAddress={tokenAddress}
            currentPage={currentPage}
            onChangePage={this.onChangePage.bind(this)}
            pageSize={pageSize}
          />
        </Flex>
      </Flex>
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  return {
    symbol: community && community.get('symbol'),
    numDataProviders: numDataProviders(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { user, tokenAddress }) => ({
  user,
  loadTcds: () => dispatchAsync(dispatch, loadTcds(user, tokenAddress)),
  showBeProvider: () => dispatch(showModal('BEPROVIDER')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProviderList),
)
