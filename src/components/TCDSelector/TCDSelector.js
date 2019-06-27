import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TCDSelectorRender from './TCDSelectorRender'
import { communityDetailSelector } from 'selectors/communities'
import { getTCDInfomation } from 'utils/tcds'

const mapStateToProps = (state, { communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })
  const tcds = community.get('tcds').toJS()
  return {
    tcds: Object.keys(tcds).map(key => {
      const tcdInfo = getTCDInfomation(tcds[key].prefix)
      return {
        tcdAddress: key,
        path: `/community/${communityAddress}/${key}/dataset`,
        ...tcdInfo,
      }
    }),
  }
}

export default withRouter(connect(mapStateToProps)(TCDSelectorRender))
