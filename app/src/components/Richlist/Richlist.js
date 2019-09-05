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
    await this.loadHolders()

    this.checker = setInterval(() => {
      this.props.loadHoldersOnPage(this.state.currentPage)
    }, 300000)
  }

  componentWillUnmount() {
    clearInterval(this.checker)
  }

  async loadHolders() {
    await this.props.loadHoldersOnPage(this.state.currentPage)
    this.setState({
      fetching: false,
    })
  }

  onChangePage(selectedPage) {
    this.setState(
      {
        currentPage: selectedPage,
        fetching: true,
      },
      async () => {
        await this.loadHolders()
      },
    )
  }

  render() {
    const { tokenAddress, pageSize, numberOfHolders } = this.props
    return (
      <RichlistRender
        {...this.state}
        numberOfHolders={numberOfHolders}
        tokenAddress={tokenAddress}
        onChangePage={this.onChangePage.bind(this)}
        pageSize={pageSize}
      />
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  return {
    numberOfHolders: numHolders(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress, pageSize }) => ({
  loadHoldersOnPage: currentPage =>
    dispatchAsync(dispatch, loadHolders(tokenAddress, currentPage, pageSize)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Richlist),
)
