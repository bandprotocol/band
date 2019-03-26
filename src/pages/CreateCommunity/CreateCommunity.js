import React from 'react'
import PageContainer from 'components/PageContainer'
import CreateCommunityState from 'components/CreateCommunityState'
import CreateCommunityFooter from 'components/CreateCommunityFooter'
import Curves from 'curves'
import { BandProtocolClient } from 'band.js'
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
    logo: '',
    organization: '',
    //distribution
    curve: new Curves['linear'](Curves['linear'].defaultParams),
    type: Curves['linear'].type, // linear, poly, sigmoid
    params: Curves['linear'].defaultParams,
    kvs: {
      'params:expiration_time': '60',
      'params:min_participation_pct': '6000000000000',
      'params:support_required_pct': '5000000000000',
      'curve:liqudity_fee': '3',
      'curve:inflation_rate': '3',
      'info:name': '',
      'info:symbol': '',
      'info:description': '',
      'info:url': '',
      'info:organization': '',
      'info:logo': '',
      'info:banner': '',
    },
  }

  setPageState(nextPageState) {
    if (nextPageState >= 0 && nextPageState <= 2) {
      this.setState({
        pageState: nextPageState,
      })
    }
  }

  setKeyValue(key, value) {
    const kvs = { ...this.state.kvs, [key]: value }
    this.setState({
      kvs,
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
    this.setState(
      {
        params: {
          ...this.state.params,
          [k]: v,
        },
      },
      this.updateCurve.bind(this),
    )
  }

  // sumbit when everything done!
  async handleSubmit() {
    console.log('Congrats!!!', this.state)
    BandProtocolClient.setAPI('https://api-wip.rinkeby.bandprotocol.com')
    const bandClient = await BandProtocolClient.make({
      provider: window.web3.currentProvider,
    })

    const kvs = { ...this.state.kvs }
    delete kvs['info:name']
    delete kvs['info:symbol']
    delete kvs['info:description']
    delete kvs['info:url']
    delete kvs['info:organization']

    const keys = []
    const values = []
    for (var k in kvs) {
      keys.push(k)
      values.push(kvs[k])
    }

    await bandClient.deployCommunity(
      this.state.name,
      this.state.symbol,
      this.state.kvs['info:logo'],
      this.state.description,
      this.state.url,
      this.state.organization,
      '0xb1A10d0c283Ba23eb7894ba8C2Ba276fF4c7588f', // this.state.voting,
      keys,
      values,
      '(x^2 / 2000000000000000000000000000000000000) ^ 2', //this.state.collateralEquation,
    )
  }

  render() {
    const { pageState } = this.state
    return (
      <PageContainer style={{ backgroundColor: '#f9faff' }}>
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
            setKeyValue={this.setKeyValue.bind(this)}
          />
        )}
        {/* Footer */}
        <CreateCommunityFooter
          pageState={this.state.pageState}
          setPageState={this.setPageState.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
        />
      </PageContainer>
    )
  }
}
