import React from 'react'
import { connect } from 'react-redux'
import AirdropXFNModalRender from './AirdropXFNModalRender'
import { hideModal } from 'actions'
import { currentUserSelector } from 'selectors/current'
import { bandBalanceSelector } from 'selectors/balances'

const AirdropXFNModal = props => <AirdropXFNModalRender {...props} />

const mapStateToProps = (state, props) => {
  const isLogin = currentUserSelector(state)
    ? currentUserSelector(state) !== 'NOT_SIGNIN'
    : false
  const haveBand = Number(bandBalanceSelector(state).toString()) > 0

  return {
    doneStep1: isLogin,
    doneStep2: haveBand,
  }
}

const mapDispatchToProps = dispatch => ({
  hideXFNRewardModal: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AirdropXFNModal)
