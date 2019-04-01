import React from 'react'

import RichlistRender from './RichlistRender'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { numHolders } from 'selectors/holder'
import { loadHolders } from 'actions'

class Richlist extends React.Component {
  state = {
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadHolders()
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { currentPage } = this.state
    const { communityAddress, pageSize, numberOfHolders } = this.props
    return (
      <RichlistRender
        numberOfHolders={numberOfHolders}
        communityAddress={communityAddress}
        currentPage={currentPage}
        onChangePage={this.onChangePage.bind(this)}
        pageSize={pageSize}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => {
  return {
    numberOfHolders: numHolders(state, {
      address: communityAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadHolders: () => dispatch(loadHolders(communityAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Richlist),
)
