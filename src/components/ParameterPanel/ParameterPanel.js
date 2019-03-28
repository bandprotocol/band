import React from 'react'
import { connect } from 'react-redux'

import ParameterPanelRender from './ParameterPanelRender'

import { currentUserSelector } from 'selectors/current'

import { prefixListSelector } from 'selectors/parameter'
import { loadParameters, showModal } from 'actions'

class ParameterPanel extends React.Component {
  state = {
    prefix: null,
    isEdit: false,
    changes: {},
  }

  componentDidMount() {
    this.props.loadParameters()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.prefixList !== prevProps.prefixList &&
      this.state.prefix === null
    ) {
      this.setState({
        prefix:
          this.props.prefixList.length > 0 ? this.props.prefixList[0] : null,
      })
    }
  }

  onPrefixChange(newPreifx) {
    this.setState({ prefix: newPreifx, changes: {} })
  }

  toggleEdit() {
    this.setState(prevState => ({ isEdit: !prevState.isEdit, changes: {} }))
  }

  handleParameterChange(key, value) {
    console.log(key, value)
    this.setState(prevState => {
      if (value) {
        return {
          changes: {
            ...prevState.changes,
            [this.state.prefix.value + ':' + key]: value,
          },
        }
      } else {
        delete prevState.changes[this.state.prefix.value + ':' + key]
        return {
          changes: { ...prevState.changes },
        }
      }
    })
  }

  submitChanges() {
    this.props.onSubmit(this.state.changes)
  }

  render() {
    return (
      <ParameterPanelRender
        currentPrefix={this.state.prefix}
        onChangePrefix={this.onPrefixChange.bind(this)}
        toggleEdit={this.toggleEdit.bind(this)}
        isEdit={this.state.isEdit}
        handleParameterChange={this.handleParameterChange.bind(this)}
        submitChanges={this.submitChanges.bind(this)}
        prefixList={this.props.prefixList}
        signin={this.props.signin}
        logedin={this.props.logedin}
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => {
  // console.log(state)
  return {
    prefixList: prefixListSelector(state, { address: communityAddress }).map(
      prefix => ({ value: prefix, label: prefix }),
    ),
    logedin: !!currentUserSelector(state),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadParameters: () => dispatch(loadParameters(communityAddress)),
  onSubmit: changes =>
    dispatch(showModal('PROPOSE', { changes, communityAddress })),
  signin: () => dispatch(showModal('LOGIN', {})),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParameterPanel)
