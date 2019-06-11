import React from 'react'
import { connect } from 'react-redux'
import ParameterPanelRender from './ParameterPanelRender'
import { currentUserSelector } from 'selectors/current'
import { prefixListSelector } from 'selectors/parameter'
import { loadParameters, showModal } from 'actions'
import { walletSelector } from 'selectors/wallet'

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

  showWallet() {
    const { wallet } = this.props
    if (!wallet) {
      return
    }
    wallet.showWallet()
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
    this.toggleEdit()
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
        signin={() => this.showWallet()}
        logedin={this.props.logedin}
      />
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => ({
  prefixList: prefixListSelector(state, { address: tokenAddress }).map(
    prefix => ({ value: prefix, label: prefix }),
  ),
  logedin: !!currentUserSelector(state),
  wallet: walletSelector(state),
})

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadParameters: () => dispatch(loadParameters(tokenAddress)),
  onSubmit: changes =>
    dispatch(showModal('PROPOSE', { changes, tokenAddress })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParameterPanel)
