import React, { Component } from 'react'
import './App.css'
import { ThemeProvider } from 'styled-components'
import theme from 'ui/theme'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from 'components/Navbar'

/** Pages */
import CommunitiesPage from './pages/Communities'

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <React.Fragment>
            <Navbar />
            <Route exact path="/" component={CommunitiesPage} />
          </React.Fragment>
        </Router>
      </ThemeProvider>
    )
  }
}

export default App
