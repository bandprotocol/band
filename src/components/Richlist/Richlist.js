import React from 'react'

import RichlistRender from './RichlistRender'

import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { loadHolders } from 'actions'

class Richlist extends React.Component {
  state = {
    selectedOption: { value: 'all', label: 'All Orders' },
    currentPage: 1,
  }

  componentDidMount() {
    this.props.loadHolders()
  }

  onChange(selectedOption) {
    if (selectedOption.value !== this.state.selectedOption.value)
      this.setState({ selectedOption, currentPage: 1 })
    else this.setState({ selectedOption })
  }

  onChangePage(selectedPage) {
    this.setState({
      currentPage: selectedPage,
    })
  }

  render() {
    const options = [
      { value: 'all', label: 'All Orders' },
      { value: 'mine', label: 'My Orders' },
    ]
    const { selectedOption, currentPage } = this.state
    const { communityAddress, pageSize } = this.props
    return (
      <RichlistRender
        options={options}
        selectedOption={selectedOption}
        onChange={this.onChange.bind(this)}
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
