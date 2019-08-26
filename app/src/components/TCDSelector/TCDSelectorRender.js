import React from 'react'
import styled from 'styled-components'
import { Flex, Image, Text, SubHighlightNavLink } from 'ui/common'
import DataLogInactive from 'images/dataLogInactive.svg'
import DataSetInactive from 'images/datasetInactive.svg'
import IntegrationInactive from 'images/integrationInactive.svg'
import GovernanceSrc from 'images/govInactive.svg'

const SubTab = ({ link, img, children, tabStyle }) => (
  <SubHighlightNavLink to={link} activeClassName="is-active">
    <Flex style={{ height: 52 }}>
      <Flex
        flex={1}
        flexDirection="row"
        alignItems="center"
        className="tab"
        style={tabStyle}
        pl={4}
      >
        <Image src={img} width="20px" height="20px" />
        <Text px={3}>{children}</Text>
      </Flex>
    </Flex>
  </SubHighlightNavLink>
)

export default class TCDSelector extends React.Component {
  state = {
    show: false,
    currentOption:
      this.props.tcds.find(
        tcd => tcd.tcdAddress === this.props.match.params.tcd,
      ) ||
      this.props.tcds.find(tcd => tcd.order === 1) ||
      this.props.tcds[0],
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.tcd !== prevProps.match.params.tcd &&
      this.props.tcds.find(
        tcd => tcd.tcdAddress === this.props.match.params.tcd,
      )
    ) {
      this.setState({
        currentOption: this.props.tcds.find(
          tcd => tcd.tcdAddress === this.props.match.params.tcd,
        ),
      })
    }
  }

  toggleOptions() {
    if (this.state.show) {
      this.setState({ show: false })
      this.props.hideBackdrop()
    } else {
      this.setState({ show: true })
      this.props.showBackdrop()
    }
  }

  handleSelect(i) {
    this.setState({
      show: false,
      currentOption: this.props.tcds[i],
    })
    this.props.hideBackdrop()
  }

  render() {
    const { currentOption } = this.state
    const { tcds, communityAddress } = this.props
    const path =
      currentOption &&
      `/community/${communityAddress}/${currentOption.tcdAddress}`
    // TODO: Fix this shit later
    const active = document.location.pathname.split('/').length === 5

    return (
      <Flex
        flexDirection="column"
        mx="11px"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 20px 0px inset',
          borderRadius: '28px',
          backgroundColor: 'rgba(64, 70, 180, 0.3)',
        }}
      >
        <SubTab link={`${path}/dataset`} img={DataSetInactive}>
          Explore Data
        </SubTab>
        <SubTab link={`${path}/integration`} img={IntegrationInactive}>
          Integration
        </SubTab>
        <SubTab link={`${path}/governance`} img={GovernanceSrc}>
          Governance
        </SubTab>
        <SubTab
          link={`${path}/logs`}
          img={DataLogInactive}
          tabStyle={{
            borderBottomLeftRadius: '28px',
            borderBottomRightRadius: '28px',
          }}
        >
          Activity Logs
        </SubTab>
      </Flex>
    )
  }
}
