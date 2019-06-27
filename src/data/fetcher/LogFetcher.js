import React from 'react'
import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

const PAGESIZE = 10

export const LogFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const events = await Utils.getDataRequest('/logs', { limit: 10 })

      console.log('events:', events)
    }
  },
)
