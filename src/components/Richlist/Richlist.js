import React from 'react'

import RichlistRender from './RichlistRender'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { loadHolders } from 'actions'

class Richlist extends React.Component {
  state = {
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadHolders()
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const { currentPage } = this.state
    const { communityAddress, pageSize } = this.props
    return (
      <RichlistRender
        communityAddress={communityAddress}
        currentPage={currentPage}
        onChangePage={this.onChangePage.bind(this)}
        pageSize={pageSize}
      />
    )
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadHolders: () => dispatch(loadHolders(communityAddress)),
})
export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(Richlist),
)
