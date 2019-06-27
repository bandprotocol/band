import React from 'react'
import BaseFetcher from 'data/BaseFetcher'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Utils } from 'band.js'

export const LogFetcher = withRouter(
  class extends BaseFetcher {
    shouldFetch(prevProps) {
      return prevProps.type !== this.props.type
    }

    async fetch() {
      const events = await Utils.getDataRequest(
        '/logs/0x0233b33A43081cfeb7B49caf623b2b5841dB7596',
        { limit: 0 },
      )

      console.log('events:', events)
    }
  },
)
