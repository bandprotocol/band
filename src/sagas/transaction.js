import { takeEvery, put, select } from 'redux-saga/effects'
import { Utils } from 'band.js'
import { channel } from 'redux-saga'

import transit from 'transit-immutable-js'

import {
  BUY_TOKEN,
  SELL_TOKEN,
  CLAIM_REWARD,
  PROPOSE_PROPOSAL,
  VOTE_PROPOSAL,
  addTx,
  dumpTxs,
  showModal,
  hideModal,
  DUMP_TXS,
} from 'actions'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

import { transactionSelector } from 'selectors/basic'

import { IPFS } from 'band.js'

const txChannel = channel()

function* handleTxChannel({ type, txHash, title }) {
  yield put(addTx(txHash, title, type))
  yield put(dumpTxs())
}

function* handleBuyToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createBuyTransaction(amount, priceLimit)
  transaction.send().once('transactionHash', txHash => {
    txChannel.put({
      txHash,
      title: `Buy ${Utils.fromBlockchainUnit(amount)} tokens`,
      type: 'BUY',
    })
  })
  yield put(hideModal())
}

function* handleSellToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createSellTransaction(amount, priceLimit)
  transaction.send().once('transactionHash', txHash => {
    txChannel.put({
      txHash,
      title: `Sell ${Utils.fromBlockchainUnit(amount)} tokens`,
      type: 'SELL',
    })
  })
  yield put(hideModal())
}

function* handleClaimReward({ address, rewardID }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createClaimRewardTransaction(rewardID)
  transaction.send().once('transactionHash', txHash => {
    txChannel.put({
      txHash,
      title: `Claim reward #${rewardID}`,
      type: 'REWARD',
    })
  })
}

function* handleProposeProposal({ address, title, reason, changes }) {
  const reasonHash = yield IPFS.set(
    JSON.stringify({
      title,
      reason,
    }),
  )

  const parameterClient = (yield select(currentCommunityClientSelector, {
    address,
  })).parameter()

  const transaction = yield parameterClient.createProposalTransaction(
    reasonHash,
    Object.keys(changes),
    Object.values(changes),
  )

  transaction.send().once('transactionHash', txHash => {
    txChannel.put({ txHash, title: `Propose ${title}`, type: 'PROPOSE' })
  })
  yield put(hideModal())
}

function* handleVoteProposal({ address, proposalId, vote }) {
  const user = yield select(currentUserSelector)
  if (!user) {
    yield put(showModal('LOGIN'))
  }
  const parameterClient = (yield select(currentCommunityClientSelector, {
    address,
  })).parameter()

  const votingPower = yield parameterClient.getVotingPower(proposalId)
  const transaction = yield parameterClient.createCastVoteTransaction(
    proposalId,
    vote ? votingPower : '0',
    vote ? '0' : votingPower,
  )

  transaction.send().once('transactionHash', txHash => {
    txChannel.put({
      txHash,
      title: `Vote ${vote ? 'accept' : 'reject'}`,
      type: 'VOTE',
    })
  })
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
  yield takeEvery(SELL_TOKEN, handleSellToken)
  yield takeEvery(CLAIM_REWARD, handleClaimReward)
  yield takeEvery(PROPOSE_PROPOSAL, handleProposeProposal)
  yield takeEvery(VOTE_PROPOSAL, handleVoteProposal)
  yield takeEvery(DUMP_TXS, handleDumpTxs)
}
