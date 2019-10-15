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
import { IntlProvider } from 'react-intl'
import localeMessages from 'locales'
import bcp47 from 'bcp-47'
import moment from 'moment'

class App extends Component {
  state = {
    duration: moment.duration(0 * 1000, 'milliseconds'),
    isCountdown: moment.unix(moment().unix()).isBefore(moment.unix(1569844800)),
  }

  componentDidMount() {
    const eventTime = 1569844800
    const currentTime = moment().unix()

    const diffTime = eventTime - currentTime
    let duration = moment.duration(diffTime * 1000, 'milliseconds')
    const interval = 1000

    // set first time
    duration = moment.duration(duration - interval, 'milliseconds')

    this.countInterval = setInterval(() => {
      duration = moment.duration(duration - interval, 'milliseconds')
      if (duration._milliseconds <= 0) {
        this.setState({
          duration,
          isCountdown: false,
        })
        clearInterval(this.countInterval)
      }
      this.setState({
        duration,
      })
    }, interval)
  }

  componentWillUnmount() {
    clearInterval(this.countInterval)
  }
  render() {
    const language = bcp47.parse(navigator.language).language
    return (
      <IntlProvider
        locale={navigator.language}
        messages={
          localeMessages[language]
            ? localeMessages[language]
            : localeMessages['en']
        }
      >
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
      </IntlProvider>
    )
  }
}

const mapStateToProps = state => ({
  fetching: fetchSelector(state),
})

export default connect(mapStateToProps)(App)
