import React from 'react'
import { Flex, Text } from 'ui/common'
import styled from 'styled-components'
import colors from 'ui/colors'

const Pagecontainer = styled.div`
  width: 900px;
  margin: auto;
`

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${p => (p.active ? colors.purple.dark : 'white')};
  ${p => (p.active ? '' : `border: 1px solid #d9d3fb;`)}
  width: 20px;
  height: 20px;
  position: relative;

  :after {
    position: absolute;
    top: 40px;
    content: '${p =>
      p.state === 0
        ? 'Basic Information'
        : p.state === 1
        ? 'Token Distribution'
        : 'Governance Parameters'}';
    left: ${p => (p.state == 0 ? '-50px' : p.state === 1 ? '-60px' : '-75px')};
    width: 200px;
    font-weight: ${p => (p.active ? '500' : '200')};
    color: ${p => (p.active ? colors.purple.dark : colors.normal)};
  }
`

const Line = styled.div`
  ${p =>
    p.active
      ? `border-top: 2px solid ${colors.purple.dark};`
      : `border-top: 1px solid #ded6ff;`}
  width: 280px;
`

const CommunityInfoState = () => (
  <React.Fragment>
    <Circle active state={0} />
    <Line />
    <Circle state={1} />
    <Line />
    <Circle state={2} />
  </React.Fragment>
)

const CommunityDistributionState = () => (
  <React.Fragment>
    <Circle active state={0} />
    <Line active />
    <Circle active state={1} />
    <Line />
    <Circle state={2} />
  </React.Fragment>
)
const CommunityParametersState = () => (
  <React.Fragment>
    <Circle active state={0} />
    <Line active />
    <Circle active state={1} />
    <Line active />
    <Circle active state={2} />
  </React.Fragment>
)

export default ({ pageState }) => (
  <Pagecontainer>
    <Flex
      style={{ height: '100px' }}
      justifyContent="center"
      alignItems="center"
    >
      {pageState === 0 ? (
        <CommunityInfoState />
      ) : pageState === 1 ? (
        <CommunityDistributionState />
      ) : (
        <CommunityParametersState />
      )}
    </Flex>
  </Pagecontainer>
)
