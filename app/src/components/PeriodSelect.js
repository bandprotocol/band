import React from 'react'
import { Flex } from 'ui/common'
import Select from 'react-select'

const selectStyles = (width = '100px') => ({
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
    fontSize: '12px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  singleValue: styles => ({
    ...styles,
    fontSize: '14px',
    minHeight: '12px',
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

const timeOptions = [
  {
    value: {
      amount: 1,
      unit: 'day',
      limit: 30,
    },
    label: '1 day',
  },
  {
    value: {
      amount: 1,
      unit: 'month',
      limit: 40,
    },
    label: '1 month',
  },
  {
    value: {
      amount: 2,
      unit: 'month',
      limit: 50,
    },
    label: '2 months',
  },
]

export default class TimeSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOption: timeOptions[0],
    }
  }

  handleChangeOption(newOption) {
    this.setState({
      currentOption: newOption,
    })
    this.props.onSelect(newOption.value)
  }

  render() {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Select
          options={timeOptions}
          value={this.state.currentOption}
          styles={selectStyles()}
          isSearchable={false}
          onChange={this.handleChangeOption.bind(this)}
        />
      </Flex>
    )
  }
}
