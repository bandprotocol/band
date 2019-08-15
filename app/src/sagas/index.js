import { all, fork, put, delay, select, takeEvery } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import {
  updateClient,
  saveBandInfo,
  saveCommunityInfo,
  setUserAddress,
  setWallet,
  setWeb3,
  saveTxs,
  saveHiddenTxs,
  dumpTxs,
  loadCurrent,
  dumpCurrent,
  reloadBalance,
} from 'actions'

import { blockNumberSelector, transactionSelector } from 'selectors/basic'

import balancesSaga from 'sagas/balances'
import ordersSaga from 'sagas/orders'
import priceSaga from 'sagas/prices'
import providersSaga from 'sagas/current'
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

import { fromJS, Set, Map } from 'immutable'
import { toggleFetch } from 'actions'

// import web3
import Web3 from 'web3'

// Select network (HARDCODE)!!!
let RPC_ENDPOINT = 'https://kovan.infura.io/v3/1edf94718018482aa7055218e84486d7'
let WALLET_ENDPOINT = 'https://wallet.kovan.bandprotocol.com'

const network = localStorage.getItem('network') || 'kovan'
switch (network) {
  case 'mainnet':
  case 'kovan':
    RPC_ENDPOINT = 'https://kovan.infura.io/v3/1edf94718018482aa7055218e84486d7'
    if (process.env.NODE_ENV !== 'production')
      WALLET_ENDPOINT = 'http://localhost:3000'
    break
  case 'rinkeby':
  case 'local':
  default:
    RPC_ENDPOINT = 'http://localhost:8545'
    WALLET_ENDPOINT = 'http://localhost:3000'
}

const defaultWeb3 = new Web3(new Web3.providers.HttpProvider(RPC_ENDPOINT))
const web3Channel = channel()

function* handleWeb3Channel({ type, status }) {
  switch (type) {
    case 'CHANGE_STATUS':
      switch (status) {
        case 'UNINITIALIZED':
          break
        case 'INITIALIZED':
          break
        case 'NOT_SIGNIN':
          yield put(setUserAddress('NOT_SIGNIN'))
          yield put(updateClient())
          break
        case 'PROVIDER_READY': {
          const provider = yield window.BandWallet.provider
          const web3 = new Web3(provider)
          const userAddress = yield getUser(web3)
          yield put(setWeb3(web3))
          yield put(setUserAddress(userAddress))
          yield put(updateClient(provider))
          break
        }
        default:
          alert('Status error')
      }
      yield put(dumpCurrent())
      break
    default:
      alert('Action type not recognized')
  }
}

function* baseInitialize() {
  // start fetching state
  yield put(toggleFetch(true))

  yield put(loadCurrent())
  // Initialize wallet
  window.BandWallet = new BandWallet(WALLET_ENDPOINT, {
    walletPosition: {
      top: 60,
      right: 30,
    },
    approvalPosition: {
      bottom: 0,
      right: 10,
      zIndex: 30,
    },
  })

  window.BandWallet.on('network', ({ name }) => {
    if (name !== localStorage.getItem('network')) {
      localStorage.setItem('network', name)
      window.location.reload()
    }
  })

  window.BandWallet.on('status', s =>
    web3Channel.put({ type: 'CHANGE_STATUS', status: s }),
  )

  yield put(setWallet(window.BandWallet))
  yield put(setWeb3(defaultWeb3))

  const query = yield Utils.graphqlRequest(`
    {
      allContracts(condition: {contractType: "BAND_TOKEN"}){
        nodes{
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
      allBandCommunities {
        nodes {
          tokenAddress
          name
          organization
          description
          website
          logo
          banner
          tokenByTokenAddress {
            address
            symbol
            totalSupply
            curveByTokenAddress {
              price
              collateralEquation
              pricesByCurveAddress(first: 1, filter: {timestamp: {lessThan: ${Math.trunc(
                new Date().getTime() / 1000 - 86400,
              )}}}, orderBy: TIMESTAMP_DESC) {
                nodes {
                  price
                  totalSupply
                }
              }
            }
            tcdsByTokenAddress {
              nodes {
                address
                prefix
                maxProviderCount
                minStake
                dataProvidersByTcdAddress(filter: {status: {notEqualTo: "DISABLED"}}) {
                  nodes {
                    stake
                    dataSourceAddress
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
        new BN(token.totalSupply),
        parseFloat(
          token.curveByTokenAddress.pricesByCurveAddress.nodes[0]
            ? token.curveByTokenAddress.pricesByCurveAddress.nodes[0].price
            : 0,
        ),
        new BN(
          token.curveByTokenAddress.pricesByCurveAddress.nodes[0]
            ? token.curveByTokenAddress.pricesByCurveAddress.nodes[0]
                .totalSupply
            : 0,
        ),
        token.curveByTokenAddress.collateralEquation,
        token.tcdsByTokenAddress.nodes[0] &&
          token.tcdsByTokenAddress.nodes.reduce(
            (acc, each) =>
              acc.set(
                each.address,
                Map({
                  prefix: each.prefix,
                  minStake: each.minStake,
                  maxProviderCount: each.maxProviderCount,
                  totalStake: each.dataProvidersByTcdAddress.nodes.reduce(
                    (c, { stake }) => c.add(new BN(stake)),
                    new BN(0),
                  ),
                  dataProviderCount:
                    each.dataProvidersByTcdAddress.nodes.length,
                  providers: each.dataProvidersByTcdAddress.nodes.map(
                    x => x.dataSourceAddress,
                  ),
                }),
              ),
            Map(),
          ),
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

  // Auto reload balance
  yield fork(autoRefresh)
  // Auto update pending transaction
  yield fork(checkTransaction)
  // stop fetching state
  yield put(toggleFetch(false))
}

function* autoRefresh() {
  while (true) {
    yield put(reloadBalance())
    yield delay(10000)
  }
}

function* checkTransaction() {
  while (true) {
    const currentBlock = yield defaultWeb3.eth.getBlockNumber()
    if (currentBlock !== (yield select(blockNumberSelector))) {
      const allTxs = (yield select(transactionSelector)).get('txs')
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

                  const receipt = yield defaultWeb3.eth.getTransactionReceipt(
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
                          .set('status', 'WAIT_CONFIRM')
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

function* getUser(web3) {
  return yield new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, users) => {
      if (error) reject(error)
      else resolve(web3.utils.toChecksumAddress(users[0]))
    })
  }) || null
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
  yield takeEvery(web3Channel, handleWeb3Channel)
  yield* baseInitialize()
}
