import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { fromJS } from 'immutable'

import App from './App'

import * as serviceWorker from './serviceWorker'

import rootSaga from 'sagas'
import rootReducer from 'reducers'

import { mobilecheck } from './utils/detectmobilebrowser'
import MobilePage from './pages/MobilePage'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  rootReducer,
  fromJS({}),
  applyMiddleware(sagaMiddleware),
)

sagaMiddleware.run(rootSaga)

const isMobile = mobilecheck()

ReactDOM.render(
  isMobile ? (
    <MobilePage />
  ) : (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root'),
)

// Let's make it easily hackable
window.store = store

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
