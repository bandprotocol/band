import { takeEvery, put, select } from 'redux-saga/effects'
import { Utils } from 'band.js'
import { channel } from 'redux-saga'
import transit from 'transit-immutable-js'

import {
  BUY_TOKEN,
  SELL_TOKEN,
  TCD_DEPOSIT,
  TCD_WITHDRAW,
  PROPOSE_PROPOSAL,
  VOTE_PROPOSAL,
  addTx,
  dumpTxs,
  showModal,
  hideModal,
  DUMP_TXS,
} from 'actions'

import {
  currentTCDClientSelector,
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'
import { walletSelector } from 'selectors/wallet'

import { transactionSelector } from 'selectors/basic'

import { IPFS } from 'band.js'

const txChannel = channel()

function* handleTxChannel({ type, txHash, title }) {
  yield put(addTx(txHash, title, type))
  yield put(dumpTxs())
}

function* handleTcdDeposit({ tcdAddress, sourceAddress, stake }) {
  const client = yield select(currentTCDClientSelector, { address: tcdAddress })
  const transaction = yield client.createVoteDataSourceTransaction({
    dataSource: sourceAddress,
    stake,
  })
  yield put(hideModal())
  const txHash = yield transaction.sendFeeless()
  txChannel.put({
    txHash,
    title: `Deposit ${Utils.fromBlockchainUnit(stake)} tokens`,
    type: 'DEPOSIT',
  })
}

function* handleTcdWithdraw({
  tcdAddress,
  sourceAddress,
  ownership /* ownership */,
}) {
  const client = yield select(currentTCDClientSelector, { address: tcdAddress })
  const transaction = yield client.createWithdrawDataSourceTransaction({
    dataSource: sourceAddress,
    withdrawOwnership: ownership,
  })
  yield put(hideModal())
  const txHash = yield transaction.sendFeeless()
  txChannel.put({
    txHash,
    title: `Withdraw ${Utils.fromBlockchainUnit(ownership)} tokens`,
    type: 'WITHDRAW',
  })
}

function* handleBuyToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createBuyTransaction({ amount, priceLimit })
  yield put(hideModal())
  const txHash = yield transaction.sendFeeless()
  txChannel.put({
    txHash,
    title: `Buy ${Utils.fromBlockchainUnit(amount)} tokens`,
    type: 'BUY',
  })
}

function* handleSellToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createSellTransaction({ amount, priceLimit })
  yield put(hideModal())
  const txHash = yield transaction.sendFeeless()
  txChannel.put({
    txHash,
    title: `Sell ${Utils.fromBlockchainUnit(amount)} tokens`,
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
  const txHash = yield transaction.sendFeeless()
  txChannel.put({ txHash, title: `Propose ${title}`, type: 'PROPOSE' })
}

function* handleVoteProposal({ address, proposalId, vote }) {
  const user = yield select(currentUserSelector)
  if (!user) {
    const wallet = yield select(walletSelector)
    wallet.showWallet()
  } else {
    const client = yield select(currentCommunityClientSelector, { address })

    const votingPower = yield client.parameter().getVotingPower(proposalId)
    const transaction = yield client.createProposalVoteTransaction({
      proposalId,
      yesVote: vote ? votingPower : '0',
      noVote: vote ? '0' : votingPower,
    })

    const txHash = yield transaction.sendFeeless()
    txChannel.put({
      txHash,
      title: `Vote ${vote ? 'accept' : 'reject'}`,
      type: 'VOTE',
    })
  }
}

function* handleDumpTxs() {
  const user = yield select(currentUserSelector)
  if (user) {
    const txs = yield select(transactionSelector)
    localStorage.setItem(`txs-${user}`, transit.toJSON(txs))
  }
}

export default function*() {
  yield takeEvery(txChannel, handleTxChannel)
  yield takeEvery(BUY_TOKEN, handleBuyToken)
  yield takeEvery(TCD_DEPOSIT, handleTcdDeposit)
  yield takeEvery(TCD_WITHDRAW, handleTcdWithdraw)
  yield takeEvery(SELL_TOKEN, handleSellToken)
  yield takeEvery(PROPOSE_PROPOSAL, handleProposeProposal)
  yield takeEvery(VOTE_PROPOSAL, handleVoteProposal)
  yield takeEvery(DUMP_TXS, handleDumpTxs)
}
