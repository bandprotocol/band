import React, { Component } from 'react'
import './App.css'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from 'ui/theme'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

import LandingPage from 'pages/Landing'
import CompanyPage from 'pages/Company'
import TCDPage from 'pages/products/TCD'
import TCRPage from 'pages/products/TCR'
import NotFoundPage from 'pages/404'

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <React.Fragment>
            <Navbar />
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/products/tcd" component={TCDPage} />
              <Route exact path="/products/tcr" component={TCRPage} />
              <Route exact path="/company" component={CompanyPage} />
              <Route path="/" component={NotFoundPage} />
            </Switch>
            <Footer />
          </React.Fragment>
        </Router>
      </ThemeProvider>
    )
  }
}
