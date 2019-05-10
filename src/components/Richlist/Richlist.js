import React from 'react'
import RichlistRender from './RichlistRender'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { numHolders } from 'selectors/holder'
import { loadHolders } from 'actions'
import { dispatchAsync } from 'utils/reduxSaga'

class Richlist extends React.Component {
  state = {
    currentPage: 1,
    fetching: true,
  }

  async componentDidMount() {
    await this.props.loadHolders()
    this.setState({
      fetching: false,
    })
    this.checker = setInterval(() => {
      this.props.loadHolders()
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
    const { communityAddress, pageSize, numberOfHolders } = this.props
    return (
      <RichlistRender
        {...this.state}
        numberOfHolders={numberOfHolders}
        communityAddress={communityAddress}
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
  loadHolders: () => dispatchAsync(dispatch, loadHolders(communityAddress)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Richlist),
)
