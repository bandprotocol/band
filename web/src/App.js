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

import ScrollToTop from 'components/ScrollToTop'

import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

import LandingPage from 'pages/Landing'
import CompanyPage from 'pages/Company'
import WhyBand from './pages/WhyBand'
// import TCDPage from 'pages/products/TCD'
import TCRPage from 'pages/products/TCR'
import WalletPage from 'pages/products/Wallet'
import PrivateDataSharing from 'pages/products/PrivateDataSharing'
import DataTokenization from 'pages/products/DataTokenization'

// new design
import OverviewPage from 'pages/Feature/Overview'
import DualTokenPage from 'pages/Feature/DualToken'
import DataGovernancePortalPage from 'pages/Feature/DataGovernancePortal'
import TCDPage from 'pages/Feature/TCD'
import DeveloperPage from 'pages/Developer'

import NotFoundPage from 'pages/404'

export default () => (
  <ThemeProvider theme={theme}>
    <Router>
      <React.Fragment>
        <ScrollToTop />
        <Navbar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/features/overview" component={OverviewPage} />
          <Route exact path="/features/dual-token" component={DualTokenPage} />
          <Route exact path="/features/tcd" component={TCDPage} />
          <Route
            exact
            path="/features/data-governance-portal"
            component={DataGovernancePortalPage}
          />
          <Route exact path="/developer" component={DeveloperPage} />
          <Route exact path="/company/about-us" component={CompanyPage} />
          <Route exact path="/company/career" component={CompanyPage} />

          {/* <Route exact path="/products/tcd" component={TCDPage} /> */}
          <Route exact path="/products/tcr" component={TCRPage} />
          <Route exact path="/products/wallet" component={WalletPage} />
          <Route
            exact
            path="/products/data-tokenization"
            component={DataTokenization}
          />
          <Route
            exact
            path="/products/private-sharing"
            component={PrivateDataSharing}
          />
          <Route exact path="/company" component={CompanyPage} />
          <Route exact path="/why-band" component={WhyBand} />
          <Route path="/" component={NotFoundPage} />
        </Switch>
        <Footer />
      </React.Fragment>
    </Router>
  </ThemeProvider>
)
