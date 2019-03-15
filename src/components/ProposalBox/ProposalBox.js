import React from 'react'

import ProposalBoxRender from './ProposalBoxRender'

export default class ProposalBox extends React.Component {
  state = {
    show: false,
  }

  toggleShow() {
    this.setState({ show: !this.state.show })
  }

  render() {
    return (
      <ProposalBoxRender
        {...this.props}
        {...this.state}
        toggleShow={this.toggleShow.bind(this)}
      />
    )
  }
}
