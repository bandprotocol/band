import React from 'react'
import { Flex } from 'ui/common'
import Select from 'react-select'
import _ from 'lodash'

const selectStyles = (width = '150px') => ({
  control: (styles, { isDisabled }) => ({
    ...styles,
    border: isDisabled ? '1px solid #cccccc' : '1px solid #718bff',
    width,
    borderRadius: '4px',
    justifyContent: 'center',
  }),
  option: styles => ({
    ...styles,
    fontSize: '11px',
  }),
  singleValue: styles => ({
    ...styles,
    fontSize: '11px',
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: '13px',
    color: 'grey',
  }),
})

export default class NetworkSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOption: null,
    }
    this.debounce = _.debounce(props.onSearch, 500)
  }

  handleChangeOption(newOption) {
    this.setState({
      currentOption: newOption,
    })
    this.debounce(newOption ? newOption.value : null)
  }

  render() {
    const { placeholder = 'search...', options } = this.props
    return (
      <Flex width="100%" justifyContent="center" alignItems="center">
        <Select
          options={options}
          value={this.state.currentOption}
          placeholder={placeholder}
          styles={selectStyles()}
          isClearable
          isSearchable={false}
          onChange={this.handleChangeOption.bind(this)}
        />
      </Flex>
    )
  }
}
