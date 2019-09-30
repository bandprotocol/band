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
import moment from 'moment'
import Countdown from 'pages/CountdownPage'
import { Flex } from 'rebass'

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
    const { isCountdown, duration } = this.state
    return isCountdown ? (
      <Flex width="100%" style={{ height: '100%' }}>
        <Countdown isCountdown={isCountdown} duration={duration}></Countdown>
      </Flex>
    ) : (
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
