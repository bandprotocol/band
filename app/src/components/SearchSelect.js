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
    minHeight: 25,
  }),
  option: styles => ({
    ...styles,
    fontSize: '11px',
  }),
  indicatorSeparator: styles => ({
    display: 'none',
  }),
  singleValue: styles => ({
    ...styles,
    fontSize: '11px',
    minHeight: '10px',
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: '13px',
    color: 'grey',
  }),
  dropdownIndicator: styles => ({
    ...styles,
    padding: '0px 5px 0px 0px',
    width: '90%',
    height: '70%',
  }),
  clearIndicator: styles => ({
    ...styles,
    width: '90%',
    height: '70%',
    padding: '0',
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
    this.debounce(newOption ? newOption.value[0] : null)
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
