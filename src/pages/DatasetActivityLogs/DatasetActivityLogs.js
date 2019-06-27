import React from 'react'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import { withRouter } from 'react-router-dom'

import DatasetActivityLogsRender from './DatasetActivityLogsRender'

class DatasetActivityLogs extends React.Component {
  state = {
    currentPage: 1,
    numberOfPages: 100,

    // Filter
    showFilter: false,
    activeFilter: {},

    // Search
    search: '',
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

  onSearch = e =>
    this.setState(
      {
        search: e.target.value,
      },
      () => this.onQuery(this.state.search),
    )

  onQuery = debounce(val => {
    this.setState({
      currentPage: 1,
      query: val,
    })
  }, 350)

  render() {
    return (
      <DatasetActivityLogsRender
        {...this.props}
        {...this.state}
        onChangePage={this.onChangePage}
        onSearch={this.onSearch}
        onQuery={this.onQuery}
        onSetFilter={this.onSetFilter}
        toggleShowFilter={this.toggleShowFilter}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })

  return {
    name: community.get('name'),
    address: community.get('address'),
    symbol: community.get('symbol'),
  }
}

export default withRouter(connect(mapStateToProps)(DatasetActivityLogs))
