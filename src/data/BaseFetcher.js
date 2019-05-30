import React from 'react'
import { isEqual } from 'lodash'

const AUTO_FETCH_INTERVAL = 20000

export default class BaseFetcher extends React.Component {
  state = { data: null, fetching: true }
  nextAutoFetch = null

  async componentDidMount() {
    if (!this.props.location) {
      throw new Error('Fetcher has to we wrapped with withRouter')
    }

    // Wait for fetch to be done then start the auto-fetch schedule
    await this._fetch()
    this.scheduleAutoFetch()
  }

  componentWillUnmount() {
    clearTimeout(this.nextAutoFetch)
  }

  async componentDidUpdate(prevProps) {
    // Check if the fetching params changes
    if (this.shouldFetch(prevProps)) {
      // Reset previous autoFetch schedule
      if (this.nextAutoFetch) {
        clearTimeout(this.nextAutoFetch)
        this.nextAutoFetch = null
      }
      // Wait for fetch to be done then start the auto-fetch schedule
      await this._fetch(false, true)
      this.scheduleAutoFetch()
    }
  }

  scheduleAutoFetch() {
    this.nextAutoFetch = setTimeout(async () => {
      this.nextAutoFetch = null
      await this._fetch(true)
      if (this.nextAutoFetch) clearTimeout(this.nextAutoFetch)
      this.scheduleAutoFetch()
    }, AUTO_FETCH_INTERVAL)
  }

  /** To be override */
  shouldFetch(prevProps) {
    return prevProps !== this.props
  }

  /** To be override */
  async fetch() {
    return null
  }

  async _fetch(autoFetching = false, forceUpdate = false) {
    if (!autoFetching) {
      this.setState({ fetching: true })
    }

    const pathName = this.props.location.pathname
    const data = await this.fetch()

    // Ignore fetch result if
    // (1) Route changes, or
    // (2) Fetched same data
    if (
      !forceUpdate &&
      (pathName !== this.props.location.pathname ||
        isEqual(data, this.state.data))
    ) {
      return false
    }

    this.setState({
      data,
      fetching: false,
    })
  }

  render() {
    const { children } = this.props
    const { fetching, data } = this.state

    const forceFetch = (autoFetching = false, forceUpdate = true) => this._fetch(autoFetching, forceUpdate)

    return children({ data, fetching, forceFetch })
  }
}
