import React from 'react'
import { connect } from 'react-redux'
import ClaimXFNModalRender from './ClaimXFNModalRender'
import { hideModal } from 'actions'
import { walletSelector } from 'selectors/wallet'

class ClaimXFNModal extends React.Component {
  getXFNAmount = async () => {
    console.log('getXFNAmount')
  }

  claim = async () => {
    console.log('claim')
  }

  render() {
    return (
      <ClaimXFNModalRender
        {...this.props}
        getXFNAmount={this.getXFNAmount}
        claim={this.claim}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    wallet: walletSelector(state),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideLogin: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimXFNModal)
