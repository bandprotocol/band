import React from 'react'
import Autosuggest from 'react-autosuggest'
import { withRouter } from 'react-router-dom'
import { Box, Image, Flex } from 'ui/common'
import SearchInputIconSrc from 'images/search-input-icon.svg'

const SearchBox = props => (
  <Box style={{ position: 'relative' }}>
    <Autosuggest {...props} />
    <Image
      src={SearchInputIconSrc}
      style={{
        position: 'absolute',
        right: 15,
        top: 8,
      }}
      width={18}
    />
  </Box>
)

class AutocompletedSearch extends React.Component {
  state = {
    suggestions: [],
    search: '',
  }

  // remove current search when change route
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState(
        {
          suggestion: [],
          search: '',
        },
        () => {
          this.props.onQuery(this.state.search)
        },
      )
    }
  }

  onSearch = (e, { newValue, method }) => {
    this.setState(
      {
        search: newValue,
      },
      () => {
        // query when click or clear input
        if (method === 'click' || this.state.search === '') {
          this.props.onQuery(this.state.search)
        }
      },
    )
  }

  // query when enter
  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.onQuery(this.state.search)
    }
  }

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    this.setState({
      suggestions:
        inputLength === 0
          ? []
          : this.props.data.filter(
              each => each.toLowerCase().slice(0, inputLength) === inputValue,
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
    console.log('debug state', this.state)
    console.log('debug props', this.props)
    return (
      <SearchBox
        suggestions={this.state.suggestions}
        // onSuggestionSelected={(...e) => console.log('clicked', ...e)}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion}
        renderSuggestion={suggestion => (
          <Flex fontSize="13px">{suggestion}</Flex>
        )}
        inputProps={{
          placeholder: 'Search',
          value: this.state.search,
          onChange: this.onSearch,
          onKeyPress: this.onKeyPress,
        }}
      />
    )
  }
}

export default withRouter(AutocompletedSearch)
