import React from 'react'
import moment from 'moment'

export default class AutoDate extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { children } = this.props
    return moment(children)
      .fromNow()
      .replace('a few', '')
  }
}
