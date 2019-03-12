import React from 'react'
import { connect } from 'react-redux'

import ParameterPanelRender from './ParameterPanelRender'

class ParameterPanel extends React.Component {
  state = {
    prefix: null,
    isEdit: false,
    changes: {},
  }

  componentDidMount() {
    this.props.loadParameters()
    this.setState({
      prefix: this.props.prefixList[0],
    })
  }

  onPrefixChange(newPreifx) {
    this.setState({ prefix: newPreifx, changes: {} })
  }

  toggleEdit() {
    this.setState(prevState => ({ isEdit: !prevState.isEdit, changes: {} }))
  }

  handleParameterChange(key, value) {
    this.setState(prevState => {
      if (value) {
        return {
          changes: { ...prevState.changes, [key]: value },
        }
      } else {
        delete prevState.changes[key]
        return {
          changes: { ...prevState.changes },
        }
      }
    })
  }

  submitChanges() {
    // Open modal here
    console.log('Submit changes', this.state.changes)
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
      />
    )
  }
}

const mapStateToProps = (state, { communityAddress }) => ({
  prefixList: [
    { value: 'admin', label: 'admin' },
    { value: 'tcr', label: 'tcr' },
    { value: 'core', label: 'core' },
  ],
})

const mapDispatchToProps = (dispatch, { communityAddress }) => ({
  loadParameters: () => console.log(communityAddress),
  // onSubmit:
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParameterPanel)
