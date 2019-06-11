import { all, fork, put, delay, select } from 'redux-saga/effects'
import {
  currentUserSelector,
  currentBandClientSelector,
} from 'selectors/current'
import { web3Selector } from 'selectors/wallet'
import {
  updateProvider,
  saveBandInfo,
  saveCommunityInfo,
  setWallet,
  setWeb3,
  saveTxs,
  saveHiddenTxs,
  dumpTxs,
} from 'actions'

import {
  blockNumberSelector,
  transactionSelector,
  transactionHiddenSelector,
} from 'selectors/basic'

import balancesSaga from 'sagas/balances'
import ordersSaga from 'sagas/orders'
import priceSaga from 'sagas/prices'
import providersSaga from 'sagas/providers'
import rewardsSaga from 'sagas/rewards'
import transactionsSaga from 'sagas/transaction'
import parameterSaga from 'sagas/parameters'
import proposalSaga from 'sagas/proposals'
import transferSaga from 'sagas/transfer'
import holderSaga from 'sagas/holder'
import tcdSaga from 'sagas/tcd'

import BandWallet from 'band-wallet'
import { Utils } from 'band.js'
import BN from 'utils/bignumber'

import transit from 'transit-immutable-js'
import { List, fromJS, Set, Map } from 'immutable'
import { toggleFetch } from 'actions'

// import web3
import Web3 from 'web3'

const RPC_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? 'https://rinkeby.infura.io/v3/d3301689638b40dabad8395bf00d3945'
    : 'http://localhost:8545'

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_ENDPOINT))

function* baseInitialize() {
  // start fetching state
  yield put(toggleFetch(true))
  window.BandWallet = new BandWallet(
    process.env.NODE_ENV === 'production'
      ? 'https://wallet.bandprotocol.com'
      : 'http://localhost:3000',
    {
      walletPosition: {
        top: 60,
        right: 130,
      },
      approvalPosition: {
        bottom: 0,
        right: 10,
        zIndex: 30,
      },
    },
  )

  window.BandWallet.on('network', ({ name }) => {
    if (name !== localStorage.getItem('network')) {
      localStorage.setItem('network', name)
      window.location.reload()
    }
  })

  const query = yield Utils.graphqlRequest(`
    {
      allContracts(condition: {contractType: "BAND_TOKEN"}) {
        nodes {
          address
        }
      }
    }
  `)
  const bandAddress = query.allContracts.nodes[0].address
  yield put(
    // TODO: Mock on price and last24hr
    saveBandInfo(bandAddress, '1000000000000000000000000', 1.0, 0),
  )
  const communityDetails = yield Utils.graphqlRequest(
    `
    {
      allBandCommunities{
        nodes {
          tokenAddress
          name
          organization
          website
          logo
          banner
          description
          tokenByTokenAddress {
            address
            symbol
            totalSupply
            curveByTokenAddress {
              price
              collateralEquation
            }
            tcdsByTokenAddress {
              nodes {
                address
                maxProviderCount
                minStake
                dataProvidersByTcdAddress(filter: {status: {notEqualTo: "DISABLED"}}) {
                  nodes {
                    stake
                  }
                }
              }
            }
            tcrsByTokenAddress {
              nodes {
                listedEntries: entriesByTcrAddress(filter: {status: {equalTo: "LISTED"}}) {
                  totalCount
                }
                appliedEntries: entriesByTcrAddress(filter: {status: {equalTo: "APPLIED"}}) {
                  totalCount
                }
                challengedEntries: entriesByTcrAddress(filter: {status: {equalTo: "CHALLENGED"}}) {
                  totalCount
                }
                rejectedEntries: entriesByTcrAddress(filter: {status: {equalTo: "REJECTED"}}) {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `,
  )
  for (const community of communityDetails.allBandCommunities.nodes) {
    const token = community.tokenByTokenAddress
    yield put(
      saveCommunityInfo(
        community.name,
        token.symbol,
        token.address,
        community.organization,
        community.logo &&
          `https://ipfs.bandprotocol.com/api/v0/cat/${community.logo}`,
        community.banner &&
          `https://ipfs.bandprotocol.com/api/v0/cat/${community.banner}`,
        community.description,
        community.website,
        (parseFloat(token.curveByTokenAddress.price) *
          parseFloat(token.totalSupply)) /
          1e18,
        parseFloat(token.curveByTokenAddress.price),
        // token.last24Hrs,
        0,
        new BN(token.totalSupply),
        token.curveByTokenAddress.collateralEquation,
        token.tcdsByTokenAddress.nodes[0] &&
          Map({
            tcdAddress: token.tcdsByTokenAddress.nodes[0].address,
            minStake: token.tcdsByTokenAddress.nodes[0].minStake,
            maxProviderCount:
              token.tcdsByTokenAddress.nodes[0].maxProviderCount,
            totalStake: token.tcdsByTokenAddress.nodes[0].dataProvidersByTcdAddress.nodes.reduce(
              (c, { stake }) => c.add(new BN(stake)),
              new BN(0),
            ),
            dataProviderCount:
              token.tcdsByTokenAddress.nodes[0].dataProvidersByTcdAddress.nodes
                .length,
          }),
        token.tcrsByTokenAddress.nodes[0] && {
          listed: token.tcrsByTokenAddress.nodes[0].listedEntries.totalCount,
          applied: token.tcrsByTokenAddress.nodes[0].appliedEntries.totalCount,
          challenged:
            token.tcrsByTokenAddress.nodes[0].challengedEntries.totalCount,
          rejected:
            token.tcrsByTokenAddress.nodes[0].rejectedEntries.totalCount,
        },
      ),
    )
  }

  yield put(setWallet(window.BandWallet))
  yield put(setWeb3(new Web3(window.BandWallet.ref.current.state.provider)))
  // Auto update pending transaction
  yield fork(checkTransaction)
  // Update user address and balance after fetch all data
  yield fork(checkProvider)
  // stop fetching state
  yield put(toggleFetch(false))
}

function* checkTransaction() {
  while (true) {
    const currentBlock = yield web3.eth.getBlockNumber()
    if (currentBlock !== (yield select(blockNumberSelector))) {
      const allTxs = yield select(transactionSelector)
      if (allTxs) {
        const newTxs = fromJS(
          yield all(
            allTxs
              .map(function*(tx) {
                try {
                  if (
                    tx.get('status') === 'COMPLETED' ||
                    tx.get('status') === 'FAILED'
                  ) {
                    if (currentBlock - tx.get('blocknumber') >= 12) {
                      yield put(saveHiddenTxs(Set([tx.get('txHash')])))
                    }
                    return tx
                  }

                  const receipt = yield web3.eth.getTransactionReceipt(
                    tx.get('txHash'),
                  )

                  if (receipt) {
                    if (!tx.get('blocknumber')) {
                      return tx.set('blocknumber', receipt.blockNumber)
                    }
                    if (receipt.status) {
                      if (currentBlock - receipt.blockNumber + 1 >= 4)
                        return tx.set('status', 'COMPLETED')
                      else
                        return tx
                          .set('status', 'PENDING')
                          .set(
                            'confirm',
                            currentBlock - receipt.blockNumber + 1,
                          )
                    } else {
                      return tx.set('status', 'FAILED')
                    }
                  }

                  return tx.set('status', 'SENDING').set('confirm', 0)
                } catch (e) {
                  console.error('Error processing txn:', e)
                  return tx.set('status', 'SENDING').set('confirm', 0)
                }
              })
              .toJS(),
          ),
        )
        yield put(saveTxs(currentBlock, newTxs, false))
        yield put(dumpTxs())
      }
    }

    yield delay(1000)
  }
}

function* checkProvider() {
  while (true) {
    const web3 = yield select(web3Selector)
    window.bandClient = yield select(currentBandClientSelector)
    const userAddress =
      (web3 &&
        (yield new Promise((resolve, reject) => {
          web3.eth.getAccounts((error, users) => {
            if (error) reject(error)
            else resolve(web3.utils.toChecksumAddress(users[0]))
          })
        }))) ||
      null
    yield put(updateProvider(userAddress, web3 && web3.currentProvider))
    if (userAddress) {
      // Load transaction history here!
      const rawTxState = localStorage.getItem(`txs-${userAddress}`)
      const rawHiddenTxState = localStorage.getItem(`hiddenTxs-${userAddress}`)
      if (rawTxState && rawHiddenTxState) {
        const txState = transit.fromJSON(rawTxState)
        const hiddenTxState = transit.fromJSON(rawHiddenTxState)
        yield put(saveTxs(0, txState, true))
        yield put(saveHiddenTxs(hiddenTxState))
      } else if (rawTxState) {
        const txState = transit.fromJSON(rawTxState)
        yield put(saveTxs(0, txState, true))
        yield put(saveHiddenTxs(Set()))
      } else {
        yield put(saveTxs(0, List(), true))
        yield put(saveHiddenTxs(Set()))
      }
    } else {
      yield put(saveTxs(0, List(), true))
      yield put(saveHiddenTxs(Set()))
    }
    yield delay(3000)
  }
}

export default function*() {
  yield all([
    fork(providersSaga),
    fork(balancesSaga),
    fork(transactionsSaga),
    fork(ordersSaga),
    fork(priceSaga),
    fork(rewardsSaga),
    fork(parameterSaga),
    fork(proposalSaga),
    fork(transferSaga),
    fork(holderSaga),
    fork(tcdSaga),
  ])
  yield* baseInitialize()
}
