import React, { Component } from 'react'
import './App.css'
import { ThemeProvider } from 'styled-components'
import theme from 'ui/theme'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from 'components/Navbar'
import TransactionPopup from 'components/TransactionPopup'
import ModalEntry from 'components/ModalEntry'
import Routes from 'Routes'

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <React.Fragment>
            <Navbar />
            <TransactionPopup />
            <Route component={Routes} />
            <ModalEntry />
          </React.Fragment>
        </Router>
      </ThemeProvider>
    )
  }
}

export default App
