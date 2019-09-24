import React from 'react'
import { Flex } from 'rebass'
import Select from 'react-select'
import {
  getCurrentNetworkOption,
  networkOptions,
  getNetworkIndex,
} from 'utils/network'
import { setNetwork, dumpCurrent } from 'actions'
import { currentNetworkSelector } from 'selectors/current'
import { connect } from 'react-redux'

const dot = (color = '#ccc') => ({
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: '50%',
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: '6px',
    width: '6px',
  },
})

const selectStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: '#3c55f9',
    border: '0px',
    width: '200px',
    minHeight: '25px',
    borderRadius: '17.5px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    padding: '0px 5px',
    color: '#ffffff',
    width: '90%',
    height: '70%',
    '&:hover': {
      color: '#ffffff',
    },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#3c55f9',
    zIndex: 3,
  }),
  option: (styles, { data }) => ({
    ...styles,
    fontSize: '10px',
    color: '#ffffff',
    backgroundColor: '#3c55f9',
    '&:hover': {
      backgroundColor: '#2438b7',
    },
    ...dot(data.color),
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    fontSize: '10px',
    fontWeight: '500',
    display: 'flex',
    width: '100%',
    color: '#ffffff',
    justifyContent: 'center',
    ...dot(data.color),
  }),
}

export class NetworkSelect extends React.Component {
  state = {
    currentOption: getCurrentNetworkOption(),
  }

  handleChangeOption(newOption) {
    const { setNetwork } = this.props
    this.setState({
      currentOption: newOption,
    })
    setNetwork(newOption['value'])
  }

  render() {
    const networkIndex = getNetworkIndex(this.props.currentNetwork)

    console.log(networkIndex, networkOptions[networkIndex])
    return (
      <Flex width="100%" justifyContent="center" alignItems="center">
        <Select
          options={networkOptions}
          value={this.state.currentOption}
          defaultValue={networkOptions[networkIndex]}
          styles={selectStyles}
          isSearchable={false}
          onChange={this.handleChangeOption.bind(this)}
        />
        {/* {noOption && (
          <Flex
            alignItems="center"
            style={{
              position: 'absolute',
              minWidth: '70%',
              minHeight: '100%',
            }}
          >
            <Flex
              bg="#3c55f9"
              style={{
                position: 'absolute',
                right: '20px',
                minWidth: '20px',
                minHeight: '40%',
              }}
            />
          </Flex>
        )} */}
      </Flex>
    )
  }
}

const mapStateToProps = state => {
  return { currentNetwork: currentNetworkSelector(state) }
}

const mapDispatchToProps = (dispatch, props) => ({
  setNetwork: network => {
    dispatch(setNetwork(network))
    dispatch(dumpCurrent())
    window.location.reload()
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkSelect)
