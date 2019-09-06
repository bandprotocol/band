import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { hideModal, tcdDeposit, tcdWithdraw } from 'actions'
import { Flex, Button, Text } from 'ui/common'
import { communityDetailSelector } from 'selectors/communities'
import { remainingTokenByTCDSelector } from 'selectors/balances'
import {
  communityBalanceSelector,
  tokenLockByTCDSelector,
} from 'selectors/balances'
import BN from 'utils/bignumber'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const BgCard = styled(Flex).attrs({
  bg: 'white',
  flexDirection: 'column',
})`
  width: 400px;
  height: 281px;
  border-radius: 6px;
  box-shadow: 0 12px 23px 0 rgba(0, 0, 0, 0.13);
`

const MaxButton = styled(Button).attrs({
  width: '35px',
})`
  font-size: 12px;

  font-family: Avenir-Medium;
  height: 20px;
  align-items: center;
  margin: 0 10px;
  padding: 0 0;
  border-radius: 6px;
  transition: 0.5s all;
  cursor: ${props => (props.isMax ? 'default' : 'pointer')};
  background-color: ${props => (props.isMax ? '#7c84a6' : '#5973e7')};
  opacity: ${props => (props.isMax ? 0.2 : 1)};
`

const CustomButton = styled(Button).attrs({
  fontSize: '16px',
  fontWeight: 500,
  width: '120px',
})`
  border-radius: 6px;
  transition: 0.5s all;
  cursor: ${props => (props.isValidInput ? 'pointer' : 'default')};
  background-color: ${props => (props.isValidInput ? '#7c84a6' : '#e3e6ef')};

  ${props =>
    props.isValidInput &&
    `&:hover {
    box-shadow: 0 3px 5px 0 rgba(180, 187, 218, 0.5);
  }`}

  ${props =>
    props.isValidInput &&
    `&:active {
    background-color: #626b90;
    box-shadow: 0 0px 0px 0;
  }`}
`

const Input = styled.input`
  width: 341px;
  height: 35px;
  border-radius: 3px;
  border: solid 1px #e7ecff;
  padding: 0px 10px;
`

class DepositWithdrawModal extends React.Component {
  state = {
    value: '',
    valueOnChain: new BN(0),
    isValidInput: false,
    errorMessage: null,
  }

  componentDidMount() {
    this.setState({ ...this.state, ...this.props })
  }

  updateValue(newValue) {
    let newValueOnChain = new BN(0)
    try {
      newValueOnChain = BN.parse(parseFloat(newValue))
    } catch (e) {
      console.warn(e)
    }
    this.setState(
      {
        value: newValue,
        valueOnChain: newValueOnChain,
      },
      () => {
        this.setState({
          isValidInput: this.verifyValueOnChain(newValueOnChain),
        })
      },
    )
  }

  verifyValueOnChain(valueOnChain) {
    const { value, actionType } = this.state
    if (value === '') {
      this.setState({ errorMessage: null })
      return false
    }
    if (isNaN(value)) {
      this.setState({ errorMessage: 'amount of tokens should be a number' })
      return false
    }
    if (valueOnChain.isZero() || valueOnChain.isNeg()) {
      this.setState({
        errorMessage: "token's amount should be greater than zero",
      })
      return false
    }
    if (actionType === 'DEPOSIT') {
      const { balance, remainingToken } = this.state
      if (!BN.isBN(balance)) {
        this.setState({
          errorMessage: "token's balance is invalid",
        })
        return false
      }
      if (valueOnChain.gt(remainingToken)) {
        this.setState({
          errorMessage:
            'deposit amount should be equal or less than your token balance',
        })
        return false
      }
    } else {
      const { userOwnership, totalOwnership, stake } = this.state
      if (!BN.isBN(totalOwnership) || !BN.isBN(stake) || stake.isZero()) {
        this.setState({
          errorMessage: 'total ownership or total stake is invalid',
        })
        return false
      }
      const withdrawOwnershipAmount = valueOnChain
        .mul(totalOwnership)
        .div(stake)

      if (
        !BN.isBN(userOwnership) ||
        withdrawOwnershipAmount.gt(userOwnership)
      ) {
        this.setState({
          errorMessage: "can't be able to withdraw more than your ownership",
        })
        return false
      }
    }
    this.setState({ errorMessage: null })
    return true
  }

  deposit() {
    const {
      dataSourceAddress,
      tcdAddress,
      dispatchDeposit,
      valueOnChain,
    } = this.state
    if (this.verifyValueOnChain(valueOnChain)) {
      dispatchDeposit(tcdAddress, dataSourceAddress, this.state.valueOnChain)
    }
  }

  withdraw() {
    const {
      dataSourceAddress,
      tcdAddress,
      dispatchWithdraw,
      valueOnChain,
      totalOwnership,
      stake,
      value,
    } = this.state
    if (this.verifyValueOnChain(valueOnChain)) {
      const withdrawOwnershipAmount = valueOnChain
        .mul(totalOwnership)
        .div(stake)
      dispatchWithdraw(
        tcdAddress,
        dataSourceAddress,
        withdrawOwnershipAmount,
        value,
      )
    }
  }

  render() {
    const {
      symbol,
      actionType,
      hideDepositWithdraw,
      userOwnership,
      remainingToken,
    } = this.props
    return (
      <BgCard mt="100px">
        <Flex
          style={{ height: '55px', borderBottom: '1px solid #ededed' }}
          pl="30px"
          alignItems="center"
        >
          <Text color="#4e3ca9" fontFamily="Avenir-Heavy" fontSize="14px">
            {actionType[0] + actionType.slice(1).toLowerCase()}
          </Text>
          <Flex
            width={1}
            justifyContent="flex-end"
            pr="30px"
            style={{ cursor: 'pointer' }}
            onClick={() => hideDepositWithdraw()}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Flex>
        </Flex>
        <Flex
          pt="20px"
          px="30px"
          flexDirection="column"
          style={{ position: 'relative' }}
        >
          <Text color="#4a4a4a" fontSize="14px" lineHeight={1.43}>
            {actionType === 'DEPOSIT' ? (
              <React.Fragment>
                Deposit your tokens to delegate data curation right to the
                provider. In return, you are entitle to a portion of fee that
                the provider earn.{' '}
                <a href="https://developer.bandprotocol.com/docs/tcd.html#supporting-data-providers">
                  Learn more
                </a>
              </React.Fragment>
            ) : (
              <React.Fragment>
                Withdraw your staked tokens from the provider. You will no
                longer earn the portion of curation fee you entitle to.{' '}
                <a href="https://developer.bandprotocol.com/docs/tcd.html#supporting-data-providers">
                  Learnmore
                </a>
              </React.Fragment>
            )}
          </Text>
          <Flex my="30px">
            <Flex
              style={{
                position: 'absolute',
                right: '50px',
                alignItems: 'center',
              }}
            >
              {actionType === 'WITHDRAW' ? (
                <MaxButton
                  isMax={
                    this.state.value &&
                    Number(this.state.value) === Number(userOwnership.pretty())
                  }
                  onClick={() => this.updateValue(userOwnership.pretty())}
                >
                  Max
                </MaxButton>
              ) : (
                <MaxButton
                  isMax={
                    this.state.value &&
                    Number(this.state.value) === Number(remainingToken.pretty())
                  }
                  onClick={() => this.updateValue(remainingToken.pretty())}
                >
                  Max
                </MaxButton>
              )}

              <Text
                lineHeight="35px"
                color="#cbcfe3"
                fontFamily="Avenir-Medium"
              >
                {symbol}
              </Text>
            </Flex>
            <Input
              value={this.state.value}
              onChange={({ target }) => this.updateValue(target.value)}
            />
          </Flex>
          <Flex style={{ position: 'absolute', bottom: '45px' }}>
            <Text color="red" fontSize="11px">
              {this.state.errorMessage}
            </Text>
          </Flex>
          <Flex width={1} justifyContent="center">
            <CustomButton
              isValidInput={this.state.isValidInput}
              onClick={
                this.state.isValidInput
                  ? actionType === 'DEPOSIT'
                    ? () => this.deposit()
                    : () => this.withdraw()
                  : () => false
              }
            >
              Submit
            </CustomButton>
          </Flex>
        </Flex>
      </BgCard>
    )
  }
}

const mapStateToProps = (
  state,
  {
    actionType,
    tokenAddress,
    dataSourceAddress,
    tcdAddress,
    userOwnership,
    stake,
    totalOwnership,
  },
) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })

  if (!community) return {}
  const remainingToken = remainingTokenByTCDSelector(state, {
    address: tokenAddress,
    tcdAddress,
  })
  return {
    actionType,
    userOwnership,
    stake,
    totalOwnership,
    tokenAddress,
    dataSourceAddress,
    tcdAddress,
    remainingToken,
    symbol: community.get('symbol'),
    balance: communityBalanceSelector(state, { address: tokenAddress }).sub(
      tokenLockByTCDSelector(state, { address: tokenAddress, tcdAddress }),
    ),
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  hideDepositWithdraw: () => dispatch(hideModal()),
  dispatchDeposit: (tcdAddress, dataSourceAddress, stake) =>
    dispatch(tcdDeposit(tcdAddress, dataSourceAddress, stake)),
  dispatchWithdraw: (tcdAddress, dataSourceAddress, stake, withdrawAmount) =>
    dispatch(tcdWithdraw(tcdAddress, dataSourceAddress, stake, withdrawAmount)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DepositWithdrawModal)
