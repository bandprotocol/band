import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Text } from 'ui/common'
import styled from 'styled-components'
import PendingTransaction from 'components/PendingTransaction'
import { txIncludePendingSelector } from 'selectors/transaction'
import { transactionHiddenSelector } from 'selectors/transaction'
import { hideTxs } from 'actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Container = styled(Box)`
  position: fixed;
  bottom: 0;
  right: 10px;
  width: 330px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  overflow: hidden;
  max-height: 500px;
  z-index: 20;
  transform: translateY(${p => (p.show ? 0 : 100)}%);
  background-color: #ffffff;
`

const TxnContainer = styled(Box)`
  height: 10000vh;
  max-height: ${p => p.maxHeight || 0};
  transition: max-height 500ms;
  overflow: hidden;
`

const MainBar = styled(Flex)`
  padding: 0 12px;
  line-height: 36px;
  background: #5973e7;
  cursor: pointer;
  transition: background 250ms;
  &:hover {
    background: #2741b4;
  }
`

class TransactionPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expand:
        window.localStorage.getItem('TransactionPopup:expand') !== 'false',
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.txns &&
      this.props.txns &&
      prevProps.txns.length !== this.props.txns.length
    ) {
      this.setState({ expand: true })
    }
  }

  toggleExpand(e) {
    e.stopPropagation()
    window.localStorage.setItem('TransactionPopup:expand', !this.state.expand)
    this.setState({ expand: !this.state.expand })
  }

  hideTxns(e) {
    e.stopPropagation()
    this.props.hideTxns()
  }

  render() {
    const { txns } = this.props
    return txns ? (
      <Container show={!!txns.length}>
        <MainBar onClick={this.toggleExpand.bind(this)}>
          <Text fontWeight="600" color="#ffffff" size={13}>
            Transactions ({txns.length})
          </Text>
          <Box flex={1} />
          <Box ml={2} style={{ cursor: 'pointer' }}>
            <Text color="#ffffff" size={24}>
              <i
                className={
                  this.state.expand ? 'ion ion-md-remove' : 'ion ion-ios-expand'
                }
              />
            </Text>
          </Box>
          <Box
            ml={3}
            onClick={this.hideTxns.bind(this)}
            style={{ cursor: 'pointer' }}
          >
            <Text color="#ffffff" size={24}>
              <FontAwesomeIcon icon={faTimes} />
            </Text>
          </Box>
        </MainBar>
        <TxnContainer
          maxHeight={this.state.expand ? `${txns.length * 95}px` : 0}
        >
          {txns.map((txn, i) => (
            <PendingTransaction key={i} {...txn} />
          ))}
        </TxnContainer>
      </Container>
    ) : (
      <Box />
    )
  }
}

const mapStateToProps = state => {
  const txs = txIncludePendingSelector(state)
  const hiddenTxs = transactionHiddenSelector(state)
  if (txs && hiddenTxs) {
    return {
      txns: txs.filter(tx => !hiddenTxs.has(tx.txHash)),
    }
  }

  if (txs) {
    return {
      txns: txs,
    }
  } else {
    return {
      txns: [],
    }
  }
}

const mapDispatchToProps = dispatch => ({
  hideTxns: () => dispatch(hideTxs()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionPopup)
