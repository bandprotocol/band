import { takeEvery, put, select } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import {
  TRACK_TRANSACTION,
  updateConfimation,
  BUY_TOKEN,
  SELL_TOKEN,
  CLAIM_REWARD,
  PROPOSE_PROPOSAL,
  VOTE_PROPOSAL,
  trackTransaction,
  showModal,
  hideModal,
} from 'actions'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

import IPFSStorage from 'utils/ipfs'

const UPDATE_CONFIRMATION = 'UPDATE_CONFIRMATION'
const NEW_TRANSACTION = 'NEW_TRANSACTION'

const confirmationChannel = channel()

function handleTrackTransaction({ emitter }) {
  emitter
    .on('confirmation', (confirmationNumber, receipt) => {
      confirmationChannel.put({
        type: UPDATE_CONFIRMATION,
        txHash: receipt.transactionHash,
        confirmationNumber,
      })
    })
    .on('transactionHash', txHash => {
      confirmationChannel.put({
        type: NEW_TRANSACTION,
        txHash,
      })
    })
}

function* handleConfirmChannel({ type, txHash, confirmationNumber }) {
  switch (type) {
    case UPDATE_CONFIRMATION:
      yield put(updateConfimation(txHash, confirmationNumber))
      if (confirmationNumber === 12) {
        yield put(hideModal())
      }
      return
    case NEW_TRANSACTION:
      yield put(updateConfimation(txHash, 0))
      yield put(showModal('CONFIRMATION', { txHash }))
      return
    default:
      return
  }
}

function* handleBuyToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createBuyTransaction(amount, priceLimit)
  const emitter = transaction.send()
  yield put(trackTransaction(emitter))
}

function* handleSellToken({ address, amount, priceLimit }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createSellTransaction(amount, priceLimit)
  const emitter = transaction.send()
  yield put(trackTransaction(emitter))
}

function* handleClaimReward({ address, rewardID }) {
  const client = yield select(currentCommunityClientSelector, { address })
  const transaction = yield client.createClaimRewardTransaction(rewardID)
  const emitter = transaction.send()
  yield put(trackTransaction(emitter))
}

function* handleProposeProposal({ address, title, reason, changes }) {
  const reasonHash = yield IPFSStorage.save(
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

  const emitter = transaction.send()
  yield put(trackTransaction(emitter))
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
  const emitter = transaction.send()
  yield put(trackTransaction(emitter))
}

export default function*() {
  yield takeEvery(confirmationChannel, handleConfirmChannel)
  yield takeEvery(TRACK_TRANSACTION, handleTrackTransaction)
  yield takeEvery(BUY_TOKEN, handleBuyToken)
  yield takeEvery(SELL_TOKEN, handleSellToken)
  yield takeEvery(CLAIM_REWARD, handleClaimReward)
  yield takeEvery(PROPOSE_PROPOSAL, handleProposeProposal)
  yield takeEvery(VOTE_PROPOSAL, handleVoteProposal)
}
