import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'

import DatasetActivityLogsRender from './DatasetActivityLogsRender'

class DatasetActivityLogs extends React.Component {
  state = {
    currentPage: 1,
    numberOfPages: 10,

    // Filter
    showFilter: false,
    activeFilter: {},
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
    if (filter === 'all') {
      this.setState({
        activeFilter: {
          reported: !val,
          broadcasted: !val,
        },
      })
    } else {
      this.setState({
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

  render() {
    return (
      <DatasetActivityLogsRender
        {...this.props}
        {...this.state}
        onChangePage={this.onChangePage}
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
  }
}

export default connect(mapStateToProps)(DatasetActivityLogs)
