import React from 'react'
import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

const PAGESIZE = 10

export const LogFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return (
        prevProps.tcd !== this.props.tcd || prevProps.page !== this.props.page
      )
    }

    async fetch() {
      const { page = 1, tcd } = this.props
      const events = await Utils.getDataRequest('/logs', {
        limit: PAGESIZE,
        skip: page > 1 ? PAGESIZE * (page - 1) : undefined,
        tcd,
      })

      return events
    }
  },
)
