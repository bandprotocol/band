import { all, fork, put, delay, select, takeEvery } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import BandWallet from 'band-wallet'
import BN from 'utils/bignumber'
import { Utils, BandProtocolClient } from 'band.js'
import { fromJS, Set, Map } from 'immutable'
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
  setNetwork,
  toggleFetch,
  fetchCommunityPrice,
} from 'actions'

import { blockNumberSelector, transactionSelector } from 'selectors/basic'
import {
  currentUserSelector,
  web3Selector,
  currentNetworkSelector,
} from 'selectors/current'

import {
  logoCommunityFromSymbol,
  bannerCommunityFromSymbol,
} from 'utils/communityImg'

// saga
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
import communitySaga from 'sagas/community'

import { networkIdtoName } from 'utils/network'
import { getBandUSD } from 'utils/bandPrice'

// import web3
import Web3 from 'web3'

// Select network (HARDCODE)!!!
let WALLET_ENDPOINT = 'https://bandwallet.bandprotocol.com'
if (process.env.NODE_ENV !== 'production')
  WALLET_ENDPOINT = 'http://localhost:3000'

/**
 * disable Metamask auto refresh
 */
if (
  typeof window.ethereum !== 'undefined' ||
  typeof window.web3 !== 'undefined'
) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

/**
 *  get current network
 */
let network = localStorage.getItem('network') || 'mainnet'

switch (network) {
  case 'mainnet':
    BandProtocolClient.setAPI('https://band-mainnet.herokuapp.com')
    BandProtocolClient.setGraphQlAPI(
      'https://api.thegraph.com/subgraphs/name/taobun/bandprotocol-mainnet',
    )
    break
  case 'kovan':
    BandProtocolClient.setAPI('https://band-kovan.herokuapp.com')
    BandProtocolClient.setGraphQlAPI(
      'https://api.thegraph.com/subgraphs/name/taobun/bandprotocol-kovan',
    )
    break
  case 'rinkeby':
    BandProtocolClient.setAPI('https://band-rinkeby.herokuapp.com')
    BandProtocolClient.setGraphQlAPI(
      'https://api.thegraph.com/subgraphs/name/taobun/bandprotocol-rinkeby',
    )
    break
  case 'ropsten':
    BandProtocolClient.setAPI('https://band-ropsten.herokuapp.com')
    BandProtocolClient.setGraphQlAPI(
      'https://api.thegraph.com/subgraphs/name/taobun/bandprotocol-ropsten',
    )
    break
  case 'local':
  default:
    BandProtocolClient.setAPI('https://band-kovan.herokuapp.com')
    BandProtocolClient.setGraphQlAPI(
      'https://graphql-kovan.bandprotocol.com/graphql',
    )
    break
}

const bandwalletChannel = channel()

/* handle web3 channel from band wallet*/
function* handleBandWalletChannel({ type, payload }) {
  switch (type) {
    case 'CHANGE_STATUS':
      switch (payload) {
        case 'UNINITIALIZED':
          break
        case 'INITIALIZED':
          break
        case 'NOT_SIGNIN':
          yield put(setUserAddress('NOT_SIGNIN'))
          yield put(updateClient())
          localStorage.removeItem('walletType')
          break
        case 'PROVIDER_READY': {
          const provider = yield window.BandWallet.provider
          const web3 = new Web3(provider)
          const userAddress = yield getUser(web3)
          yield put(setWeb3(web3))
          yield put(setUserAddress(userAddress))
          yield put(updateClient(provider))
          window.gtag('event', 'User', {
            event_category: 'sigin',
            event_label: userAddress,
          })
          break
        }
        default:
          alert('Status error')
      }
      yield put(dumpCurrent())
      break
    case 'SET_NETWORK':
      yield put(setNetwork(payload))
      yield put(dumpCurrent())
      window.open(window.location.origin, '_self')
      break
    default:
      alert('Action type not recognized')
  }
}

/**
 * Initialize
 */
function* baseInitialize() {
  // start fetching state
  yield put(toggleFetch(true))

  yield put(loadCurrent())

  const query = yield Utils.graphqlRequest(`
  {
    tokens(where:{symbol: "BAND"}) {
      id
    }
  }
  `)
  const bandAddress = query.tokens[0].id

  /* get BAND-USD conversion rate from Coingecko */
  const { usd, usd_24h_change } = yield getBandUSD()
  yield put(
    saveBandInfo(bandAddress, '1000000000000000000000000', usd, usd_24h_change),
  )

  const communityDetails = yield Utils.graphqlRequest(
    `
  {
    tokens{
      id
      name
      symbol
      totalSupply
      curve{
        id
        price
        collateralEquation
        curveMultiplier
        prices(first:1, where:{timestamp_lt: ${Math.trunc(
          new Date().getTime() / 1000 - 86400,
        )}},orderBy: timestamp, orderDirection:desc){
          price
          totalSupply
        }
      }
      tcd {
        id
        prefix
        providers {
          providerAddress
          stake
        }
      }
      parameter{
        id
      }
    }
  }
  `,
  )

  for (const token of communityDetails.tokens) {
    if (token.symbol !== 'BAND') {
      yield put(
        saveCommunityInfo(
          token.name,
          token.symbol,
          token.id,
          'Band protocol', // community.organization,
          '/static/media/finance.82975d46.png', // logoCommunityFromSymbol(token.symbol),
          '/static/media/finance-banner.89257026.png', // bannerCommunityFromSymbol(token.symbol),
          'Get current prices of any trading currency pairs.', //community.description,
          'https://data.bandprotocol.com/dataset/price', //community.website,
          (parseFloat(token.curve.price) * parseFloat(token.totalSupply)) /
            1e36,
          parseFloat(token.curve.price / 1e18),
          new BN(token.totalSupply),
          new BN(token.curve.curveMultiplier),
          parseFloat(token.curve.prices[0] ? token.curve.prices[0].price : 0) /
            1e18,
          new BN(token.curve.prices[0] ? token.curve.prices[0].totalSupply : 0),
          token.curve.collateralEquation,
          // Map(),
          token.tcd &&
            Map({
              [token.tcd.id]: Map({
                prefix: token.tcd.prefix,
                totalStake: token.tcd.providers.reduce(
                  (c, { stake }) => c.add(new BN(stake)),
                  new BN(0),
                ),
                dataProviderCount: token.tcd.providers.length,
                providers: token.tcd.providers.map(x => x.providerAddress),
              }),
            }),
          false,
          token.parameter.id,
          token.curve.id,
        ),
      )
    }
  }

  /**
   *  Band Wallet
   */
  // Initialize wallet
  window.BandWallet = new BandWallet(WALLET_ENDPOINT, {
    walletPosition: {
      top: 60,
      right: 30,
    },
    approvalPosition: {
      bottom: 0,
      right: 10,
      zIndex: 1000000001,
    },
  })

  // listen network changed
  window.BandWallet.on('network', ({ name }) => {
    if (
      name !== localStorage.getItem('network') &&
      localStorage.getItem('walletType') === 'bandwallet'
    ) {
      bandwalletChannel.put({ type: 'SET_NETWORK', payload: name })
    }
  })

  // listen status changed
  window.BandWallet.on('status', status => {
    if (localStorage.getItem('walletType') === 'bandwallet') {
      bandwalletChannel.put({ type: 'CHANGE_STATUS', payload: status })
    }
  })

  yield put(setWallet(window.BandWallet))

  /**
   * Metamask
   */
  yield fork(metaMaskProcess)

  // Auto reload balance
  yield fork(autoRefresh)
  // Auto update pending transaction
  yield fork(updateTransaction)
  // stop fetching state
  yield put(toggleFetch(false))
}

function* metaMaskProcess() {
  while (true) {
    const walletType = localStorage.getItem('walletType')
    if (
      (typeof window.ethereum !== 'undefined' ||
        typeof window.web3 !== 'undefined') &&
      walletType === 'metamask'
    ) {
      const provider = window['ethereum'] || window.web3.currentProvider
      const web3 = new Web3(provider)
      const newUserAddress = yield getUser(web3)

      if (newUserAddress) {
        yield put(setWeb3(web3))
        yield put(setUserAddress(newUserAddress))

        const network = yield select(currentNetworkSelector)
        if (network !== networkIdtoName(window.ethereum.networkVersion)) {
          yield put(setNetwork(networkIdtoName(window.ethereum.networkVersion)))
          yield put(updateClient(provider))
          yield put(dumpCurrent())
          window.location.reload(true)
        }
        yield put(updateClient(provider))
      } else {
        const currentUser = yield select(currentUserSelector)
        if (currentUser !== 'NOT_SIGNIN') {
          yield put(setUserAddress('NOT_SIGNIN'))
          yield put(updateClient())
          localStorage.removeItem('walletType')
          yield put(dumpCurrent())
        }
      }
    }
    yield delay(1000)
  }
}

function* autoRefresh() {
  while (true) {
    yield delay(10000)
    yield put(reloadBalance())
    yield put(fetchCommunityPrice())
  }
}

/* update tx confirmation */
function* updateTransaction() {
  while (true) {
    const currentWeb3 = yield select(web3Selector)
    if (currentWeb3) {
      const currentBlock = yield currentWeb3.eth.getBlockNumber()
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

                    const receipt = yield currentWeb3.eth.getTransactionReceipt(
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
    fork(communitySaga),
  ])
  yield takeEvery(bandwalletChannel, handleBandWalletChannel)
  yield* baseInitialize()
}
