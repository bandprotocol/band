import React from 'react'
import { Flex } from 'rebass'
import Select from 'react-select'
import {
  getCurrentNetworkOption,
  networkOptions,
  getNetworkIndex,
} from 'utils/network'
import { setNetwork, dumpCurrent } from 'actions'
import { currentNetworkSelector, currentUserSelector } from 'selectors/current'
import { connect } from 'react-redux'

const selectStyles = isLogin => ({
  control: styles => ({
    ...styles,
    backgroundColor: isLogin ? '#7d8dfa' : '#3c55f9',
    border: '0px',
    width: '140px',
    minHeight: '25px',
    borderRadius: '17.5px',
    cursor: 'pointer',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#3c55f9',
    zIndex: 3,
  }),
  option: styles => ({
    ...styles,
    fontSize: '10px',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#3c55f9',
    '&:hover': {
      backgroundColor: '#2438b7',
    },
  }),
  singleValue: styles => ({
    ...styles,
    fontSize: '10px',
    fontWeight: '500',
    display: 'flex',
    width: '90%',
    color: '#ffffff',
    justifyContent: 'center',
  }),
})

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
    const { user } = this.props
    const isLogin = user && user.length === 42

    return (
      <Flex width="100%" justifyContent="center" alignItems="center">
        <Select
          options={networkOptions}
          value={this.state.currentOption}
          defaultValue={networkOptions[networkIndex]}
          styles={selectStyles(isLogin)}
          isSearchable={false}
          onChange={this.handleChangeOption.bind(this)}
          // if user login, disable it.
          isDisabled={isLogin}
        />
      </Flex>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: currentUserSelector(state),
    currentNetwork: currentNetworkSelector(state),
  }
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
