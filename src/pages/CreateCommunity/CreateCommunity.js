import React from 'react'
import PageContainer from 'components/PageContainer'
import CreateCommunityState from 'components/CreateCommunityState'
import CreateCommunityFooter from 'components/CreateCommunityFooter'
import Curves from 'curves'
import { BandProtocolClient, IPFS } from 'band.js'
import { Flex } from 'ui/common'
import { convertToChain } from 'utils/helper'
import { withRouter } from 'react-router-dom'

// page
import CreateCommunityInfo from 'pages/CreateCommunityInfo'
import CreateCommunityDistribution from 'pages/CreateCommunityDistribution'
import CreateCommunityParameters from 'pages/CreateCommunityParameters'

window.IPFS = IPFS

class CreateCommunity extends React.Component {
  state = {
    pageState: 0, // INFO = 0, DISTRIBUTION = 1, PARAMETERS = 2
    name: '',
    symbol: '',
    description: '',
    url: '',
    organization: '',
    logoUrl: null,
    bannerUrl: null,
    curve: new Curves['linear'](Curves['linear'].defaultParams),
    type: Curves['linear'].type, // linear, poly, sigmoid
    params: Curves['linear'].defaultParams,
    kvs: {
      'params:expiration_time': convertToChain(24, 'TIME', 'hours'),
      'params:min_participation_pct': convertToChain(60, 'PERCENTAGE'),
      'params:support_required_pct': convertToChain(50, 'PERCENTAGE'),
      'curve:liqudity_fee': convertToChain(0, 'PERCENTAGE'),
      'curve:inflation_rate': convertToChain(0, 'PERCENTAGE'),
      'info:logo': '',
      'info:banner': '',
    },
  }

  componentDidUpdate() {
    window.CreateCommState = this.state
  }

  setPageState(nextPageState) {
    const {
      name,
      symbol,
      description,
      url,
      organization,
      logoUrl,
      bannerUrl,
    } = this.state
    // TODO: regex check empty string and spacebar
    if (
      nextPageState >= 1 &&
      (name === '' ||
        symbol === '' ||
        description === '' ||
        url === '' ||
        organization === '' ||
        logoUrl === null ||
        bannerUrl === null)
    ) {
      alert('Please fill all form and upload images.')
      return
    }

    if (nextPageState >= 0 && nextPageState <= 2) {
      this.setState({
        pageState: nextPageState,
      })
    }
  }

  // Debug
  componentDidUpdate() {
    window.peach = this.state
  }

  // handle input in CreateCommunityInfo Page
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

  onCurveParamChange(k, v) {
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

  // handle key, value in CreateCommunityParameter Page
  setKeyValue(key, value) {
    if (value === null) return

    const kvs = { ...this.state.kvs, [key]: value }
    this.setState({
      kvs,
    })
  }

  // submit when everything done!
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
      keys.push(k)
      values.push(kvs[k].toString())
    }

    await bandClient.deployCommunity(
      this.state.name,
      this.state.symbol,
      this.state.kvs['info:logo'],
      this.state.kvs['info:banner'],
      this.state.description,
      this.state.url,
      this.state.organization,
      '0x6E9ea65099fC2948884Fb768B09E6559Af84Afe4', // this.state.voting,
      keys,
      values,
      this.state.curve.collateral,
    )

    this.props.history.push('/')
  }

  render() {
    const { pageState } = this.state
    return (
      <PageContainer>
        <Flex
          flexDirection="column"
          bg="white"
          style={{ borderRadius: '6px' }}
          mb="110px"
        >
          {/* Header State */}
          <CreateCommunityState
            pageState={pageState}
            setPageState={this.setPageState.bind(this)}
          />
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
              onParamChange={this.onCurveParamChange.bind(this)}
            />
          ) : (
            <CreateCommunityParameters
              kvs={this.state.kvs}
              setKeyValue={this.setKeyValue.bind(this)}
            />
          )}
        </Flex>
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

export default withRouter(CreateCommunity)
