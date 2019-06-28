import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TCDSelectorRender from './TCDSelectorRender'
import { communityDetailSelector } from 'selectors/communities'
import { getTCDInfomation } from 'utils/tcds'
import { BackdropConsumer } from 'context/backdrop'

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })
  const tcds = community.get('tcds').toJS()
  return {
    tcds: Object.keys(tcds)
      .map(key => {
        const tcdInfo = getTCDInfomation(tcds[key].prefix)
        return {
          tcdAddress: key,
          datapoints: 10, // TODO: query this thing
          path: `/community/${communityAddress}/${key}/dataset`,
          ...tcdInfo,
        }
      })
      .sort((a, b) => {
        if (a.order < b.order) return -1
        return 1
      }),
  }
}

export default withRouter(
  connect(mapStateToProps)(
    class TCDSelector extends React.Component {
      render() {
        return (
          <BackdropConsumer>
            {({ showBackdrop, hideBackdrop }) => (
              <TCDSelectorRender
                {...this.props}
                showBackdrop={showBackdrop}
                hideBackdrop={hideBackdrop}
              />
            )}
          </BackdropConsumer>
        )
      }
    },
  ),
)
