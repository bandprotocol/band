import React from 'react'
import { connect } from 'react-redux'
import { communityDetailSelector } from 'selectors/communities'
import { loadParameters, showModal } from 'actions'
import { walletSelector } from 'selectors/wallet'
import { currentUserSelector } from 'selectors/current'
import { prefixListSelector } from 'selectors/parameter'
import CommunityParameterRender from './CommunityParameterRender'

class CommunityParameter extends React.Component {
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
      <CommunityParameterRender
        {...this.props}
        currentPrefix={this.state.prefix}
        isEdit={this.state.isEdit}
        onChangePrefix={this.onPrefixChange.bind(this)}
        toggleEdit={this.toggleEdit.bind(this)}
        handleParameterChange={this.handleParameterChange.bind(this)}
        submitChanges={this.submitChanges.bind(this)}
        signin={() => this.showWallet()}
      />
    )
  }
}

const mapStateToProps = (state, { tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  if (!community) return {}

  return {
    name: community.get('name'),
    prefixList: prefixListSelector(state, { address: tokenAddress }).map(
      prefix => ({ value: prefix, label: prefix }),
    ),
    logedin: !!currentUserSelector(state),
    wallet: walletSelector(state),
  }
}

const mapDispatchToProps = (dispatch, { tokenAddress }) => ({
  loadParameters: () => dispatch(loadParameters(tokenAddress)),
  onSubmit: changes =>
    dispatch(showModal('PROPOSE', { changes, tokenAddress })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityParameter)
