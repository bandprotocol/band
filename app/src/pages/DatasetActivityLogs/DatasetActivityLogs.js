import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import { tcdsSelector } from 'selectors/tcd'
import { withRouter } from 'react-router-dom'
import { getTCDInfomation } from 'utils/tcds'
import { getProvider } from 'data/Providers'

import DatasetActivityLogsRender from './DatasetActivityLogsRender'

class DatasetActivityLogs extends React.Component {
  state = {
    currentPage: 1,
    numberOfPages: 10,

    // Filter
    showFilter: false,
    activeFilter: {},

    // Search
    query: '',
  }

  componentDidMount() {
    // Load Logs from selector
  }

  toggleShowFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter,
    })
  }

  onSetFilter = (filter, val) => {
    if (filter === 'ALL') {
      this.setState({
        currentPage: 1,
        activeFilter: {
          reported: !val,
          broadcasted: !val,
        },
      })
    } else {
      this.setState({
        currentPage: 1,
        activeFilter: {
          [filter]: val,
        },
      })
    }
  }

  onChangePage = page => {
    this.setState({
      currentPage: page,
    })
  }

  onQuery = val => {
    this.setState({
      currentPage: 1,
      query: val,
    })
  }

  render() {
    return (
      <DatasetActivityLogsRender
        {...this.props}
        {...this.state}
        onChangePage={this.onChangePage}
        onQuery={this.onQuery}
        onSetFilter={this.onSetFilter}
        toggleShowFilter={this.toggleShowFilter}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress, tcdAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  const tcd = tcdsSelector(state, { address: communityAddress, tcdAddress })

  return {
    name: community.get('name'),
    address: community.get('address'),
    symbol: community.get('symbol'),
    tcdName: tcd && getTCDInfomation(tcd.toJS().prefix).label,
    providers:
      tcd &&
      tcd.toJS().providers.map(address => {
        return {
          name: getProvider(address).name,
        }
      }),
  }
}

export default withRouter(connect(mapStateToProps)(DatasetActivityLogs))
