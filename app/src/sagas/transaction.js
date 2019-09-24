import { takeEvery, put, select } from 'redux-saga/effects'
import { getProvider } from 'data/Providers'
import { Utils } from 'band.js'
import transit from 'transit-immutable-js'
import BN from 'utils/bignumber'

import {
  BUY_TOKEN,
  SELL_TOKEN,
  TCD_DEPOSIT,
  TCD_WITHDRAW,
  TCD_REVENUE_TO_STAKE,
  PROPOSE_PROPOSAL,
  VOTE_PROPOSAL,
  addTx,
  dumpTxs,
  hideModal,
  DUMP_TXS,
  addPendingTx,
  removePendingTx,
} from 'actions'

import {
  currentTCDClientSelector,
  currentCommunityClientSelector,
  currentUserSelector,
  currentNetworkSelector,
} from 'selectors/current'
import { walletSelector } from 'selectors/wallet'

import {
  allTxsSelector,
  transactionHiddenSelector,
} from 'selectors/transaction'

import { IPFS } from 'band.js'

// function* handleTxChannel({ type, txHash, title }) {
//   yield put(addTx(txHash, title, type))
//   yield put(dumpTxs())
// }

function* sendTransaction({ transaction, title, type }) {
  const timestamp = new Date().getTime()
  try {
    yield put(addPendingTx(timestamp, title, type))
    const txHash = yield transaction.sendFeeless()
    const network = yield select(currentNetworkSelector)
    yield put(addTx(txHash, title, type, network))
    yield put(dumpTxs())
  } catch (error) {
    const currentUser = yield select(currentUserSelector)
    if (
      window.confirm(
        `Insufficient ETH to pay for gas fee. Please request free Kovan testnet ETH and send it to ${currentUser} ?`,
      )
    ) {
      window.open('https://gitter.im/kovan-testnet/faucet')
    }
  } finally {
    yield put(removePendingTx(timestamp))
  }
}

function* handleTcdDeposit({ tcdAddress, sourceAddress, stake }) {
  const client = yield select(currentTCDClientSelector, { address: tcdAddress })
  const transaction = yield client.createVoteDataSourceTransaction({
    dataSource: sourceAddress,
    stake,
  })
  const dataProviderName = getProvider(sourceAddress).name
  const title = `Deposit ${Utils.fromBlockchainUnit(stake)} ${
    stake.eq(BN.parse(1)) ? 'token' : 'tokens'
  }`
  const wallet = yield select(walletSelector)
  wallet.setDetail({
    type: 'DEPOSIT',
    title: `Deposit to ${dataProviderName}`,
    balance: `${Utils.fromBlockchainUnit(stake)} ${
      stake.eq(BN.parse(1)) ? 'token' : 'tokens'
    }`,
  })
  yield put(hideModal())
  yield sendTransaction({
    transaction,
    title: title,
    type: 'DEPOSIT',
  })
}

function* handleTcdWithdraw({
  tcdAddress,
  sourceAddress,
  ownership /* ownership */,
  withdrawAmount,
}) {
  const client = yield select(currentTCDClientSelector, { address: tcdAddress })
  const transaction = yield client.createWithdrawDataSourceTransaction({
    dataSource: sourceAddress,
    withdrawOwnership: ownership,
  })
  const dataProviderName = getProvider(sourceAddress).name
  const title = `Withdraw ${withdrawAmount} ${
    withdrawAmount === 1 ? 'token' : 'tokens'
  }`
  yield put(hideModal())
  const wallet = yield select(walletSelector)
  wallet.setDetail({
    type: 'WITHDRAW',
    title: `Withdraw from ${dataProviderName}`,
    balance: `${withdrawAmount} ${withdrawAmount === 1 ? 'token' : 'tokens'}`,
  })
  yield sendTransaction({
    transaction,
    title: title,
    type: 'WITHDRAW',
  })
}

function* handleTcdRevenueToStake({
  tcdAddress,
  sourceAddress,
  revenueAmount,
}) {
  const client = yield select(currentTCDClientSelector, { address: tcdAddress })
  const transaction = yield client.createWithdrawDataSourceTransaction({
    dataSource: sourceAddress,
    withdrawOwnership: 0,
  })
  const dataProviderName = getProvider(sourceAddress).name
  const title = `Stake ${revenueAmount} ${
    revenueAmount === 1 ? 'token' : 'tokens'
  }`
  const wallet = yield select(walletSelector)
  wallet.setDetail({
    type: 'DEPOSIT',
    title: `Deposit to ${dataProviderName}`,
    balance: `${revenueAmount} ${revenueAmount === 1 ? 'token' : 'tokens'}`,
  })
  yield put(hideModal())

  yield sendTransaction({
    transaction,
    title: title,
    type: 'REVENUE_TO_STAKE',
  })
}

function* handleBuyToken({ address, amount, priceLimit, tokenName }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createBuyTransaction({ amount, priceLimit })
  const title = `Buy ${Utils.fromBlockchainUnit(amount)} ${
    amount.eq(BN.parse(1)) ? 'token' : 'tokens'
  }`
  yield put(hideModal())
  const wallet = yield select(walletSelector)
  wallet.setDetail({
    type: 'BUY',
    title: `Buy ${tokenName}`,
    balance: `${Utils.fromBlockchainUnit(amount)} ${
      amount.eq(BN.parse(1)) ? 'token' : 'tokens'
    }`,
  })
  yield sendTransaction({
    transaction,
    title: title,
    type: 'BUY',
  })
}

function* handleSellToken({ address, amount, priceLimit, tokenName }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createSellTransaction({ amount, priceLimit })
  const title = `Sell ${Utils.fromBlockchainUnit(amount)} ${
    amount.eq(BN.parse(1)) ? 'token' : 'tokens'
  }`
  yield put(hideModal())
  const wallet = yield select(walletSelector)
  wallet.setDetail({
    type: 'SELL',
    title: `Sell ${tokenName}`,
    balance: `${Utils.fromBlockchainUnit(amount)} ${
      amount.eq(BN.parse(1)) ? 'token' : 'tokens'
    }`,
  })
  yield sendTransaction({
    transaction,
    title: title,
    type: 'SELL',
  })
}

function* handleProposeProposal({ address, title, reason, changes }) {
  const reasonHash = yield IPFS.set(
    JSON.stringify({
      title,
      reason,
    }),
  )

  const client = yield select(currentCommunityClientSelector, { address })
  const wallet = yield select(walletSelector)
  wallet.setDetail({
    type: `PROPOSE`,
    title: `Propose ${title}`,
  })
  const transaction = yield client.createProposeTransaction({
    reasonHash,
    keys: Object.keys(changes),
    values: Object.values(changes),
  })

  yield put(hideModal())
  yield sendTransaction({
    transaction,
    title: `Propose ${title}`,
    type: 'PROPOSE',
  })
}

function* handleVoteProposal({ address, proposalId, vote }) {
  const user = yield select(currentUserSelector)
  if (!user) {
    const wallet = yield select(walletSelector)
    wallet.showWallet()
  } else {
    const client = yield select(currentCommunityClientSelector, { address })

    const transaction = yield client.createProposalVoteTransaction({
      proposalId,
      isAccepted: vote,
    })
    const wallet = yield select(walletSelector)
    wallet.setDetail({
      type: 'VOTE',
      title: `Vote`,
    })
    yield sendTransaction({
      transaction,
      title: `Vote ${vote ? 'accept' : 'reject'}`,
      type: 'VOTE',
    })
  }
}

function* handleDumpTxs() {
  const user = yield select(currentUserSelector)
  if (user) {
    const txs = yield select(allTxsSelector)
    const hiddenTxs = yield select(transactionHiddenSelector)
    localStorage.setItem(`txs-${user}`, transit.toJSON(txs))
    localStorage.setItem(`hiddenTxs-${user}`, transit.toJSON(hiddenTxs))
  }
}

export default function*() {
  // yield takeEvery(txChannel, handleTxChannel)
  yield takeEvery(BUY_TOKEN, handleBuyToken)
  yield takeEvery(TCD_DEPOSIT, handleTcdDeposit)
  yield takeEvery(TCD_WITHDRAW, handleTcdWithdraw)
  yield takeEvery(TCD_REVENUE_TO_STAKE, handleTcdRevenueToStake)
  yield takeEvery(SELL_TOKEN, handleSellToken)
  yield takeEvery(PROPOSE_PROPOSAL, handleProposeProposal)
  yield takeEvery(VOTE_PROPOSAL, handleVoteProposal)
  yield takeEvery(DUMP_TXS, handleDumpTxs)
}
