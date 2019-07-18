import React from 'react'
import { debounce } from 'lodash'
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
    search: '',
    query: '',
    suggestions: [],
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

  onSearch = (e, { newValue, method }) => {
    this.setState(
      {
        search: newValue,
      },
      () => {
        // query when click
        if (method === 'click' || newValue === '') {
          this.onQuery(this.state.search)
        }
      },
    )
  }

  // query when enter
  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.onQuery(this.state.search)
    }
  }

  onQuery = debounce(val => {
    this.setState({
      currentPage: 1,
      query: val,
    })
  }, 350)

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    this.setState({
      suggestions:
        inputLength === 0
          ? []
          : this.props.providers.filter(
              provider =>
                provider.name.toLowerCase().slice(0, inputLength) ===
                inputValue,
            ),
    })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  render() {
    return (
      <DatasetActivityLogsRender
        {...this.props}
        {...this.state}
        onChangePage={this.onChangePage}
        onSearch={this.onSearch}
        onKeyPress={this.onKeyPress}
        onQuery={this.onQuery}
        onSetFilter={this.onSetFilter}
        toggleShowFilter={this.toggleShowFilter}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
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
