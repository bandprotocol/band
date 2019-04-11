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
import tokenSaga from 'sagas/token'

import { BandProtocolClient } from 'band.js'
import BandWallet from 'band-wallet'

import transit from 'transit-immutable-js'
import { List, fromJS } from 'immutable'

// import web3
import Web3 from 'web3'

const INFURA_KEY =
  'https://rinkeby.infura.io/v3/d3301689638b40dabad8395bf00d3945'

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_KEY))

function* baseInitialize() {
  window.BandWallet = new BandWallet(
    process.env.NODE_ENV === 'production'
      ? 'https://wallet.bandprotocol.com'
      : 'http://localhost:3000',
    {
      walletPosition: {
        top: 80,
        right: 130,
      },
      approvalPosition: {
        bottom: 0,
        right: 10,
      },
    },
  )

  BandProtocolClient.setAPI('https://api-wip.rinkeby.bandprotocol.com')
  const tempBandClient = yield BandProtocolClient.make({})
  const { address, price, last24Hrs } = yield tempBandClient.getBandInfo()

  yield put(
    // TODO: Mock on price and last24hr
    saveBandInfo(address, '1000000000000000000000000', price, last24Hrs),
  )
  const dapps = yield tempBandClient.getDAppsInfo()
  for (const dapp of dapps) {
    yield put(
      saveCommunityInfo(
        dapp.name,
        dapp.symbol,
        dapp.address,
        dapp.organization,
        `https://ipfs.infura.io:5001/api/v0/cat/${dapp.logo}`,
        `https://ipfs.infura.io:5001/api/v0/cat/${dapp.banner}`,
        dapp.description,
        dapp.website,
        dapp.marketCap,
        dapp.price,
        dapp.last24Hrs,
        dapp.totalSupply,
        dapp.collateralEquation,
      ),
    )
  }

  yield put(
    // TODO: Mock on price and last24hr
    saveBandInfo(address, '1000000000000000000000000', price, last24Hrs),
  )
  yield put(setWallet(window.BandWallet))
  yield put(setWeb3(new Web3(window.BandWallet.ref.current.state.provider)))
  // Auto update pending transaction
  yield fork(checkTransaction)
  // Update user address and balance after fetch all data
  yield fork(checkProvider)
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
                      if (currentBlock - receipt.blockNumber + 1 >= 8)
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
    const userState = yield select(currentUserSelector)
    const userAddress =
      (web3 &&
        (yield new Promise((resolve, reject) => {
          web3.eth.getAccounts((error, users) => {
            if (error) reject(error)
            else resolve(users)
          })
        }))[0]) ||
      null
    if (userAddress !== userState) {
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
    }
    yield delay(100)
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
    fork(tokenSaga),
  ])
  yield* baseInitialize()
}
