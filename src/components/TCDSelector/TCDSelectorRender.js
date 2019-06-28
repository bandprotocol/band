import React from 'react'
import styled from 'styled-components'
import { Flex, Image, Text, SubHighlightNavLink } from 'ui/common'
import { NavLink } from 'react-router-dom'
import colors from 'ui/colors'
import ClickOutSide from 'react-click-outside'
import TCDActive from 'images/tcdActive.svg'
import TCDInactive from 'images/tcdInactive.svg'
import Triangle from 'images/triangle.svg'
import DataLogInactive from 'images/dataLogInactive.svg'
import DataSetInactive from 'images/datasetInactive.svg'
import IntegrationInactive from 'images/integrationInactive.svg'
import GovernanceSrc from 'images/govInactive.svg'

const SelectionContainer = styled(Flex).attrs({
  bg: '#fff',
  flexDirection: 'column',
})`
  position: absolute;
  left: 230px;
  padding: 15px;
  width: 260px;
  z-index: 1;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 350ms;

  ${p =>
    p.show
      ? `
      opacity: 1;
      transform: translateY(0);
    `
      : `
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
    `}
`

const SelectionList = styled(Flex).attrs({
  bg: '#fff',
  alignItems: 'center',
})`
  cursor: pointer;
  height: 60px;
  border-radius: 3px;

  &: hover {
    background: #f2f5ff;
  }
`

const CurrentCard = styled(Flex)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  width: 100%;
  padding: 3px 5px 2px 5px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  & .tab {
    margin-top: 2px;
    color: #ffffff;
    border-radius: 28px;
    width: 100%;
  }

  ${p =>
    p.active
      ? `
    font-weight: 700;

    & .tab {
      opacity: 1;
      color: ${colors.blue.text};
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
      background-image: linear-gradient(
        257deg,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0.9) 100%
      );
    }

    & .img-active {
      display: block;
    }

    & .img-inactive {
      display: none;
    }

  `
      : `
      & .img-active {
        display: none;
      }

      & .img-inactive {
        display: block;
      }
      `}

  &:hover {
    ${p =>
      !p.active
        ? `
    & .tab {
      background-image: linear-gradient(
        257deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.2) 100%
      );
    }
    `
        : ``}

    }
  }
`

const List = ({
  imageInactive,
  label,
  datapoints,
  path,
  index,
  handleSelect,
}) => (
  <NavLink to={path} style={{ textDecoration: 'none' }}>
    <SelectionList onClick={() => handleSelect(index)}>
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{ minWidth: '50px' }}
      >
        <Image src={imageInactive} />
      </Flex>
      <Flex flexDirection="column" ml="14px">
        <Text fontSize="14px" fontWeight="900" color="#3b57d1">
          {label}
        </Text>
        <Text my={1} fontSize="10px" color="#a4b0e4" fontWeight="900">
          {datapoints} datapoints
        </Text>
      </Flex>
    </SelectionList>
  </NavLink>
)

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

  handleSelect(i) {
    this.setState({
      show: false,
      currentOption: this.props.tcds[i],
    })
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
          boxShadow: 'inset 0 1px 11px 0 rgba(0, 0, 0, 0.03)',
          borderRadius: '28px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <ClickOutSide onClickOutside={() => this.setState({ show: false })}>
          <Flex style={{ position: 'relative' }}>
            <CurrentCard
              active={active}
              onClick={() => this.setState({ show: !this.state.show })}
            >
              <Flex width="100%" style={{ height: '52px' }}>
                <Flex
                  flex={1}
                  flexDirection="row"
                  alignItems="center"
                  className="tab"
                  justifyContent="space-between"
                  pl="22px"
                  pr={3}
                >
                  <Flex alignItems="center">
                    <Image
                      src={currentOption && currentOption.imageActive}
                      className="img-active"
                      width="25px"
                    />
                    <Image
                      src={currentOption && currentOption.imageInactive}
                      className="img-inactive"
                      width="25px"
                    />
                    <Text pl="16px">{currentOption.shortLabel}</Text>
                  </Flex>
                  <Image src={Triangle} />
                </Flex>
              </Flex>
            </CurrentCard>
            <SelectionContainer show={this.state.show}>
              <Text fontSize="12px" color="#393939" fontWeight="700" ml={1}>
                SELECT FROM AVAILABLE DATA
              </Text>
              <Flex
                width="100%"
                bg="#e7ecff"
                my="8px"
                style={{ height: '2px' }}
              />
              {tcds.map((each, i) => (
                <List
                  index={i}
                  handleSelect={this.handleSelect.bind(this)}
                  {...each}
                />
              ))}
            </SelectionContainer>
          </Flex>
        </ClickOutSide>
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
