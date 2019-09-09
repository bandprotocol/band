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
import { BandProtocolClient } from 'band.js'
import { mobilecheck } from './utils/detectmobilebrowser'
import bandLogoSrc from './images/band.svg'

const network = localStorage.getItem('network') || 'kovan'
switch (network) {
  case 'mainnet':
  case 'kovan':
    BandProtocolClient.setAPI('https://band-kovan.herokuapp.com')
    BandProtocolClient.setGraphQlAPI(
      'https://graphql-kovan.bandprotocol.com/graphql',
    )
    break
  case 'rinkeby':
  case 'local':
    BandProtocolClient.setAPI('http://localhost:5000')
    BandProtocolClient.setGraphQlAPI('http://localhost:5001/graphql')
    break
  default:
}

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
    <div
      style={{
        margin: '16vh 20px',
        textAlign: 'center',
        fontSize: '18px',
        lineHeight: '20px',
      }}
    >
      <img
        src={bandLogoSrc}
        width="100px"
        style={{ marginBottom: '20px' }}
        alt="band logo"
      />
      <br></br>
      <span style={{}}>
        Band Governance Portal is currently not supported on mobile platforms.
      </span>
      <br></br>
      <span>
        You can use desktop browsers to interact with Governance Portal.
      </span>
      <br></br>
      <div style={{ marginTop: '50px' }}>
        <span>Please visit</span>
        <a href="https://bandprotocol.com">https://bandprotocol.com</a>
        <br></br>
        <span>to learn more about Band Protocol.</span>
      </div>
    </div>
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
