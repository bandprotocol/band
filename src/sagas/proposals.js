import { takeEvery, put, select, delay, all } from 'redux-saga/effects'
import { IPFS } from 'band.js'
import moment from 'utils/moment'

import { LOAD_PROPOSALS, saveProposals } from 'actions'

import {
  currentCommunityClientSelector,
  currentUserSelector,
} from 'selectors/current'

import { parameterByNameSelector } from 'selectors/parameter'

function* handleLoadProposals({ address }) {
  // TODO: Find a better way.
  while (true) {
    if (yield select(currentCommunityClientSelector, { address })) break
    yield delay(100)
  }

  const parameterClient = (yield select(currentCommunityClientSelector, {
    address,
  })).parameter()

  const currentUser = yield select(currentUserSelector)

  const rawProposals = yield parameterClient.getProposals()

  const votes = yield parameterClient.getVotes({
    voter: currentUser || undefined,
  })

  const proposals = yield all(
    rawProposals.map(function*(proposal) {
      const vote = votes.filter(v => v.onChainId === proposal.proposalId)
      const data = JSON.parse(yield IPFS.get(proposal.reasonHash))
      const [prefix, name] = proposal.changes[0].key.split(':')
      if (!name)
        return {
          deleted: true,
        }
      const changes = yield all(
        proposal.changes.map(function*({ key, value }) {
          const [_prefix, _name] = key.split(':')
          if (_prefix !== prefix || !_name) {
            return {
              deleted: true,
            }
          }
          const oldValue = yield select(parameterByNameSelector, {
            address,
            type: prefix,
            name: _name,
          })
          return {
            name: _name,
            oldValue,
            newValue: value,
          }
        }),
      )

      if (changes.filter(c => c.deleted).length !== 0) {
        return {
          deleted: true,
        }
      }

      return {
        proposalId: proposal.proposalId,
        proposer: proposal.proposer,
        title: data && data.title,
        reason: data && data.reason,
        prefix: prefix,
        changes: changes,
        status: proposal.status,
        proposedAt: moment(proposal.proposedAt),
        expiredAt: moment(proposal.pollEndTime),
        yesVote: proposal.yesVote,
        noVote: proposal.noVote,
        supportRequiredPct: proposal.supportRequiredPct,
        minParticipation: proposal.minParticipation,
        totalVotingPower: proposal.totalVotingPower,
        vote:
          vote.length !== 0 && currentUser
            ? vote[0].yesWeight.gt(vote[0].noWeight)
              ? 'SUPPORT'
              : 'REJECT'
            : 'NOT VOTED',
      }
    }),
  )
  yield put(saveProposals(address, proposals.filter(p => !p.deleted)))
}

export default function*() {
  yield takeEvery(LOAD_PROPOSALS, handleLoadProposals)
}
