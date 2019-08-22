import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
import { ThemeProvider } from 'styled-components'
import theme from 'ui/theme'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from 'components/Navbar'
import TransactionPopup from 'components/TransactionPopup'
import ModalEntry from 'components/ModalEntry'
import Routes from 'Routes'
import FullLoadingPage from 'pages/FullLoading'
import { fetchSelector } from 'selectors/basic'

//ss

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        {this.props.fetching ? (
          <FullLoadingPage />
        ) : (
          <Router>
            <React.Fragment>
              <Navbar />
              <TransactionPopup />
              <Route component={Routes} />
              <ModalEntry />
            </React.Fragment>
          </Router>
        )}
      </ThemeProvider>
    )
  }
}

const mapStateToProps = state => ({
  fetching: fetchSelector(state),
})

export default connect(mapStateToProps)(App)
