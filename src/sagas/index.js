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
  dumpTxs,
} from 'actions'

import { blockNumberSelector, transactionSelector } from 'selectors/basic'

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
import { List, fromJS } from 'immutable'
import { toggleFetch } from 'actions'

// import web3
import Web3 from 'web3'

const INFURA_KEY =
  'https://rinkeby.infura.io/v3/d3301689638b40dabad8395bf00d3945'

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_KEY))

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
      allCommunities {
        nodes {
          name
          address
          organization
          website
          logo
          banner
          description
          tokenByCommunityAddress {
            address
            symbol
            totalSupply
          }
          curveByCommunityAddress {
            price
            collateralEquation
          }
          tcdsByCommunityAddress {
            nodes {
              address
              activeDataSourceCount
              minStake
              dataProvidersByAggregateContract(filter: {status: {notEqualTo: "REMOVED"}}) {
                nodes {
                  totalOwnership
                }
              }
            }
          }
          tcrsByCommunityAddress {
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
  `,
  )
  for (const dapp of communityDetails.allCommunities.nodes) {
    yield put(
      saveCommunityInfo(
        dapp.name,
        dapp.tokenByCommunityAddress.symbol,
        dapp.address,
        dapp.tokenByCommunityAddress.address,
        dapp.organization,
        dapp.logo && `https://ipfs.bandprotocol.com/api/v0/cat/${dapp.logo}`,
        dapp.banner &&
          `https://ipfs.bandprotocol.com/api/v0/cat/${dapp.banner}`,
        dapp.description,
        dapp.website,
        (parseFloat(dapp.curveByCommunityAddress.price) *
          parseFloat(dapp.tokenByCommunityAddress.totalSupply)) /
          1e18,
        parseFloat(dapp.curveByCommunityAddress.price),
        // dapp.last24Hrs,
        0,
        new BN(dapp.tokenByCommunityAddress.totalSupply),
        dapp.curveByCommunityAddress.collateralEquation,
        dapp.tcdsByCommunityAddress.nodes,
        dapp.tcrsByCommunityAddress.nodes[0] && {
          listed: dapp.tcrsByCommunityAddress.nodes[0].listedEntries.totalCount,
          applied:
            dapp.tcrsByCommunityAddress.nodes[0].appliedEntries.totalCount,
          challenged:
            dapp.tcrsByCommunityAddress.nodes[0].challengedEntries.totalCount,
          rejected:
            dapp.tcrsByCommunityAddress.nodes[0].rejectedEntries.totalCount,
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
                  )
                    return tx

                  const receipt = yield web3.eth.getTransactionReceipt(
                    tx.get('txHash'),
                  )

                  if (receipt) {
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
      if (rawTxState) {
        const txState = transit.fromJSON(rawTxState)
        yield put(saveTxs(0, txState, true))
      } else {
        yield put(saveTxs(0, List(), true))
      }
    } else {
      yield put(saveTxs(0, List(), true))
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
