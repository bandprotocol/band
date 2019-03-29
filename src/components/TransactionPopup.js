import React from 'react'
import { connect } from 'react-redux'

import { Flex, Box, Text } from 'ui/common'
import styled from 'styled-components'
import PendingTransaction from 'components/PendingTransaction'

import { allTxsSelector } from 'selectors/transaction'

const Container = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 366px;
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
  line-height: 30px;
  background: #8868ff;
  cursor: pointer;
  transition: background 250ms;
  &:hover {
    background: #6253d4;
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

  hideTxns() {
    this.props.hideTxns(this.props.txns.map(tx => tx.txHash))
  }

  toggleExpand(e) {
    e.stopPropagation()
    window.localStorage.setItem('TransactionPopup:expand', !this.state.expand)
    this.setState({ expand: !this.state.expand })
  }

  render() {
    const { txns } = this.props
    return txns ? (
      <Container show={!!txns.length}>
        <MainBar onClick={this.toggleExpand.bind(this)}>
          <Text color="#ffffff" size={14}>
            Transactions ({txns.length})
          </Text>
          <Box flex={1} />
          <Box ml={2}>
            <Text color="#ffffff" size={24}>
              <i
                className={
                  this.state.expand ? 'ion ion-md-remove' : 'ion ion-ios-expand'
                }
              />
            </Text>
          </Box>
          <Box ml={3} onClick={this.hideTxns.bind(this)}>
            <Text color="#ffffff" size={24}>
              <i className="ion ion-md-close" />
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

const mapStateToProps = state => ({
  txns: allTxsSelector(state),
})

export default connect(mapStateToProps)(TransactionPopup)
