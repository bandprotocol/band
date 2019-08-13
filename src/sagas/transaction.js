import { takeEvery, put, select } from 'redux-saga/effects'
import { Utils } from 'band.js'
import transit from 'transit-immutable-js'
import BN from 'utils/bignumber'

import {
  BUY_TOKEN,
  SELL_TOKEN,
  TCD_DEPOSIT,
  TCD_WITHDRAW,
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
    yield put(addTx(txHash, title, type))
    yield put(dumpTxs())
  } catch (error) {
    alert('Cannot send this transaction')
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
  yield put(hideModal())
  yield sendTransaction({
    transaction,
    title: `Deposit ${Utils.fromBlockchainUnit(stake)} ${
      stake.eq(BN.parse(1)) ? 'token' : 'tokens'
    }`,
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
  yield put(hideModal())
  yield sendTransaction({
    transaction,
    title: `Withdraw ${withdrawAmount} ${
      withdrawAmount === 1 ? 'token' : 'tokens'
    }`,
    type: 'WITHDRAW',
  })
}

function* handleBuyToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createBuyTransaction({ amount, priceLimit })
  yield put(hideModal())
  yield sendTransaction({
    transaction,
    title: `Buy ${Utils.fromBlockchainUnit(amount)} ${
      amount.eq(BN.parse(1)) ? 'token' : 'tokens'
    }`,
    type: 'BUY',
  })
}

function* handleSellToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createSellTransaction({ amount, priceLimit })
  yield put(hideModal())
  yield sendTransaction({
    transaction,
    title: `Sell ${Utils.fromBlockchainUnit(amount)} ${
      amount.eq(BN.parse(1)) ? 'token' : 'tokens'
    }`,
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
  yield takeEvery(SELL_TOKEN, handleSellToken)
  yield takeEvery(PROPOSE_PROPOSAL, handleProposeProposal)
  yield takeEvery(VOTE_PROPOSAL, handleVoteProposal)
  yield takeEvery(DUMP_TXS, handleDumpTxs)
}
