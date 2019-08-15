import React from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.setTimeout(() => window.scroll(0, 0), 10)
    }
  }

  render() {
    return null
  }
}

export default withRouter(ScrollToTop)
