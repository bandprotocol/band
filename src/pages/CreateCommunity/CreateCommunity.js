import React from 'react'
import PageContainer from 'components/PageContainer'
import CreateCommunityState from 'components/CreateCommunityState'
import CreateCommunityFooter from 'components/CreateCommunityFooter'
import Curves from 'curves'
import { BandProtocolClient } from 'band.js'
import { Flex } from 'ui/common'
import { convertToChain } from 'utils/helper'

// page
import CreateCommunityInfo from 'pages/CreateCommunityInfo'
import CreateCommunityDistribution from 'pages/CreateCommunityDistribution'
import CreateCommunityParameters from 'pages/CreateCommunityParameters'

export default class CreateCommunity extends React.Component {
  state = {
    pageState: 0, // INFO = 0, DISTRIBUTION = 1, PARAMETERS = 2
    //info
    name: '',
    symbol: '',
    description: '',
    url: '',
    logoUrl: null,
    bannerUrl: null,
    organization: '',
    //distribution
    curve: new Curves['linear'](Curves['linear'].defaultParams),
    type: Curves['linear'].type, // linear, poly, sigmoid
    params: Curves['linear'].defaultParams,
    kvs: {
      'params:expiration_time': '2',
      'params:min_participation_pct': '60',
      'params:support_required_pct': '50',
      'curve:liqudity_fee': '0',
      'info:logo': '',
      'info:banner': '',
    },
    kvsUnit: {
      'params:expiration_time': {
        type: 'TIME',
        unit: 'minutes',
      },
      'params:min_participation_pct': {
        type: 'PERCENTAGE',
        unit: '%',
      },
      'params:support_required_pct': {
        type: 'PERCENTAGE',
        unit: '%',
      },
      'curve:liqudity_fee': {
        type: 'PERCENTAGE',
        unit: '%',
      },
      'curve:inflation_rate': {
        type: 'PERCENTAGE',
        unit: '%',
      },
    },
  }

  setPageState(nextPageState) {
    if (nextPageState >= 0 && nextPageState <= 2) {
      this.setState({
        pageState: nextPageState,
      })
    }
  }

  setKeyValue(key, value, type, unit) {
    const kvs = { ...this.state.kvs, [key]: value }
    const kvsUnit = { ...this.state.kvsUnit, [key]: { type: type, unit: unit } }
    this.setState({
      kvs,
      kvsUnit,
    })
  }

  // for input form
  handleChange(e) {
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }

  // Token Distribution page
  updateCurve() {
    const { type, params } = this.state
    this.setState({
      curve: new Curves[type](params),
    })
  }

  setCurveType(type) {
    const params = Curves[type].defaultParams
    this.setState({
      curve: new Curves[type](params),
      type,
      params,
    })
  }

  onParamChange(k, v) {
    const valueToFixed = Math.floor(v * 1000) / 1000
    this.setState(
      {
        params: {
          ...this.state.params,
          [k]: valueToFixed,
        },
      },
      this.updateCurve.bind(this),
    )
  }

  // sumbit when everything done!
  async handleSubmit() {
    BandProtocolClient.setAPI('https://api-wip.rinkeby.bandprotocol.com')
    const bandClient = await BandProtocolClient.make({
      provider: window.web3.currentProvider,
    })

    const kvs = { ...this.state.kvs }
    // delete keys that won't use convertToChain
    delete kvs['info:logo']
    delete kvs['info:banner']

    // create keys, values array
    const keys = []
    const values = []
    for (var k in kvs) {
      if (this.state.kvsUnit[k] !== undefined) {
        const { type, unit } = this.state.kvsUnit[k]
        keys.push(k)
        values.push(convertToChain(kvs[k], type, unit).toString())
      }
    }

    await bandClient.deployCommunity(
      this.state.name,
      this.state.symbol,
      this.state.kvs['info:logo'],
      this.state.kvs['info:banner'],
      this.state.description,
      this.state.url,
      this.state.organization,
      '0xc36D339F7C1Fb31AFcFa117C9F67d9b57568A970', // this.state.voting,
      keys,
      values,
      this.state.curve.collateral,
    )
  }

  render() {
    const { pageState } = this.state
    return (
      <PageContainer>
        <Flex flexDirection="column" bg="white" style={{ borderRadius: '6px' }}>
          {/* Header State */}
          <CreateCommunityState pageState={pageState} />
          {/* Body */}
          {pageState === 0 ? (
            <CreateCommunityInfo
              {...this.state}
              handleChange={this.handleChange.bind(this)}
              setKeyValue={this.setKeyValue.bind(this)}
            />
          ) : pageState === 1 ? (
            <CreateCommunityDistribution
              {...this.state}
              setCurveType={this.setCurveType.bind(this)}
              onParamChange={this.onParamChange.bind(this)}
              setKeyValue={this.setKeyValue.bind(this)}
            />
          ) : (
            <CreateCommunityParameters
              kvs={this.state.kvs}
              setKeyValue={this.setKeyValue.bind(this)}
            />
          )}
          {/* Footer */}
          <CreateCommunityFooter
            pageState={this.state.pageState}
            setPageState={this.setPageState.bind(this)}
            handleSubmit={this.handleSubmit.bind(this)}
          />
        </Flex>
      </PageContainer>
    )
  }
}
