import React from 'react'
import { Flex, Button } from 'ui/common'
import styled from 'styled-components'
import ProviderListRender from './ProviderListRender'
import { communityDetailSelector } from 'selectors/communities'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { numHolders } from 'selectors/holder'
import { loadTcds, showModal } from 'actions'

const CustomButton = styled(Button).attrs({
  fontSize: '16px',
  fontWeight: 500,
  bg: '#7c84a6',
})`
  border-radius: 6px;
  transition: 0.5s all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 3px 5px 0 rgba(180, 187, 218, 0.5);
  }

  &:active {
    background-color: #626b90;
    box-shadow: 0 0px 0px 0;
  }
`

class ProviderList extends React.Component {
  state = {
    currentPage: 1,
  }

  componentDidMount() {
    console.warn('DidMount', !!this.props.user)
    if (this.props.user) {
      this.props.loadTcds()
    }
  }

  componentDidUpdate(prevProps) {
    console.warn('DidUpdate', prevProps.user !== this.props.user)
    if (prevProps.user !== this.props.user) {
      this.props.loadTcds()
    }
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { currentPage } = this.state
    const {
      user,
      symbol,
      communityAddress,
      pageSize,
      numberOfHolders,
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
            numberOfHolders={numberOfHolders}
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
    numberOfHolders: numHolders(state, {
      address: communityAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { user, communityAddress }) => ({
  user,
  loadTcds: () => dispatch(loadTcds(user, communityAddress)),
  showBeProvider: () => dispatch(showModal('BEPROVIDER')),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProviderList),
)
