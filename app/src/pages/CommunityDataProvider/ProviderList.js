import React from 'react'
import { Flex, Button, H3 } from 'ui/common'
import styled from 'styled-components'
import ProviderListRender from './ProviderListRender'
import { communityDetailSelector } from 'selectors/communities'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { numDataProviders } from 'selectors/tcd'
import { loadTcds, showModal } from 'actions'
import { dispatchAsync } from 'utils/reduxSaga'
import { FormattedMessage } from 'react-intl'

const CustomButton = styled(Button).attrs({
  variant: 'gradientBlue',
})`
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
  height: 34px;
  padding: 0 18px 4px;
  align-self: flex-end;
  margin-bottom: 2px;
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
      tcdAddress,
      pageSize,
      numDataProviders,
      showBeProvider,
    } = this.props
    return (
      <Flex
        style={{
          borderRadius: '10px',
          boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
        flexDirection="column"
        bg="white"
        width={1}
      >
        <Flex
          width={1}
          flexDirection="row"
          pt="15px"
          pb="10px"
          px="36px"
          pr="26px"
          alignItems="center"
        >
          <H3 flex="0 0 auto" color="#4a4a4a">
            <FormattedMessage id="Data Providers"></FormattedMessage>
          </H3>
          <Flex width={1} justifyContent="flex-end">
            <Flex
              style={{
                cursor: 'pointer',
                height: '40px',
              }}
            >
              <CustomButton onClick={() => showBeProvider()}>
                <FormattedMessage id="Become a provider"></FormattedMessage>
              </CustomButton>
            </Flex>
          </Flex>
        </Flex>
        <ProviderListRender
          user={user}
          symbol={symbol}
          fetching={fetching}
          numDataProviders={numDataProviders}
          tokenAddress={tokenAddress}
          tcdAddress={tcdAddress}
          currentPage={currentPage}
          onChangePage={this.onChangePage.bind(this)}
          pageSize={pageSize}
        />
      </Flex>
    )
  }
}

const mapStateToProps = (state, { tokenAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  return {
    symbol: community && community.get('symbol'),
    numDataProviders: numDataProviders(state, {
      address: tokenAddress,
      tcdAddress,
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
