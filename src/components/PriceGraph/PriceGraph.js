import React from 'react'

import PriceGraphRender from './PriceGraphRender'

export default class PriceGraph extends React.Component {
  componentDidMount() {
    this.props.loadPrice()
  }
  render() {
    return <PriceGraphRender data={this.props.data} />
  }
}
