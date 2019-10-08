import { takeEvery, put, select, all } from 'redux-saga/effects'
import { Utils, IPFS } from 'band.js'
import BN from 'utils/bignumber'
import moment from 'utils/moment'

import { LOAD_PROPOSALS, saveProposals } from 'actions'

import { currentUserSelector } from 'selectors/current'

import { parameterByNameSelector } from 'selectors/parameter'

function* handleLoadProposals({ address }) {
  const currentUser = yield select(currentUserSelector)

  const data = yield Utils.graphqlRequest(`{
    token(id: "${address}") {
        parameter {
          proposals {
            reasonHash
            changes {
              key
              value
            }
            proposalId
            proposer
            minParticipation
            supportRequired
            currentYesCount
            currentNoCount
            totalVotingPower
            timestamp
            expirationTime
            status
            proposalVotes(where: {voter: "${currentUser}"}) {
              voter
              accepted
            }
          }
        }
      }
    }`)
  console.log(data)

  const proposalsData = data.token.parameter.proposals
  const k = data.token.parameter.proposals[0].reasonHash

  const { title, reason } = yield IPFS.get(k, true)

  const proposals = yield all(
    proposalsData.map(function*(proposal) {
      if (proposal.changes.length === 0) {
        return {
          deleted: true,
        }
      }
      const keys = proposal.changes[0].key
      const [prefix, name] = keys ? keys.split(':') : [null, null]
      if (!name)
        return {
          deleted: true,
        }
      const changes = yield all(
        Object.entries(proposal.changes).map(function*([key, value]) {
          const [_prefix, _name] = value.key.split(':')

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
            newValue: new BN(value.value),
          }
        }),
      )
      const vote = proposal.proposalVotes
      if (changes.filter(c => c.deleted).length !== 0) {
        return {
          deleted: true,
        }
      }
      return {
        proposalId: proposal.proposalId,
        proposer: proposal.proposer,
        title: proposal.reasonHash && title,
        reason: proposal.reasonHash && reason,
        prefix: prefix,
        changes: changes,
        status: proposal.status,
        proposedAt: moment.unix(proposal.timestamp),
        expiredAt: moment.unix(proposal.expirationTime),
        yesVote: new BN(proposal.currentYesCount),
        noVote: new BN(proposal.currentNoCount),
        supportRequiredPct: new BN(proposal.supportRequired),
        minParticipation: new BN(proposal.minParticipation),
        totalVotingPower: new BN(proposal.totalVotingPower),
        vote:
          vote.length !== 0 && currentUser
            ? vote[0].accepted
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
